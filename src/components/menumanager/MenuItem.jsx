import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { OrderContext } from '../../context/OrderContext';
import { FaUtensils , FaBeer, FaBox  } from 'react-icons/fa';
import { FormatCurrency } from '../../utils/index'; 
import { UserBusinessContext } from '../../context/UserBusinessContext';

/**
 * @param {Object} item - The order item to be processed.
 * @param {string} item.name - The name of the product.
 * @param {number} item.quantity - The quantity of the product ordered.
 * @param {number} item.price - The price per unit of the product.
 */

const MenuItem = ({ item }) => {
    const { addOrderItem, tableNumber, setTableNumber } = useContext(OrderContext);
    const navigate = useNavigate();
    const { business } = useContext(UserBusinessContext); 
    const currency = business.settings.currency;
    const type = business.settings.businessType;

    const handleAddToOrder = () => {
        if (type !== 'Bar' && type !== 'Restaurant') {
            // If business type is not bar or restaurant, use a default table number
            const defaultTableNumber = '1'; 
            setTableNumber(defaultTableNumber); // Set default table number in context
            navigate(`/order/${defaultTableNumber}`, { state: { newItem: item } }); // Navigate to the order page with the item
        } else if (!tableNumber) {
            // If no table is selected, navigate to tables page
            navigate('/tables');
        } else {
            // Otherwise, add item to the order
            addOrderItem(item);
        }
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        handleAddToOrder();
    };

    const BusinessIcon = ({ type }) => {
        // Dynamically determine the icon based on business type
        const getIcon = () => {
          switch (type) {
            case "Bar":
              return <FaBeer size={50} className="mb-3 text-yellow-500" />;
            case "Restaurant":
              return <FaUtensils size={50} className="mb-3 " />;
            default:
              return <FaBox size={50} className="mb-3 text-gray-500" />;
          }
        };
        return <div>{getIcon()}</div>;
    };

    return (
        <Card className="mb-3 shadow-sm text-center" onClick={handleAddToOrder} style={{ cursor: 'pointer' }}>
            <Card.Body>
                <BusinessIcon type={type} />  
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{FormatCurrency(item.price,currency)}</Card.Text>
                <Button variant="success" onClick={handleButtonClick}>Add to Order</Button>
            </Card.Body>
        </Card>
    );
};

export default MenuItem;
