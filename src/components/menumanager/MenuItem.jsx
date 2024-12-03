import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { OrderContext } from '../../context/OrderContext';
import { FaUtensils } from 'react-icons/fa';
import { FormatCurrency } from '../../utils/index'; 
import { UserBusinessContext } from '../../context/UserBusinessContext';

/**
 * @param {Object} item - The order item to be processed.
 * @param {string} item.name - The name of the product.
 * @param {number} item.quantity - The quantity of the product ordered.
 * @param {number} item.price - The price per unit of the product.
 */

const MenuItem = ({ item }) => {
    const { addOrderItem, tableNumber } = useContext(OrderContext);
    const navigate = useNavigate();
    const { business } = useContext(UserBusinessContext); 
    const currency = business.settings.currency;

    const handleAddToOrder = () => {
        if (!tableNumber) {
            // Redirect to tables page if no table is selected   
            navigate('/tables');
        } else {
            // Otherwise, add item to order
            addOrderItem(item); 
        }
    };

    return (
        <Card className="mb-3 shadow-sm text-center">
            <Card.Body>
                <FaUtensils size={50} className="mb-3" /> {/* Using the icon instead of an image */}
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{FormatCurrency(item.price,currency)}</Card.Text>
                <Button variant="success" onClick={handleAddToOrder}>Add to Order</Button>
            </Card.Body>
        </Card>
    );
};

export default MenuItem;
