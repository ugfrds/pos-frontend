import { useContext, useEffect, useState,  useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import ReceiptPanel from '../../components/Orders/ReceiptPanel';
import MenuPage from './MenuPage';
import './OrderPage.css'; // Import your custom CSS file
import NavBar from '../../components/Dashboard/Navbar';
import OrderConfirmationModal from '../../components/Orders/OrderConfirmationModal';
import { deleteOrder, createOrder, updateOrder } from '../../api';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import { OrderContext } from '../../context/OrderContext';
import useWindowSize from '../../hooks/useWindowSize';


const OrderPage = () => {
    const { tableNumber: paramTableNumber } = useParams();
    const {
        orderItems,
        addOrderItem,
        tableNumber,
        setTableNumber,
        setOrderItems,
        orderType,
        updateOrderStatus,
    } = useContext(OrderContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [initialized, setInitialized] = useState(false);
    const { user, business } = useContext(UserBusinessContext);
    const [previousOrderId, setPreviousOrderId] = useState(null); 
    const { width } = useWindowSize();
    const isMobile = width <= 768; // Define mobile breakpoint
    const [showReceipt, setShowReceipt] = useState(!isMobile);

   
    // Memoize resetOrder to avoid unnecessary re-renders
    const resetOrder = useCallback(() => {
        console.log("Resetting order state");
        setTableNumber(null);
        setOrderItems([]);
        setPreviousOrderId(null);
        setHasProcessedNewItem(false); // Reset the new item processing flag
    }, [setTableNumber, setOrderItems, setPreviousOrderId]);

    // Initialize and clean up order data
useEffect(() => {
    // Ensure we start with a clean order state immediately on mount
    const retrieveOrderData = () => {
        console.log("Retrieving order data, current state:", {
            locationState: location.state,
            orderItems: orderItems
        });
        
        const navState = location.state?.editOrder ?? null;
        const hasNewItem = location.state?.newItem ?? null;

        if (navState) {
            const orderData = navState;
            setTableNumber(orderData.tableNumber);

            const itemsFromNav = orderData.OrderItems.map((item) => ({
                id: item.MenuItem.id,
                name: item.MenuItem.name,
                price: item.price,
                quantity: item.quantity,
            }));

            // Only set items if we don't already have items (prevents wiping out new items)
            if (orderItems.length === 0 || !hasNewItem) {
                setOrderItems(itemsFromNav);
                console.log("Set items from nav:", itemsFromNav);
            }

            setPreviousOrderId(orderData.id);

            // Cleanup
            localStorage.removeItem('editOrderData');
            localStorage.removeItem('editOrderFlag');
            window.history.replaceState({}, document.title);
            return;
        }



            // If no navigation state supplied, proactively clear any stale localStorage entries
            try {
                localStorage.removeItem('editOrderData');
                localStorage.removeItem('editOrderFlag');
            } catch (err) {
                /* ignore */
            }

            if (!tableNumber && paramTableNumber) {
                console.log("Setting tableNumber from paramTableNumber:", paramTableNumber);
                // Starting a new order via URL param: ensure any previous in-memory order state is cleared
                try {
                    resetOrder();
                } catch (err) {
                    console.warn('Failed to reset order state before starting new order', err);
                }
                setTableNumber(paramTableNumber);
            } else if (!tableNumber) {
                navigate('/tables');
            }
        };

        retrieveOrderData();
        setInitialized(true);

        return () => {
            // Only reset if we're actually navigating away from the order
            if (!location.state?.editOrder && !location.state?.newItem) {
                console.log("Cleanup: Resetting order state - no active order");
                resetOrder();
            }
        };
    }, [paramTableNumber,  resetOrder, navigate,setOrderItems,setTableNumber]);

    const [hasProcessedNewItem, setHasProcessedNewItem] = useState(false);

    useEffect(() => {
        if (!initialized || hasProcessedNewItem) return;

        console.log("New item effect running:", {
            locationState: location.state,
            initialized
        });

        if (location.state?.newItem) {
            const newItem = location.state.newItem;
            
            setOrderItems(prevItems => {
                console.log("Adding new item, current items:", prevItems);
                
                // Always preserve existing items and add new one
                const existingItems = [...prevItems];
                const existingIndex = existingItems.findIndex(i => i.id === newItem.id);
                
                if (existingIndex !== -1) {
                    existingItems[existingIndex] = {
                        ...existingItems[existingIndex],
                        quantity: existingItems[existingIndex].quantity + 1
                    };
                } else {
                    existingItems.push({ ...newItem, quantity: 1 });
                }
                
                console.log("Updated items:", existingItems);
                return existingItems;
            });

            // Mark that we've processed this new item
            setHasProcessedNewItem(true);

            // Clear the navigation state after processing
            window.history.replaceState(
                { editOrder: location.state.editOrder }, // Preserve edit order state
                document.title
            );
        }
    }, [location.state, initialized, hasProcessedNewItem]);

    
    
    const handlePlaceOrder = () => {
        setShowModal(true); // Show the order confirmation modal
    };

    const handleConfirmOrder = async () => {
        setShowModal(false);

        const subtotal = calculateSubtotal(orderItems);
        const tax = calculateTax(subtotal);
        const serviceCharge = calculateServiceCharge(subtotal);
        const total = subtotal + tax + serviceCharge;

        const username = sessionStorage.getItem('username');

        const orderData = {
            username,
            tableNumber,
            items: orderItems,
            totalAmount: total,
            subtotal,
            tax,
        };

        const generateUniqueId = () => Math.floor(10000 + Math.random() * 90000).toString();

        try {
            if (previousOrderId) {
                // This is an update of an existing order.
                const updatedOrderData = {
                    ...orderData,
                    receiptNumber: generateUniqueId(),
                };
                await updateOrder(previousOrderId, updatedOrderData);
                console.log('Order updated successfully:', previousOrderId);
            } else {
                // This is a new order.
                const newOrderData = {
                    ...orderData,
                    receiptNumber: generateUniqueId(),
                };
                await createOrder(newOrderData);
                updateOrderStatus(tableNumber);
                console.log('Order created successfully:', newOrderData);
            }

            navigate('/pending');
        } catch (error) {
            console.error('Failed to save order:', error);
        }
    };
    //business type
    const type = business.settings.businessType;
    const handleCancelOrder = () => {
        // Reset the order state
        resetOrder();
        // Redirect back to the TablesPage to start a new order
        if (type !== 'Bar' && type !== 'Restaurant')
        {
           navigate('/dashboard'); 
        }
        else
        navigate('/tables');
    };

    const handleIncreaseQuantity = (index) => {
        const updatedItems = [...orderItems];
        updatedItems[index].quantity += 1;
        setOrderItems(updatedItems);
    };
    
    const handleDecreaseQuantity = (index) => {
        const updatedItems = [...orderItems];
        if (updatedItems[index].quantity > 1) {
            updatedItems[index].quantity -= 1;
            setOrderItems(updatedItems);
        }
    };
    
    const handleRemoveItem = (index) => {
        const updatedItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedItems);
    };

    // Calculate subtotal
    const calculateSubtotal = () => {
        return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    // Calculate tax (e.g., 10% of subtotal)

    const taxPercentage = business.settings.taxPercentage; // calculate from business settings
    const calculateTax = (subtotal) => {
        return subtotal * taxPercentage * 0.01;
    };

    // Calculate service charge (e.g., 5% of subtotal for sit-in orders)
     const sC= business.settings.serviceCharge;
    const calculateServiceCharge = (subtotal) => {
        return subtotal * sC * 0.01;
    };

    // Calculate total
    const calculateTotal = (subtotal, tax, serviceCharge) => {
        return subtotal + tax + serviceCharge;
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const serviceCharge = calculateServiceCharge(subtotal);
    const total = calculateTotal(subtotal, tax, serviceCharge);

    ///BUsiness settings;
    const businessName = business.settings.name
    

    if (!initialized) {
        return (
            <Container fluid className="order-page-container d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid className="order-page-container">
    <Row className="h-100">
        {/* Navbar */}
        <NavBar />

        {/* Menu Items Section */}
        <Col md={isMobile ? 12 : 10} className="menu-col">
            <MenuPage addItemToOrder={addOrderItem} />
        </Col>

        {/* Receipt Panel Logic */}
        {orderItems.length > 0 && (
            isMobile ? (
                <div className="mobile-receipt-container">
                    {!showReceipt ? (
                        <button 
                            className="toggle-receipt-button" 
                            onClick={() => setShowReceipt(true)}
                        >
                            Show Receipt
                        </button>
                    ) : (
                        <div className="floating-receipt-panel">
                            <button 
                                className="toggle-receipt-button" 
                                onClick={() => setShowReceipt(false)}
                            >
                                Hide Receipt
                            </button>
                            <ReceiptPanel
                                receiptItems={orderItems}
                                tableNumber={tableNumber}
                                subtotal={subtotal}
                                tax={tax}
                                serviceCharge={serviceCharge}
                                total={total}
                                handlePlaceOrder={handlePlaceOrder}
                                onCancelOrder={handleCancelOrder}
                                onIncreaseQuantity={handleIncreaseQuantity}
                                onDecreaseQuantity={handleDecreaseQuantity}
                                onRemoveItem={handleRemoveItem}
                                servedBy={user.username ? user.username : 'Guest'}
                                restaurantName={businessName ? `${businessName} Restaurant` : 'Restaurant'}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <Col md={2} className="floating-receipt-panel">
                    <ReceiptPanel
                        receiptItems={orderItems}
                        tableNumber={tableNumber}
                        subtotal={subtotal}
                        tax={tax}
                        serviceCharge={serviceCharge}
                        total={total}
                        handlePlaceOrder={handlePlaceOrder}
                        onCancelOrder={handleCancelOrder}
                        onIncreaseQuantity={handleIncreaseQuantity}
                        onDecreaseQuantity={handleDecreaseQuantity}
                        onRemoveItem={handleRemoveItem}
                        servedBy={user.username ? user.username : 'Guest'}
                        restaurantName={businessName ? `${businessName} Restaurant` : 'Restaurant'}
                    />
                </Col>
            )
        )}
    </Row>


            {/* Order Confirmation Modal */}
            <OrderConfirmationModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleConfirm={handleConfirmOrder}
                tableNumber={tableNumber}
                orderType={orderType}
                receiptItems={orderItems}
                subtotal={subtotal}
                tax={tax}
                serviceCharge={serviceCharge}
                total={total}
                servedBy={ user.username } // 
                restaurantName={businessName }
            />
        </Container>
    );
};

export default OrderPage;
