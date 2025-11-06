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
import { invalidateCache } from "../../utils/Cache";

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
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
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
  const type = business.settings.businessType;
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
      setTotalPendingAmount(response.totalPendingAmount || 0);
      setTotalPendingOrders(response.totalPendingOrders || 0);
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

  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt_${selectedOrder?.receiptNumber}`,
    onAfterPrint: async () => {
      try {
        await updateOrderPrintStatus(selectedOrder.id, true);

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
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, isPrinted: false } : order
          )
        );
        setNotification({ message: 'Failed to update print status', variant: 'danger' });
      } finally {
        setPrintingIds((prev) => prev.filter((id) => id !== selectedOrder.id));
        if (stopLoading) stopLoading();
      }
    },
  });

  const triggerPrint = (order) => {
    if (!order) return;
    setPrintingIds((prev) => [...prev, order.id]);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, isPrinted: true } : o)));
    setSelectedOrder(order);
    try {
      if (startLoading) startLoading();
      handlePrintReceipt();
    } catch (err) {
      console.error('Print trigger failed', err);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, isPrinted: false } : o)));
      setPrintingIds((prev) => prev.filter((id) => id !== order.id));
      if (stopLoading) stopLoading();
      setNotification({ message: 'Failed to start print', variant: 'danger' });
    }
  };

  const handleEditOrder = (order) => {
    navigate(`/order/${order.tableNumber}`, { state: { editOrder: order } });
  };

  const handleCloseOrder = async (order) => {
    setClosingIds((prev) => [...prev, order.id]);
    if (startLoading) startLoading();
    try {
      await updateOrderStatus(order.id, 'Completed');
      invalidateCache('inventory-*');
      
      // Update both orders list and totals
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setTotalPendingOrders((prev) => prev - 1);
      setTotalPendingAmount((prev) => prev - order.totalAmount);
      
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
  
      const splits = Array.from({ length: numPersons }, () => ({
        amount: parseFloat(splitAmount),
        method: null,
      }));
  
      processPayments(splits);
    } else if (splitType === "custom") {
      const totalSplitAmount = customSplits.reduce((sum, split) => sum + parseFloat(split.amount || 0), 0);
  
      if (totalSplitAmount !== totalAmount) {
        alert("The total split amount does not match the order total.");
        return;
      }
  
      processPayments(customSplits);
    }
  };
  
  const processPayments = (splits) => {
    splits.forEach((split, index) => {
      console.log(`Processing payment for Person ${index + 1}: ${split.amount}, Method: ${split.method || "Not selected yet"}`);
    });
  
    alert("Split payments processed successfully!");
    handleCloseModal();
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h1 className="mb-4 text-center">Tickets</h1>
        {/* Updated summary with correct variable names */}
        <div className="d-flex justify-content-center mb-3">
          <div>
            <strong>{totalPendingOrders}</strong> pending order{totalPendingOrders !== 1 ? 's' : ''} •
            <span className="ms-2">Total: <strong>{FormatCurrency(totalPendingAmount, currency)}</strong></span>
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