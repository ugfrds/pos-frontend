// import { createContext, useState, useEffect } from 'react';

// export const OrderContext = createContext();

// export const OrderProvider = ({ children }) => {
//   const [orderItems, setOrderItems] = useState([]);
//   const [tableNumber, setTableNumber] = useState(null);
//   const [orderType, setOrderType] = useState(null);
//   const [activeOrders, setActiveOrders] = useState([]);

//   useEffect(() => {
//     try {
//       const storedOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];
//       setActiveOrders(storedOrders);
//     } catch (err) {
//       console.error('Failed to parse active orders from localStorage:', err);
//       setActiveOrders([]);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
//   }, [activeOrders]);

//   const addOrderItem = (item) => {
//     setOrderItems((prevItems) => {
//       const existingItemIndex = prevItems.findIndex((prevItem) => prevItem.id === item.id);
//       if (existingItemIndex !== -1) {
//         const updatedItems = [...prevItems];
//         updatedItems[existingItemIndex].quantity += 1;
//         return updatedItems;
//       } else {
//         return [...prevItems, { ...item, quantity: 1 }];
//       }
//     });
//   };

//   const resetOrder = () => {
//     setOrderItems([]);
//     setTableNumber(null);
//     setOrderType(null);
//   };

//   const updateOrderStatus = (tableNumber) => {
//     setActiveOrders((prevOrders) => {
//       const existingOrder = prevOrders.find((order) => order.tableNumber === tableNumber);
//       if (existingOrder) {
//         return prevOrders.map((order) =>
//           order.tableNumber === tableNumber
//             ? { ...order, activeOrderCount: order.activeOrderCount + 1 }
//             : order
//         );
//       } else {
//         return [...prevOrders, { tableNumber, activeOrderCount: 1 }];
//       }
//     });
//   };

//   const closeOrder = (tableNumber) => {
//     setActiveOrders((prevOrders) => prevOrders.filter((order) => order.tableNumber !== tableNumber));
//   };

//   return (
//     <OrderContext.Provider
//       value={{
//         orderItems,
//         tableNumber,
//         orderType,
//         addOrderItem,
//         setTableNumber,
//         setOrderType,
//         resetOrder,
//         setOrderItems,
//         activeOrders,
//         updateOrderStatus,
//         closeOrder,
//       }}
//     >
//       {children}
//     </OrderContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from 'react';
import { getAllOrders } from '../api';

// Create the context
export const OrderContext = createContext();

// Create a provider component
export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [tableNumber, setTableNumber] = useState(null);
    const [orderType, setOrderType] = useState(null);
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

    // Function to update the active orders when a new order is added
    const updateOrderStatus = (tableNumber) => {
        setActiveOrders((prevState) => {
            const existingOrder = prevState.find((order) => order.tableNumber === tableNumber);

            if (existingOrder) {
                // Increment activeOrderCount for the existing table
                return prevState.map((order) =>
                    order.tableNumber === tableNumber
                        ? { ...order, activeOrderCount: order.activeOrderCount + 1 }
                        : order
                );
            } else {
                // Add a new table entry if it doesn't exist
                console.log(`New active order added for Table ${tableNumber}`);
                return [...prevState, { tableNumber, activeOrderCount: 1 }];
            }
        });
    };

    // Function to close all orders for a table
    const closeOrder = (tableNumber) => {
        setActiveOrders((prevState) =>
            prevState.filter((order) => order.tableNumber !== tableNumber)
        );
    };

    return (
        <OrderContext.Provider
            value={{
                orderItems,
                tableNumber,
                orderType,
                activeOrders,
                setTableNumber,
                setOrderType,
                addOrderItem: (item) => {
                    // Adding an order item (simplified for this example)
                    setOrderItems((prevItems) => [...prevItems, item]);
                },
                resetOrder: () => {
                    setOrderItems([]);
                    setTableNumber(null);
                    setOrderType(null);
                },
                updateOrderStatus,
                closeOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

