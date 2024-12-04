import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import ReceiptPanel from '../../components/Orders/ReceiptPanel';
import MenuPage from './MenuPage';
import { OrderContext} from '../../context/OrderContext';
import './OrderPage.css'; 
import NavBar from '../../components/Dashboard/Navbar';
import OrderConfirmationModal from '../../components/Orders/OrderConfirmationModal';
import {createOrder} from '../../api';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import { deleteOrder } from '../../api';


const OrderPage = () => {    
    
    const { tableNumber: paramTableNumber } = useParams();
    const {orderItems, addOrderItem, tableNumber, setTableNumber, resetOrder, setOrderItems, orderType,updateOrderStatus } = useContext(OrderContext);
    const navigate = useNavigate(); 
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const { user, business } = useContext(UserBusinessContext); 

    useEffect(() => {
         // Retrieve the order data from local storage if present
         const editOrderData = localStorage.getItem('editOrderData');
         if (editOrderData) {
             const orderData = JSON.parse(editOrderData);
             //console.log(orderData)
             setTableNumber(orderData.tableNumber);
             const items = orderData.OrderItems.map((item) => ({
                id: item.MenuItem.id,
                name: item.MenuItem.name,
                price: item.price,
                quantity: item.quantity
            }));

            setOrderItems(items);  // Set the pre-filled items from the pending order
            //  if (orderData.id) {
            //     console.log (typeof deleteOrder);
            // //   deleteOrder(orderData.id)
            // //  .then(() => console.log(`Order with ID ${orderData.id} deleted`))
            // //  .catch((err) => console.error(`Failed to delete order: ${err.message}`));
            // }
             localStorage.removeItem('editOrderData'); // Clean up
          } else  if (!tableNumber && paramTableNumber) {
            // Set the table number in the context if it's not already set
            setTableNumber(paramTableNumber);
        } else if (!tableNumber) {
            // Redirect to TablesPage if no table number is available
            navigate('/tables');
        }
        return () => {
            // Reset the order state when the component unmounts
            resetOrder();
        };
    },[], [tableNumber, paramTableNumber, setTableNumber, navigate]);

    const handlePlaceOrder = () => {
        setShowModal(true); // Show the order confirmation modal
    };
    
    const handleConfirmOrder = () => {
        setShowModal(false);
    
        //Generate a unique 5-digit order ID
        const generateOrderId = () => {
            return Math.floor(10000 + Math.random() * 90000).toString();
        };
    
        const generateReceiptnumber = () => {
            return Math.floor(10000 + Math.random() * 90000).toString();
        };

        const orderId = generateOrderId();
        const receiptNumber = generateReceiptnumber();
        
        localStorage.setItem(
            `receipt-${orderId}`,
            JSON.stringify({
                tableNumber,
                orderType,
                orderItems,
                subtotal,
                tax,
                serviceCharge,
                total,
                orderId, // Store the unique order ID
                time: Date.now() // Store the timestamp for the receipt
            })
        );
        const username = sessionStorage.getItem('username');

        const orderData ={ username,
             tableNumber, 
             orderType:'Dine-In', 
             items:orderItems, 
             totalAmount:total , 
             receiptNumber,
             subtotal,
             tax
        }
        console.log (total);
        createOrder(orderData);
    // Update the order status in the context
    updateOrderStatus(tableNumber, orderId, 'In Progress');
   
        // Reset the order after confirming
        window.location.href = '/pending';
        // Redirect to active orders page
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
