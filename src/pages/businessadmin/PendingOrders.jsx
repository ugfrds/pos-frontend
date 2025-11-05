import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { getAllOrders, updateOrderStatus, updateOrderPrintStatus } from '../../api';
import { FormatCurrency } from '../../utils/index';
import { Container, Row, Form, Button, Tabs, Tab, Table, Pagination, Modal, Spinner, Alert } from 'react-bootstrap';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import { LoadingContext } from '../../context/LoadingContext';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [closingIds, setClosingIds] = useState([]);
  const [printingIds, setPrintingIds] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState({ message: '', variant: '' });
  const receiptRef = useRef();
  const userRole = sessionStorage.getItem('role');
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const ordersPerPage = 10;
  const { business } = useContext(UserBusinessContext); 
  const businessName = business.settings.name
  const currency = business.settings.currency;
  const receiptNotes = business.settings.receiptNotes;
  const contact = business.settings.phoneNumber;
  const type =business.settings.businessType;
  const location = business.settings.location;


  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (startLoading) startLoading();
    try {
      const filters = {
        status: 'pending',
        tableNumber,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const response = await getAllOrders(filters, currentPage, ordersPerPage);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
      setTotalAmount(response.totalAmount || 0);
      setTotalOrders(response.totalOrders || 0);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
      setPageLoading(false);
      if (stopLoading) stopLoading();
    }
  }, [tableNumber, currentPage, ordersPerPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (page) => {
    setPageLoading(true);
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
        // Update the order status to mark it as printed on the server
        await updateOrderPrintStatus(selectedOrder.id, true);

        // Ensure local orders state reflects the printed status
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, isPrinted: true } : order
          )
        );

        setNotification({
          message: `Receipt printed for order ${selectedOrder.receiptNumber}`,
          variant: 'success',
        });
      } catch (err) {
        console.error('Failed to update print status:', err);
        // Revert optimistic UI
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, isPrinted: false } : order
          )
        );
        setNotification({ message: 'Failed to update print status', variant: 'danger' });
      } finally {
        // remove from printingIds
        setPrintingIds((prev) => prev.filter((id) => id !== selectedOrder.id));
        if (stopLoading) stopLoading();
      }
    },
  });

  // Trigger print with optimistic UI
  const triggerPrint = (order) => {
    if (!order) return;
    // mark printing in-flight
    setPrintingIds((prev) => [...prev, order.id]);
    // optimistic mark printed locally so UI updates immediately
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, isPrinted: true } : o)));
    // set selected order so receipt content is available
    setSelectedOrder(order);
    // call the print handler
    try {
      if (startLoading) startLoading();
      handlePrintReceipt();
    } catch (err) {
      console.error('Print trigger failed', err);
      // revert optimistic state
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, isPrinted: false } : o)));
      setPrintingIds((prev) => prev.filter((id) => id !== order.id));
      if (stopLoading) stopLoading();
      setNotification({ message: 'Failed to start print', variant: 'danger' });
    }
  };
  

  const handleEditOrder = (order) => {
    // Navigate to OrderPage and pass the order in navigation state (no localStorage)
    navigate(`/order/${order.tableNumber}`, { state: { editOrder: order } });
  };

  const handleCloseOrder = async (order) => {
    // mark as closing to show an in-flight state
    setClosingIds((prev) => [...prev, order.id]);
    if (startLoading) startLoading();
    try {
      await updateOrderStatus(order.id, 'Completed');
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setNotification({ message: `Order Closed successfully.`, variant: 'success' });
    } catch (err) {
      console.error('Failed to close order:', err);
      setNotification({ message: 'Failed to close order', variant: 'danger' });
    } finally {
      setClosingIds((prev) => prev.filter((id) => id !== order.id));
      if (stopLoading) stopLoading();
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
        {/* Summary: pending orders count & total amount */}
        <div className="d-flex justify-content-center mb-3">
          <div>
            <strong>{totalOrders}</strong> pending order{totalOrders !== 1 ? 's' : ''} •
            <span className="ms-2">Total: <strong>{FormatCurrency(totalAmount, currency)}</strong></span>
          </div>
        </div>
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
       

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <div className="text-center">
              <div className="mb-2">Loading orders...</div>
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        ) : error ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <Alert variant="danger" className="w-75 text-center">
              <div>{error}</div>
              <div className="mt-2">
                <Button variant="outline-primary" onClick={fetchOrders}>Retry</Button>
              </div>
            </Alert>
          </div>
        ) : orders.length > 0 ? (
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
                            <Button
                              variant="success"
                              onClick={() => triggerPrint(order)}
                              disabled={printingIds.includes(order.id)}
                            >
                              {printingIds.includes(order.id) ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                'Print Receipt'
                              )}
                            </Button>
                          </td>
                          <td>
                            <Button
                              disabled={!['BusinessAdmin', 'Supervisor', 'Cashier'].includes(userRole) || closingIds.includes(order.id)}
                              variant="danger"
                              onClick={() => handleCloseOrder(order)}
                            >
                              {closingIds.includes(order.id) ? <Spinner animation="border" size="sm" /> : 'Close Order'}
                            </Button>
                          </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination>
              <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || pageLoading}
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
                disabled={currentPage === totalPages || pageLoading}
              />
              {pageLoading && (
                <div className="ms-2 d-inline-flex align-items-center">
                  <Spinner animation="border" size="sm" />
                </div>
              )}
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
                    location={location}
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
              <Button
                variant="success"
                onClick={() => triggerPrint(selectedOrder)}
                disabled={!selectedOrder || printingIds.includes(selectedOrder?.id)}
              >
                {printingIds.includes(selectedOrder?.id) ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Print'
                )}
              </Button>
              <Button variant="primary" onClick={() => {/* handlePrintKOT logic */}}>
                Print KOT
              </Button>
              <Button variant="danger" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          
  )}
      </Container>
    </>
  );
};

export default PendingOrders;
