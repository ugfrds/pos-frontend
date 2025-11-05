import { Modal, Button } from 'react-bootstrap';
import '../styles/OrderConfirmationModal.css'; // Import the CSS file for additional styling
import { FormatCurrency } from '../../utils/index';
import { useContext } from 'react';
import { UserBusinessContext } from '../../context/UserBusinessContext';
const OrderConfirmationModal = ({ 
    show, 
    handleClose, 
    handleConfirm,
    tableNumber,
    orderType,
    receiptItems,
    subtotal,
    tax,
    serviceCharge,
    total,
    //restaurantName
}) => {  const { business } = useContext(UserBusinessContext);
         const currency = business.settings.currency;
    return (
        <Modal className="receipt-modal" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>Order Summary</h3>
                {/*<h5> restaurantName}</h5>*/}
                <p><strong>Table:</strong> {tableNumber}</p>
                {receiptItems.map((item, index) => (
                    <div key={index} className="receipt-item">
                        <p>{item.name} x {item.quantity}</p>
                      
                        <p>{FormatCurrency(item.price * item.quantity, currency)}</p>
                    </div>
                ))}
                <p><strong>Subtotal:</strong>  {FormatCurrency(subtotal,currency)}</p>
                <p><strong>Tax:</strong> {FormatCurrency(tax, currency)}</p>
                {orderType === 'sit-in' && <p><strong>Service Charge:</strong> {FormatCurrency(serviceCharge, currency)} </p>}
                <h5><strong>Total:</strong>  {FormatCurrency(total, currency)}</h5>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>Cancel</Button>
                <Button variant="success" onClick={handleConfirm}>Confirm Order</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderConfirmationModal;
