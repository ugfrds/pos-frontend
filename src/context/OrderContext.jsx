
import { createContext, useState, useEffect, useCallback } from 'react';
import { getAllOrders } from '../api';

// Create the context
export const OrderContext = createContext();

// Create a provider component
export const OrderProvider = ({ children }) => {
    // State to hold the current order's items
    const [orderItems, setOrderItems] = useState([]);
    
    // State to hold the selected table number
    const [tableNumber, setTableNumber] = useState(null);
    
    // State to hold the order type (e.g., 'Sit-In', 'Takeaway')
    // const [orderType, setOrderType] = useState(null);
    
    // State to hold active orders
    const [activeOrders, setActiveOrders] = useState([]);

   // Fetch pending orders from the database and group them by table
   useEffect(() => {
    const fetchPendingOrders = async () => {
        try {
            const filters = { status: 'pending' }; // Fetch only pending orders
            const response = await getAllOrders(filters);

            // Group pending orders by tableNumber and count the orders per table
            const groupedOrders = response.orders.reduce((acc, order) => {
                const table = acc.find((o) => o.tableNumber === order.tableNumber);
                if (table) {
                    table.activeOrderCount += 1; // Increment count if table exists
                } else {
                    acc.push({ tableNumber: order.tableNumber, activeOrderCount: 1 }); // Add new table entry
                }
                return acc;
            }, []);

            setActiveOrders(groupedOrders);
        } catch (error) {
            console.error('Failed to fetch pending orders:', error);
        }
    };

    fetchPendingOrders();
}, []);
    // Function to add an item to the order
    const addOrderItem = useCallback((item) => {
        setOrderItems((prevItems) => {
            // Check if the item is already in the order
            const existingItemIndex = prevItems.findIndex(prevItem => prevItem.name === item.name);
    
            if (existingItemIndex !== -1) {
                // If the item exists, increase its quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                // If the item does not exist, add it with a quantity of 1
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    }, []);

    // Function to reset the order state
    // const resetOrder = () => {
    //     setOrderItems([]);
    //     setTableNumber(null);
    //     setOrderType(null);
    // };

    // Function to update order status
    const updateOrderStatus = (tableNumber) => {
        setActiveOrders(prevState => {
            // Check if there is an existing order for the given tableNumber
            const existingOrder = prevState.find(order => order.tableNumber === tableNumber);
     
            if (existingOrder) {
                // If the table already has active orders, update the active order count
                return prevState.map(order =>
                    order.tableNumber === tableNumber
                        ? { ...order, activeOrderCount: order.activeOrderCount + 1 }
                        : order
                );
            } else {
                // If the table has no active orders, add a new order entry
                console.log(`Active order added to Table ${tableNumber}`);
                return [...prevState, { tableNumber, activeOrderCount: 1 }];
            }
        });
    };
    
    
    // Function to close an order
    const closeOrder = (tableNumber) => {
        setActiveOrders(prevState => prevState.filter(order => order.tableNumber !== tableNumber));
    };

    return (
        <OrderContext.Provider
            value={{
                orderItems,
                tableNumber,
                addOrderItem,
                setTableNumber,
                setOrderItems,
                activeOrders,
                updateOrderStatus,
                closeOrder
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}; 