import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Spinner, 
  Alert,
  Badge,
  Tabs,
  Tab
} from 'react-bootstrap';
import { getSalesReport } from '../../api'; // You'll need to create this API function
import { FormatCurrency } from '../../utils/index';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import { FaDownload, FaFilter, FaChartBar, FaReceipt } from 'react-icons/fa';

const SalesReport = () => {
  const [period, setPeriod] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState({
    summary: {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      ordersCount: 0
    },
    orderBreakdown: [],
    categorySales: [],
    hourlyData: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { business } = useContext(UserBusinessContext);
  const currency = business?.settings?.currency || 'USD';

  const fetchSalesReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { period };
      if (period === 'custom') {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      const data = await getSalesReport(params);
      
      setReportData({
        summary: {
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          averageOrderValue: data.averageOrderValue || 0,
          ordersCount: data.ordersCount || 0
        },
        orderBreakdown: data.orderBreakdown || [],
        categorySales: data.categorySales || [],
        hourlyData: data.hourlyData || []
      });
    } catch (err) {
      console.error('Failed to fetch sales report:', err);
      setError('Unable to load sales report. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    if (period !== 'custom') {
      fetchSalesReport();
    }
  }, [period, fetchSalesReport]);

  const handleCustomRangeFetch = () => {
    if (startDate && endDate) {
      fetchSalesReport();
    } else {
      setError('Please select both start and end dates.');
    }
  };

  const handleExport = (format) => {
    if (format === 'csv') {
      if (!reportData.orderBreakdown || reportData.orderBreakdown.length === 0) {
        console.warn('No order breakdown data to export.');
        return;
      }

      const headers = ['Item Name', 'Category', 'Quantity Sold', 'Unit Price', 'Total Amount', '% of Revenue'];
      const csvRows = [headers.join(',')];

      reportData.orderBreakdown.forEach(item => {
        const percentageOfRevenue = reportData.summary.totalRevenue ? ((item.totalAmount / reportData.summary.totalRevenue) * 100).toFixed(1) : '0.0';
        const row = [
          `"${item.name}"`,
          `"${item.category || ''}"`,
          item.quantity,
          item.unitPrice,
          item.totalAmount,
          `${percentageOfRevenue}%`
        ];
        csvRows.push(row.join(','));
      });

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'sales-order-breakdown.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } else if (format === 'pdf') {
      console.log('PDF export is not implemented yet.');
    }
  };

  const getPeriodLabel = () => {
    const labels = {
      today: 'Today',
      weekly: 'This Week',
      monthly: 'This Month',
      all: 'All Time',
      custom: 'Custom Range'
    };
    return labels[period] || 'Period';
  };

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Sales Report</h2>
              <p className="text-muted">
                {getPeriodLabel()} 
                {period === 'custom' && startDate && endDate && 
                  ` (${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()})`
                }
              </p>
            </div>
            <div>
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={() => handleExport('csv')}
              >
                <FaDownload className="me-2" />
                Export CSV
              </Button>
              <Button 
                variant="primary"
                onClick={() => handleExport('pdf')}
              >
                <FaDownload className="me-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <FaFilter className="me-2" />
                  Time Period
                </Form.Label>
                <Form.Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="weekly">This Week</option>
                  <option value="monthly">This Month</option>
                  <option value="all">All Time</option>
                  <option value="custom">Custom Range</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {period === 'custom' && (
              <>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="primary" 
                    onClick={handleCustomRangeFetch}
                    className="w-100"
                  >
                    Apply
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading sales report...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Tabs defaultActiveKey="summary" className="mb-4">
          {/* Summary Tab */}
          <Tab eventKey="summary" title={
            <span>
              <FaChartBar className="me-2" />
              Summary
            </span>
          }>
            <Row className="mb-4">
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Total Orders</Card.Title>
                    <h2 className="text-primary">{reportData.summary.ordersCount}</h2>
                    <Card.Text>Number of transactions</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Total Revenue</Card.Title>
                    <h2 className="text-success">
                      {FormatCurrency(reportData.summary.totalRevenue, currency)}
                    </h2>
                    <Card.Text>Gross sales amount</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Average Order Value</Card.Title>
                    <h2 className="text-info">
                      {FormatCurrency(reportData.summary.averageOrderValue, currency)}
                    </h2>
                    <Card.Text>Per transaction average</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Total Items Sold</Card.Title>
                    <h2 className="text-warning">
                      {reportData.orderBreakdown.reduce((total, item) => total + item.quantity, 0)}
                    </h2>
                    <Card.Text>All items combined</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Order Breakdown Tab */}
          <Tab eventKey="breakdown" title={
            <span>
              <FaReceipt className="me-2" />
              Order Breakdown
            </span>
          }>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Item-wise Sales Breakdown</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive striped hover>
                  <thead className="bg-light">
                    <tr>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th className="text-center">Quantity Sold</th>
                      <th className="text-center">Unit Price</th>
                      <th className="text-end">Total Amount</th>
                      <th className="text-center">% of Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.orderBreakdown.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{item.name}</strong>
                          {item.isTopSeller && (
                            <Badge bg="success" className="ms-2">Top Seller</Badge>
                          )}
                        </td>
                        <td>{item.category}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">
                          {FormatCurrency(item.unitPrice, currency)}
                        </td>
                        <td className="text-end">
                          <strong>
                            {FormatCurrency(item.totalAmount, currency)}
                          </strong>
                        </td>
                        <td className="text-center">
                          {((item.totalAmount / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-light">
                    <tr>
                      <td colSpan="4" className="text-end">
                        <strong>Grand Total:</strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {FormatCurrency(reportData.summary.totalRevenue, currency)}
                        </strong>
                      </td>
                      <td className="text-center">100%</td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Category Sales Tab */}
          <Tab eventKey="categories" title="Categories">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Sales by Category</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive striped hover>
                  <thead className="bg-light">
                    <tr>
                      <th>Category</th>
                      <th className="text-center">Items Sold</th>
                      <th className="text-end">Total Revenue</th>
                      <th className="text-center">% of Total</th>
                      <th className="text-center">Avg. Item Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.categorySales.map((category, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{category.name}</strong>
                        </td>
                        <td className="text-center">{category.itemsSold}</td>
                        <td className="text-end">
                          {FormatCurrency(category.revenue, currency)}
                        </td>
                        <td className="text-center">
                          {((category.revenue / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                        </td>
                        <td className="text-center">
                          {FormatCurrency(category.averagePrice, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default SalesReport;



//   const handleExport = async (format) => {
//     try {
//       setLoading(true);
//       setError('');

//       const params = period === 'custom' ? { startDate, endDate, format } : { period, format };
      
//       // Assuming 'api' is your configured axios instance
//       const response = await getSalesReport(params, {
//         responseType: 'blob', // This is important to handle the file download
//       });

//       // Create a URL for the blob
//       const url = window.URL.createObjectURL(new Blob([response]));
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Set the download filename
//       link.setAttribute('download', `sales-report.${format}`);
      
//       // Append to the document, click, and then remove
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);

//     } catch (err) {
//       console.error('Failed to export sales report:', err);
//       setError('Unable to export sales report. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };
// Also, you will need to update your getSalesReport function in api.jsx to handle the export case. It should look something like this:

// export const getSalesReport = async (params, config = {}) => {
//     try {
//         const response = await api.get('/sales/report', {
//             params,
//             ...setAuthHeader(),
//             ...config, // Pass additional config like responseType
//         });
//         return response.data;
//     } catch (error) {
//         handleApiError(error);
//         throw error.response.data;
//     }
// };
// This should make the export functionality work. Let me know if you have any other questions.

