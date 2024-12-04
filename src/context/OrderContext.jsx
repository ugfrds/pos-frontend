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

// Create the context
export const OrderContext = createContext();

// Create a provider component
export const OrderProvider = ({ children }) => {
    // State to hold the current order's items
    const [orderItems, setOrderItems] = useState([]);
    
    // State to hold the selected table number
    const [tableNumber, setTableNumber] = useState(null);
    
    // State to hold the order type (e.g., 'Sit-In', 'Takeaway')
    const [orderType, setOrderType] = useState(null);
    
    // State to hold active orders
    const [activeOrders, setActiveOrders] = useState([]);

    useEffect(() => {
        // Load active orders from local storage
        const storedOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];
        setActiveOrders(storedOrders);
    }, []);

    useEffect(() => {
        // Save active orders to local storage
        localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
    }, [activeOrders]);

    // Function to add an item to the order
    const addOrderItem = (item) => {
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
    };

    // Function to reset the order state
    const resetOrder = () => {
        setOrderItems([]);
        setTableNumber(null);
        setOrderType(null);
    };

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
                orderType,
                addOrderItem,
                setTableNumber,
                setOrderType,
                resetOrder,
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
