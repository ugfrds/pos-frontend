import React, { useState, useEffect } from 'react';
import { getAllOrders, searchOrdersByItem } from '../../api'; // Import centralized API functions
import { FormatCurrency } from '../../utils/index'; // Utility to format currency
import { Container, Row, Col, Form, Button, Table, Pagination } from 'react-bootstrap';
import { useContext } from 'react';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import './OrderHistory.css';


const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { business } = useContext(UserBusinessContext);
  const currency = business.settings.currency;
  const type =business.settings.businessType;
  const ordersPerPage = 15;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const filters = {
          status: statusFilter,
          startDate,
          endDate,
          tableNumber
        };
        const response = await getAllOrders(filters, currentPage, ordersPerPage);

        // Sort orders by creation date in descending order
        const sortedOrders = response.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [statusFilter, startDate, endDate, tableNumber, currentPage]);

  const handleSearch = async () => {
    try {
      const res = await searchOrdersByItem(searchTerm);
      console.log(res);
      const sortedOrders = res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to search orders:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to format the date and time
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString('en-GB'); // Format as dd/mm/yy
    return `${time} ${formattedDate}`;
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Order History</h1>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by item"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Button variant="primary" onClick={handleSearch} className="w-100">
            Search
          </Button>
        </Col>
        <Col md={3}>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchTerm(""); // Reset search term
              window.location.reload();
            }}
            className="w-100">
            Reset All
          </Button>
        </Col>
      </Row>


      <Row className="mb-3">
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Status:</Form.Label>
            <Form.Control
              as="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="Completed">Completed</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Start Date:</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>End Date:</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Table Number:</Form.Label>
            <Form.Control
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="table-responsive">
 <Table striped bordered hover>
    <thead>
      <tr>
        <th>Receipt Number</th>
          {/* Conditionally render Table Number */}
          {type === "Bar" || type === "Restaurant" ? <th>Table Number</th> : null}
          {/* Conditionally render Order Type */}
          {type === "Bar" || type === "Restaurant" ? <th>Order Type</th> : null}
        <th>Status</th>
        <th>Total Amount</th>
        <th>Items</th>
        <th>Served By</th>
        <th>Order Time</th>
      </tr>
    </thead>
    <tbody>
      {orders.map(order => (
        <tr key={order.id}>
          <td>{order.receiptNumber}</td>
        {type === "Bar" || type === "Restaurant" ? <td>{order.tableNumber}</td> : null}
         {type === "Bar" || type === "Restaurant" ? <td>{order.orderType}</td> : null}
          <td>{order.status}</td>
          <td>{FormatCurrency(order.totalAmount, currency)}</td>
          <td>
            <table style={{ width: '100%' }}>
              {Array.isArray(order.OrderItems) && order.OrderItems.length > 0 ? (
                order.OrderItems.map(item => (
                  <tr key={item.id}>
                    <td style={{ width: '60%' }}>{item.MenuItem && item.MenuItem.name ? item.MenuItem.name : "N/A"}</td>
                    <td style={{ width: '20%' }}>{item.quantity}</td>
                    <td style={{ width: '20%' }}>{FormatCurrency(item.price, currency)}</td>
                  </tr>
                ))
              ) : (
                <tr><td>No items</td></tr>
              )}
            </table>
          </td>
          <td>{order.username}</td>
          <td>{formatDateTime(order.createdAt)}</td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>


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
    </Container>
  );
};

export default OrderHistoryPage;
