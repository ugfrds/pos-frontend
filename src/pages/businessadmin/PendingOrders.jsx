import React, { useState, useEffect, useRef, useContext } from 'react';
import { getAllOrders, updateOrderStatus, updateOrderPrintStatus } from '../../api';
import { FormatCurrency } from '../../utils/index';
import { Container, Row, Form, Button, Tabs, Tab,Table, Pagination, Modal } from 'react-bootstrap';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import Notification from '../../components/Notification';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Dashboard/Navbar';
import SplitBill from '../../components/SplitBill';
import { ReceiptContent } from "../../components/ReceiptContent";
import { useReactToPrint } from 'react-to-print';
import './pendingOrders.css';


const PendingOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState({ message: '', variant: '' });
  const receiptRef = useRef();
  const userRole = sessionStorage.getItem('role');
  const ordersPerPage = 10;
  const { business } = useContext(UserBusinessContext); 
  const businessName = business.settings.name
  const currency = business.settings.currency;
  const receiptNotes = business.settings.receiptNotes;
  const contact = business.settings.phoneNumber;
  const type =business.settings.businessType;


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const filters = {
          status: 'pending',
          tableNumber,
        };
        const response = await getAllOrders(filters, currentPage, ordersPerPage); 
        const sortedOrders = response.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [tableNumber, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString('en-GB');
    return `${time} ${formattedDate}`;
  };

  const handleReview = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Assuming `receiptRef` is the ref pointing to the receipt content component
  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt_${selectedOrder?.receiptNumber}`,
    onAfterPrint: async () => {
      try {
        // Update the order status to mark it as printed
        await updateOrderPrintStatus(selectedOrder.id, true);
  
        // Update local orders state to reflect the printed status
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, isPrinted: true } : order
          )
        );
  
        // Set notification for successful print
        setNotification({
          message: `Receipt printed for order ${selectedOrder.receiptNumber}`,
          variant: 'success',
        });
      } catch (error) {
        console.error('Failed to update print status:', error);
        setNotification({ message: 'Failed to update print status', variant: 'danger' }); 
      }
    },
  });
  

  const handleEditOrder = (order) => {
    localStorage.setItem('editOrderData', JSON.stringify(order));
    navigate(`/order/${order.tableNumber}`);
  };

  const handleCloseOrder = async (order) => {
    try {
      await updateOrderStatus(order.id, 'Completed');
      setOrders(orders.filter(o => o.id !== order.id));
      setNotification({ message: `Order Closed successfully.`, variant: 'success' });
    } catch (error) {
      console.error('Failed to close order:', error);
    } 
  };

  const handleSplitPayment = (splitType, numPersons, customSplits) => {
    const totalAmount = selectedOrder.totalAmount;
  
    if (splitType === "equal") {
      const splitAmount = (totalAmount / numPersons).toFixed(2);
  
      // Generate equal splits
      const splits = Array.from({ length: numPersons }, () => ({
        amount: parseFloat(splitAmount),
        method: null, // Payment method to be selected
      }));
  
      // Send splits for processing
      processPayments(splits);
    } else if (splitType === "custom") {
      const totalSplitAmount = customSplits.reduce((sum, split) => sum + parseFloat(split.amount || 0), 0);
  
      // Validate custom splits
      if (totalSplitAmount !== totalAmount) {
        alert("The total split amount does not match the order total.");
        return;
      }
  
      // Send custom splits for processing
      processPayments(customSplits);
    }
  };
  
  const processPayments = (splits) => {
    // Example: Store payment details in a database or state
    splits.forEach((split, index) => {
      console.log(`Processing payment for Person ${index + 1}: ${split.amount}, Method: ${split.method || "Not selected yet"}`);
      
      // Add API call or state update logic here
      // Example:
      // savePayment({
      //   orderId: selectedOrder.id,
      //   amount: split.amount,
      //   paymentMethod: split.method,
      // });
    });
  
    alert("Split payments processed successfully!");
    // Optionally close modal after processing
    handleCloseModal();
  };
  

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h1 className="mb-4 text-center">Tickets</h1>
        <Notification
          message={notification.message}
          variant={notification.variant}
          onClose={() => setNotification({ message: '', variant: '' })}
        />
         {type === "Bar" || type === "Restaurant" ? 
           (<Row className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Table Number:</Form.Label>
              <Form.Control
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </Form.Group>
          </Row>)
          : null}
       

        {orders.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Receipt Number</th>
                   {/* Conditionally render Table Number */}
                  {type === "Bar" || type === "Restaurant" ? <th>Table Number</th> : null}
         
                  <th>Amount</th>
                  <th>Served By</th>
                  <th>Order Time</th>
                  <th>Review</th>
                  <th>Print</th>
                  <th>Close Order</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.receiptNumber}</td>
                    {type === "Bar" || type === "Restaurant" ? <td>{order.tableNumber}</td> : null}
                    <td>{FormatCurrency(order.totalAmount, currency)}</td>
                    <td>{order.username}</td>
                    <td>{formatDateTime(order.createdAt)}</td>
                    <td>
                      <Button variant="info" onClick={() => handleReview(order)}>
                        Review
                      </Button>
                    </td>
                    <td>
                      <Button variant="success" onClick={handlePrintReceipt} >
                        Print Receipt
                      </Button>
                    </td>
                    <td>
                      <Button 
                     disabled={!['BusinessAdmin', 'Supervisor', 'Cashier'].includes(userRole)}
                      variant="danger" onClick={() => handleCloseOrder(order)}
                      >
                        Close Order
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </>
        ) : (
          <p className="text-center">No Pending Orders</p>
        )}

        {selectedOrder && ( 
          
          <Modal className="receipt-modal" show={showModal} onHide={handleCloseModal} size="md" centered>
            <Modal.Header className="no-print" closeButton>
              <Modal.Title>Order Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tabs defaultActiveKey="receipt" id="receipt-tabs" className="mb-3">
                {/* Tab for Receipt Info */}
                <Tab eventKey="receipt" title="Receipt Info">
                  <ReceiptContent
                    ref={receiptRef}
                    businessName={businessName}
                    selectedOrder={selectedOrder}
                    currency={currency}
                    contact={contact}
                    receiptNotes={receiptNotes}
                  />
                </Tab>
          
                {/* Tab for Split Bill */}
                <Tab eventKey="splitBill" title="Split Bill">
                  <SplitBill
                    selectedOrder={selectedOrder}
                    handleSplitPayment={handleSplitPayment}
                    currency={currency}
                    receiptRef={receiptRef}
                    handlePrintReceipt={handlePrintReceipt}
                  />
                </Tab>
              </Tabs>
            </Modal.Body>
            <Modal.Footer className="no-print">
              {!selectedOrder.isPrinted && (
                <Button variant="warning" onClick={() => handleEditOrder(selectedOrder)}>
                  Edit
                </Button>
              )}
              <Button variant="success" onClick={handlePrintReceipt}>
                Print
              </Button>
              <Button variant="primary" onClick={() => {/* handlePrintKOT logic */}}>
                Print KOT
              </Button>
              <Button variant="danger" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          
        )};
      </Container>
    </>
  );
};

export default PendingOrders;
