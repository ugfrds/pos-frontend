import { createContext, useState, useEffect } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];
      setActiveOrders(storedOrders);
    } catch (err) {
      console.error('Failed to parse active orders from localStorage:', err);
      setActiveOrders([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
  }, [activeOrders]);

  const addOrderItem = (item) => {
    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((prevItem) => prevItem.id === item.id);
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const resetOrder = () => {
    setOrderItems([]);
    setTableNumber(null);
    setOrderType(null);
  };

  const updateOrderStatus = (tableNumber) => {
    setActiveOrders((prevOrders) => {
      const existingOrder = prevOrders.find((order) => order.tableNumber === tableNumber);
      if (existingOrder) {
        return prevOrders.map((order) =>
          order.tableNumber === tableNumber
            ? { ...order, activeOrderCount: order.activeOrderCount + 1 }
            : order
        );
      } else {
        return [...prevOrders, { tableNumber, activeOrderCount: 1 }];
      }
    });
  };

  const closeOrder = (tableNumber) => {
    setActiveOrders((prevOrders) => prevOrders.filter((order) => order.tableNumber !== tableNumber));
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
        closeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
