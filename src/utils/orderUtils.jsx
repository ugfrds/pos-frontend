// utils/orderUtils.js

export const getOrdersFromLocalStorage = () => {
    let activeOrders = [];
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('receipt-')) {
            const order = JSON.parse(localStorage.getItem(key));
            if (order.status === 'In Progress') {
                activeOrders.push(order);
            }
        }
    });
    return activeOrders;
};

export const closeOrder = (receiptNumber) => {
    const orderKey = `receipt-${receiptNumber}`;
    const order = JSON.parse(localStorage.getItem(orderKey));
    if (order) {
        order.status = 'Closed';
        localStorage.setItem(orderKey, JSON.stringify(order));
    }
};

export const printKOT = (order) => {
    // Add print logic here to print only KOT for the order
    const kotContent = `
        Receipt Number: ${order.receiptNumber}
        Table Number: ${order.tableNumber}
        Items: ${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
    `;
    const printWindow = window.open('', '', 'width=600,height=400');
    printWindow.document.write(`<pre>${kotContent}</pre>`);
    printWindow.document.close();
    printWindow.print();
};
