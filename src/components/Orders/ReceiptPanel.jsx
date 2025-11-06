import { ListGroup, Button, Spinner } from 'react-bootstrap';
import { X, Plus, Minus } from 'lucide-react';
import './ReceiptPanel.css'; // Import the CSS file for additional styling
import { FormatCurrency } from '../../utils/index';
import { useContext } from 'react';
import { UserBusinessContext } from '../../context/UserBusinessContext';

const ReceiptPanel = ({
    receiptItems = [],
    subtotal = 0,
    tax = 0,
    serviceCharge = 0,
    total = 0,
    orderType,
    tableNumber,
    servedBy, // Commented out: username of the person who served the order
    restaurantName, // Commented out: name of the restaurant
    onIncreaseQuantity,
    onDecreaseQuantity,
    onRemoveItem,
    handlePlaceOrder,
    onCancelOrder
}) => {  const { business } = useContext(UserBusinessContext);
         const currency = business.settings.currency;
    return (
        <div className="receipt-panel">
            <header className="receipt-header">
                <h4>Order Summary</h4>
                
                <p className="restaurant-name">{restaurantName}</p> 
                <p className="table-number">Table: {tableNumber}</p>
            </header>

            <ListGroup variant="flush" className="receipt-list">
                {receiptItems.length > 0 ? receiptItems.map((item, index) => (
                    <ListGroup.Item key={index} className="receipt-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="item-info d-flex align-items-center">
                                <span 
                                    className="receipt-panel-quantity-btn receipt-panel-decrease-btn me-2"
                                    onClick={() => onDecreaseQuantity(index)}
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus size={16} />
                                </span>
                                     <span className="item-name me-2">{item.name}</span>
                                     <span className="item-quantity quantity-badge">{item.quantity}</span>                            </div>
                            <div className="item-actions d-flex align-items-center">
                                <span className="item-price me-2">
                                    {FormatCurrency(item.price, currency)}
                                </span>
                                <span 
                                    className="receipt-panel-quantity-btn receipt-panel-increase-btn"
                                    onClick={() => onIncreaseQuantity(index)}
                                >
                                    <Plus size={16} />
                                </span>
                                <span 
                                    className="receipt-panel-remove-item-btn ms-2" 
                                    onClick={() => onRemoveItem(index)}
                                >
                                    <X size={16} />
                                </span>
                            </div>
                        </div>
                        {item.notes && <small className="text-muted item-notes">({item.notes})</small>}
                    </ListGroup.Item>
                )) : (
                    <ListGroup.Item className="text-center text-muted">
                        No items added to the order.
                    </ListGroup.Item>
                )}
            </ListGroup>
           
            <div className="receipt-summary">
                <p><strong>Subtotal:</strong> {FormatCurrency(subtotal, currency)}</p>
                <p><strong>Tax:</strong> {FormatCurrency(tax,currency)}</p>
                {orderType === 'sit-in' && (
                    <p><strong>Service Charge:</strong> {FormatCurrency(serviceCharge, currency)}</p>
                )}
                <h5><strong>Total:</strong> {FormatCurrency(total, currency)}</h5>
            </div>

            <footer className="receipt-footer">
                {/* Uncomment when served by username is available */}
                {<p className="served-by">Served by: {servedBy}</p> }
                <div className="receipt-actions">
                    <Button 
                        variant="success" 
                        className="w-100 mb-2" 
                        onClick={handlePlaceOrder}
                        disabled={receiptItems.length === 0} 
                    >
                        Place Order
                    </Button>
                    <Button 
                        variant="danger" 
                        className="w-100" 
                        onClick={onCancelOrder}
                    >
                        Cancel Order
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default ReceiptPanel;
