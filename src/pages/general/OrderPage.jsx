import { useContext, useEffect, useState,  useCallback  } from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import ReceiptPanel from '../../components/Orders/ReceiptPanel';
import MenuPage from './MenuPage';
import './OrderPage.css'; // Import your custom CSS file
import NavBar from '../../components/Dashboard/Navbar';
import OrderConfirmationModal from '../../components/Orders/OrderConfirmationModal';
import { deleteOrder, createOrder } from '../../api';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import { OrderContext } from '../../context/OrderContext';


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
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const { user, business } = useContext(UserBusinessContext);
    const [previousOrderId, setPreviousOrderId] = useState(null); 

   
    // Memoize resetOrder to avoid unnecessary re-renders
    const resetOrder = useCallback(() => {
        console.log("Resetting order state");
        setTableNumber(null);
        setOrderItems([]);
        setPreviousOrderId(null);
    }, [setTableNumber, setOrderItems, setPreviousOrderId]);

    // Initialize and clean up order data
    useEffect(() => {
        const retrieveOrderData = () => {
            const editOrderData = localStorage.getItem('editOrderData');
            if (editOrderData) {
                const orderData = JSON.parse(editOrderData);

                if (orderData.tableNumber !== tableNumber) {
                    console.log("Updating tableNumber:", orderData.tableNumber);
                    setTableNumber(orderData.tableNumber);
                }

                const items = orderData.OrderItems.map((item) => ({
                    id: item.MenuItem.id,
                    name: item.MenuItem.name,
                    price: item.price,
                    quantity: item.quantity,
                }));

                if (JSON.stringify(items) !== JSON.stringify(orderItems)) {
                    console.log("Updating orderItems");
                    setOrderItems(items);
                }

                setPreviousOrderId(orderData.id);
                localStorage.removeItem('editOrderData');
            } else if (!tableNumber && paramTableNumber) {
                console.log("Setting tableNumber from paramTableNumber:", paramTableNumber);
                setTableNumber(paramTableNumber);
            } else if (!tableNumber) {
                navigate('/tables');
            }
        };

        retrieveOrderData();

        return () => {
            console.log("Cleanup: Resetting order state only if no tableNumber");
            if (!tableNumber) {
                console.log("Resetting order state");
                resetOrder(); // Reset only when absolutely necessary
            }
        };
    }, [paramTableNumber,  resetOrder, navigate,setOrderItems,setTableNumber]);

    
    
    const handlePlaceOrder = () => {
        setShowModal(true); // Show the order confirmation modal
    };

    const handleConfirmOrder = async () => {
        setShowModal(false);

        const generateUniqueId = () => Math.floor(10000 + Math.random() * 90000).toString();
        const orderId = generateUniqueId();
        const receiptNumber = generateUniqueId();

        const subtotal = calculateSubtotal(orderItems); // Create helper function for subtotal
        const tax = calculateTax(subtotal); // Create helper function for tax
        const serviceCharge = calculateServiceCharge(subtotal); // Helper function
        const total = subtotal + tax + serviceCharge;

        localStorage.setItem(
            `receipt-${orderId}`,
            JSON.stringify({
                tableNumber,
                orderItems,
                subtotal,
                tax,
                serviceCharge,
                total,
                orderId,
                time: Date.now(),
            })
        );

        const username = sessionStorage.getItem('username');

        const orderData = {
            username,
            tableNumber,
            items: orderItems,
            totalAmount: total,
            receiptNumber,
            subtotal,
            tax,
        };

        try {
            await createOrder(orderData);
            updateOrderStatus(tableNumber);

            console.log('Order created successfully:', orderData);

            // If a previous order ID exists, delete the old order
            if (previousOrderId) {
                try {
                    await deleteOrder(previousOrderId);
                    console.log(`Deleted previous order with ID: ${previousOrderId}`);
                } catch (error) {
                    console.error('Failed to delete previous order:', error);
                }
            }

            // Redirect to pending orders page
            navigate('/pending');
        } catch (error) {
            console.error('Failed to create order:', error);
        }
    };


    const handleCancelOrder = () => {
        // Reset the order state
        resetOrder();
        // Redirect back to the TablesPage to start a new order
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
    const calculateServiceCharge = (subtotal) => {
        return orderType === 'sit-in' ? subtotal * 0.05 : 0;
    };

    // Calculate total
    const calculateTotal = (subtotal, tax, serviceCharge) => {
        return subtotal + tax + serviceCharge;
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const serviceCharge = calculateServiceCharge(subtotal, orderType);
    const total = calculateTotal(subtotal, tax, serviceCharge);

    ///BUsiness settings;
    const businessName = business.settings.name
    

    return (
        <Container fluid className="order-page-container">
            <Row className="h-100">
                <NavBar />
                <Col md={10} className="menu-col">
                    <MenuPage addItemToOrder={addOrderItem} />
                </Col>
                
                {orderItems.length > 0 && (
                    <div className="floating-receipt-panel">
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
                            servedBy={user.username ? user.username : 'Guest'} // 
                            restaurantName={businessName ? `${businessName} Restaurant` : 'Restaurant '} // 
                        
                        />
                    </div>
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
