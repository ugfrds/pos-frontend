import React, { useState, useEffect, useRef, useContext } from 'react';
import { getAllOrders, updateOrderStatus, updateOrderPrintStatus } from '../../api';
import { FormatCurrency } from '../../utils/index';
import { Container, Row, Form, Button, Table, Pagination, Modal } from 'react-bootstrap';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import Notification from '../../components/Notification';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Dashboard/Navbar';
import { useReactToPrint } from 'react-to-print';
import PropTypes from 'prop-types'; 
import './pendingOrders.css';

// Separate component for the receipt content to be printed
const ReceiptContent = React.forwardRef(({ businessName, selectedOrder, currency , receiptNotes, contact}, ref) => (
  <div ref={ref} className="receipt-modal-details">
    <div className="receipt-header text-center">
      <h4>{businessName}</h4> {/* Business name */}
      <p>Phone: {contact}</p>
      <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
      <p>Time: {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
      <p><strong>Receipt Number:</strong> {selectedOrder.receiptNumber}</p>
      {/*<p><strong>Table Number:</strong> {selectedOrder.tableNumber}</p> */}
      <p>{receiptNotes}</p>
    </div>
    <ul className="receipt-items list-unstyled">
      {selectedOrder.OrderItems.map((item, index) => (
        <li key={index} className="receipt-item">
          <div className="item-details">
            <span className="item-name">{item.MenuItem.name}</span>
            <span className="quantity">{item.quantity}</span>
            <span className="item-total">{FormatCurrency(item.price, currency)}</span>
          </div>
        </li>
      ))}
    </ul>
    <div className="receipt-footer">
      <div className="item-details">
        <span className="item-name"><strong>Subtotal:</strong></span>
        <span className="item-total">{FormatCurrency(selectedOrder.subtotal, currency)}</span>
      </div>
      <div className="item-details">
        <span className="item-name"><strong>Tax:</strong></span>
        <span className="item-total">{FormatCurrency(selectedOrder.tax, currency)}</span>
      </div>
      <div className="item-details">
        <span className="item-name"><strong>Service Charge:</strong></span>
        <span className="item-total">{FormatCurrency(selectedOrder.serviceCharge, currency)}</span>
      </div>
      <div className="item-details">
        <span className="item-name"><strong>Total:</strong></span>
        <span className="item-total"><strong>{FormatCurrency(selectedOrder.totalAmount, currency)}</strong></span>
      </div>
    </div>
    <p className="served-by"><strong>Served By:</strong> {selectedOrder.username}</p>
  </div>
));
// Add the displayName for better debugging and tooling support
ReceiptContent.displayName = 'ReceiptContent';





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

  const { business } = useContext(UserBusinessContext); 
  const businessName = business.settings.name
  const currency = business.settings.currency;
  const receiptNotes = business.settings.receiptNotes;
  const contact = business.settings.phoneNumber;
  
  
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
        <Row className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label>Table Number:</Form.Label>
            <Form.Control
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </Form.Group>
        </Row>

        {orders.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Receipt Number</th>
                  <th>Table Number</th>
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
                    <td>{order.tableNumber}</td>
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
                      disabled={userRole !== 'BusinessAdmin'}
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
          <Modal className="receipt-modal" show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header className="no-print" closeButton></Modal.Header>
            <Modal.Body>
              <ReceiptContent 
                ref={receiptRef}
                businessName={businessName} 
                selectedOrder={selectedOrder} 
                currency={currency}
                contact ={contact}
                receiptNotes={receiptNotes}
              />
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
        )}
      </Container>
    </>
  );
};


// PropTypes validation
ReceiptContent.propTypes = {
  business: PropTypes.shape({
    
   // phone: PropTypes.string.isRequired,
    settings: PropTypes.shape({
      businessName: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
    }).isRequired,
  }),
  selectedOrder: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    receiptNumber: PropTypes.string.isRequired,
    tableNumber: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    subtotal: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
    serviceCharge: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    OrderItems: PropTypes.arrayOf(
      PropTypes.shape({
        MenuItem: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  currency: PropTypes.string.isRequired,
  contact: PropTypes.string,
  receiptNotes: PropTypes.string
};

export default PendingOrders;
