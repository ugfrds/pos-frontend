import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { getAllOrders, updateOrderStatus, updateOrderPrintStatus } from '../../api';
import { FormatCurrency } from '../../utils';
import { invalidateCache } from '../../utils/Cache';
import { Container, Row, Form, Button, Table, Pagination, Spinner, Alert ,Modal,Tabs, Tab} from 'react-bootstrap';
import { LoadingContext } from '../../context/LoadingContext';
import Notification from '../../components/Notification';
import NavBar from '../../components/Dashboard/Navbar';
import { useReactToPrint } from 'react-to-print';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import SplitBill from '../../components/SplitBill';
import { ReceiptContent } from "../../components/ReceiptContent";
import { useNavigate } from 'react-router-dom';

const PendingOrders = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const { business } = useContext(UserBusinessContext);
  const receiptRef = useRef();

  // Business info
  const { name: businessName, currency, receiptNotes, phoneNumber: contact, businessType: type, location } = business.settings;
  const userRole = sessionStorage.getItem('role');

  // State
  const [orders, setOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [closingIds, setClosingIds] = useState([]);
  const [printingIds, setPrintingIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [notification, setNotification] = useState({ message: '', variant: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const ordersPerPage = 10;

  /** Fetch orders from backend */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (startLoading) startLoading();

    try {
      const filters = {
        status: 'pending',
        tableNumber: tableNumber || undefined,
        page: currentPage,
        limit: ordersPerPage,
      };

      const response = await getAllOrders(filters);
      setOrders(response.orders || []);
      setTotalPages(response.totalPages || 1);
      setTotalAmount(response.totalPendingAmount || 0);
      setTotalOrders(response.totalPendingOrders || 0);
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
      setPageLoading(false);
      if (stopLoading) stopLoading();
    }
  }, [tableNumber, currentPage, ordersPerPage, startLoading, stopLoading]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /** Pagination */
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setPageLoading(true);
    setCurrentPage(page);
  };

  /** Format date */
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString('en-GB');
    return `${time} ${formattedDate}`;
  };

  const handleCloseModal = () => setShowModal(false);

  /** Select/Deselect orders */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(orders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (e, orderId) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, orderId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  /** Bulk close */
 const handleBulkClose = async () => {
    if (!selectedIds.length) return;

    setClosingIds(selectedIds);
    if (startLoading) startLoading();

    try {
        const response = await updateOrderStatus({ orderId: selectedIds, status: 'Completed' });
        
        // Remove closed orders from UI
        setOrders((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
        setSelectedIds([]);
        setNotification({ message: 'Selected orders closed successfully.', variant: 'success' });

    } catch (err) {
        console.error('Failed to close orders:', err);
        setNotification({ message: 'Failed to close selected orders', variant: 'danger' });
    } finally {
        setClosingIds([]);
        if (stopLoading) stopLoading();
    }
};


  /** Close single order */
  const handleCloseOrder = async (order) => {
    setClosingIds((prev) => [...prev, order.id]);
    if (startLoading) startLoading();

    try {
      await updateOrderStatus(order.id, 'Completed');
      invalidateCache('inventory-*');
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setNotification({ message: 'Order closed successfully', variant: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Failed to close order', variant: 'danger' });
    } finally {
      setClosingIds((prev) => prev.filter((id) => id !== order.id));
      if (stopLoading) stopLoading();
    }
  };

  /** Print receipt */
  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt_${selectedOrder?.receiptNumber}`,
    onAfterPrint: async () => {
      try {
        await updateOrderPrintStatus(selectedOrder.id, true);
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, isPrinted: true } : o))
        );
        setNotification({ message: `Receipt printed for order ${selectedOrder.receiptNumber}`, variant: 'success' });
      } catch (err) {
        console.error(err);
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, isPrinted: false } : o))
        );
        setNotification({ message: 'Failed to update print status', variant: 'danger' });
      } finally {
        setPrintingIds((prev) => prev.filter((id) => id !== selectedOrder.id));
      }
    },
  });

  const triggerPrint = (order) => {
    setSelectedOrder(order);
    setPrintingIds((prev) => [...prev, order.id]);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, isPrinted: true } : o)));
    handlePrintReceipt();
  };

  /** Edit order */
  const handleEditOrder = (order) => {
    navigate(`/order/${order.tableNumber}`, { state: { editOrder: order } });
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

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h1 className="mb-4 text-center">Pending Orders</h1>

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

        {type === "Bar" || type === "Restaurant" ? (
          <Row className="mb-3">
            <Form.Group>
              <Form.Label>Table Number:</Form.Label>
              <Form.Control
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </Form.Group>
          </Row>
        ) : null}

        {selectedIds.length > 0 && (
          <div className="mb-3">
            <Button
              variant="danger"
              onClick={handleBulkClose}
              disabled={!['BusinessAdmin', 'Supervisor', 'Cashier'].includes(userRole) || closingIds.length > 0}
            >
              Close Selected ({selectedIds.length})
            </Button>
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : orders.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === orders.length && orders.length > 0}
                    />
                  </th>
                  <th>Receipt</th>
                  {(type === "Bar" || type === "Restaurant") && <th>Table</th>}
                  <th>Amount</th>
                  <th>Served By</th>
                  <th>Time</th>
                  <th>Review</th>
                  <th>Print</th>
                  <th>Close</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        onChange={(e) => handleSelect(e, order.id)}
                        checked={selectedIds.includes(order.id)}
                      />
                    </td>
                    <td>{order.receiptNumber}</td>
                    {(type === "Bar" || type === "Restaurant") && <td>{order.tableNumber}</td>}
                    <td>{FormatCurrency(order.totalAmount, currency)}</td>
                    <td>{order.username}</td>
                    <td>{formatDateTime(order.createdAt)}</td>
                    <td>
                      <Button variant="info" onClick={() => { setSelectedOrder(order); setShowModal(true); }}>
                        Review
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => triggerPrint(order)}
                        disabled={printingIds.includes(order.id)}
                      >
                        {printingIds.includes(order.id) ? <Spinner animation="border" size="sm" /> : 'Print'}
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleCloseOrder(order)}
                        disabled={!['BusinessAdmin', 'Supervisor', 'Cashier'].includes(userRole) || closingIds.includes(order.id) || selectedIds.length > 0}
                      >
                        {closingIds.includes(order.id) ? <Spinner animation="border" size="sm" /> : 'Close'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || pageLoading} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || pageLoading} />
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
