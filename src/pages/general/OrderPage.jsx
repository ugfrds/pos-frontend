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
    }, [setTableNumber, setOrderItems, setPreviousOrderId]);

    // Initialize and clean up order data
    useEffect(() => {
        // Ensure we start with a clean order state immediately on mount
        try { resetOrder(); } catch (err) { /* ignore */ }

        const retrieveOrderData = () => {
            // Debug: log sources to help diagnose stale prepopulation
            try {
                console.debug('OrderPage init - location.state:', location.state);
                console.debug('OrderPage init - localStorage editOrderData:', localStorage.getItem('editOrderData'));
                console.debug('OrderPage init - current orderItems from context:', orderItems);
            } catch (err) {
                /* ignore */
            }
            // Prefer navigation state (clean) over localStorage.
            const navState = location.state && location.state.editOrder ? location.state.editOrder : null;

            if (navState) {
                const orderData = navState;
                if (orderData.tableNumber !== tableNumber) {
                    setTableNumber(orderData.tableNumber);
                }

                const items = orderData.OrderItems.map((item) => ({
                    id: item.MenuItem.id,
                    name: item.MenuItem.name,
                    price: item.price,
                    quantity: item.quantity,
                }));

                if (JSON.stringify(items) !== JSON.stringify(orderItems)) {
                    setOrderItems(items);
                }

                setPreviousOrderId(orderData.id);
                // remove any leftover localStorage markers to be safe
                try {
                    localStorage.removeItem('editOrderData');
                    localStorage.removeItem('editOrderFlag');
                } catch (err) {
                    /* ignore */
                }
                // Clear navigation state so refresh won't reapply it
                try { window.history.replaceState({}, document.title); } catch (err) { /* ignore */ }
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
            console.log("Cleanup: Resetting order state only if no tableNumber");
            if (!tableNumber) {
                console.log("Resetting order state");
                resetOrder(); // Reset only when absolutely necessary
            }
        };
    }, [paramTableNumber,  resetOrder, navigate,setOrderItems,setTableNumber]);

    useEffect(() => {
        if (location.state && location.state.newItem) {
            addOrderItem(location.state.newItem);
            // Clear the state to prevent re-adding on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state, addOrderItem]);

    
    
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
