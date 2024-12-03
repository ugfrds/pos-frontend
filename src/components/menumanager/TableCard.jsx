
import { useNavigate } from 'react-router-dom';


const TableCard = ({ tableName, tableNumber, activeOrders }) => {
    const navigate = useNavigate();
    

    

    const cardStyle = {
        backgroundColor: activeOrders > 0 ? '#e9f5e9' : '#fff',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: activeOrders > 0 ? '2px solid #28a745' : 'none',
        minHeight: '90px',
        cursor: 'pointer',
    };

    const buttonStyle = {
        marginTop: '8px',
        padding: '6px 10px',
        fontSize: '14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const badgeStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '20px',
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '12px',
    };
    const A_orders = activeOrders;
    const handleClick = () => {
        console.log(`Active orders for Table ${tableNumber}: ${A_orders}`);
        navigate(`/order/${tableNumber}`);
        
    };
    
    return ( 
        <div style={cardStyle} onClick={handleClick}>
            {console.log(`Active orders for Table ${tableNumber}: ${A_orders}`)}
            {A_orders > 0 && <div style={badgeStyle}>{A_orders}</div>}
            <h3>{tableName}</h3>
            <button 
                style={buttonStyle}
                onClick={(e) => {
                    e.stopPropagation();  // Prevents the click event from bubbling to the parent div
                    //updateOrderStatus(tableNumber, Date.now(), 'In Progress'); // Example of updating order status
                    navigate(`/order/${tableNumber}`);
                }}
            >
                <i className="fas fa-plus"></i> Add Order
            </button>
        </div>
    );
};

export default TableCard;
