// src/components/superadmin/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Dropdown,
  Badge,
  ProgressBar,
  Alert,
  Tab,
  Tabs
} from 'react-bootstrap';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BsDownload as Download,
  BsFilter as Filter,
  BsCalendar as Calendar,
  BsEye as Eye,
  BsGraphUpArrow as TrendingUp,
  BsPeople as Users,
  BsBuilding as Building,
  BsCurrencyDollar as Dollar,
  BsCartFill as ShoppingCart,
  BsArrowClockwise as RefreshCw
} from 'react-icons/bs';


const Reports= () => {
  const [dateRange, setDateRange] = useState('last30');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual API calls
  const [reportData, setReportData] = useState({
    summary: {
      totalRevenue: 0,
      totalOrders: 0,
      activeUsers: 0,
      newBusinesses: 0,
      growthRate: 0
    },
    revenueData: [],
    userGrowth: [],
    businessMetrics: [],
    topProducts: [],
    systemUsage: []
  });

  // Color palettes for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const REVENUE_COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data based on date range
      const mockData = generateMockData(dateRange);
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  };

  const generateMockData = (range) => {
    // This would be replaced with actual API data
    const baseData = {
      summary: {
        totalRevenue: 1254300,
        totalOrders: 8924,
        activeUsers: 1247,
        newBusinesses: 23,
        growthRate: 12.5
      },
      revenueData: [
        { name: 'Jan', revenue: 40000, profit: 24000, cost: 16000 },
        { name: 'Feb', revenue: 30000, profit: 18000, cost: 12000 },
        { name: 'Mar', revenue: 50000, profit: 30000, cost: 20000 },
        { name: 'Apr', revenue: 27800, profit: 16680, cost: 11120 },
        { name: 'May', revenue: 58900, profit: 35340, cost: 23560 },
        { name: 'Jun', revenue: 43900, profit: 26340, cost: 17560 },
      ],
      userGrowth: [
        { month: 'Jan', users: 400, businesses: 45 },
        { month: 'Feb', users: 600, businesses: 52 },
        { month: 'Mar', users: 800, businesses: 61 },
        { month: 'Apr', users: 950, businesses: 67 },
        { month: 'May', users: 1100, businesses: 74 },
        { month: 'Jun', users: 1247, businesses: 89 },
      ],
      businessMetrics: [
        { name: 'Retail', value: 35 },
        { name: 'Restaurant', value: 25 },
        { name: 'Services', value: 20 },
        { name: 'Healthcare', value: 15 },
        { name: 'Other', value: 5 },
      ],
      topProducts: [
        { id: 1, name: 'Basic POS Plan', sales: 450, revenue: 22500 },
        { id: 2, name: 'Premium POS Plan', sales: 320, revenue: 48000 },
        { id: 3, name: 'Enterprise Plan', sales: 85, revenue: 42500 },
        { id: 4, name: 'Payment Gateway', sales: 620, revenue: 12400 },
        { id: 5, name: 'Inventory Module', sales: 280, revenue: 19600 },
      ],
      systemUsage: [
        { metric: 'CPU Usage', value: 65 },
        { metric: 'Memory', value: 78 },
        { metric: 'Storage', value: 45 },
        { metric: 'Network', value: 92 },
      ]
    };

    return baseData;
  };

  const handleExport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Implement export functionality
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const SummaryCards = () => (
    <Row className="mb-4">
      <Col md={3} className="mb-3">
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-muted mb-2">Total Revenue</h6>
                <h3 className="mb-0">{formatCurrency(reportData.summary.totalRevenue)}</h3>
                <small className="text-success">
                  <TrendingUp size={12} className="me-1" />
                  +{reportData.summary.growthRate}% growth
                </small>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <Dollar size={24} className="text-primary" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3} className="mb-3">
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-muted mb-2">Total Orders</h6>
                <h3 className="mb-0">{reportData.summary.totalOrders.toLocaleString()}</h3>
                <small className="text-success">+8% from last period</small>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded">
                <ShoppingCart size={24} className="text-success" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3} className="mb-3">
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-muted mb-2">Active Users</h6>
                <h3 className="mb-0">{reportData.summary.activeUsers.toLocaleString()}</h3>
                <small className="text-success">+124 new users</small>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded">
                <Users size={24} className="text-warning" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3} className="mb-3">
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-muted mb-2">New Businesses</h6>
                <h3 className="mb-0">{reportData.summary.newBusinesses}</h3>
                <small className="text-success">+5 this month</small>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded">
                <Building size={24} className="text-info" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const RevenueChart = () => (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Revenue Overview</h5>
        <Badge bg="primary">Last 6 Months</Badge>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
            />
            <Legend />
            <Bar dataKey="revenue" name="Total Revenue" fill="#4CAF50" />
            <Bar dataKey="profit" name="Profit" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );

  const UserGrowthChart = () => (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white">
        <h5 className="mb-0">User & Business Growth</h5>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reportData.userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              name="Total Users" 
              stroke="#8884d8" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="businesses" 
              name="Businesses" 
              stroke="#82ca9d" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );

  const BusinessDistribution = () => (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white">
        <h5 className="mb-0">Business Distribution</h5>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={reportData.businessMetrics}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {reportData.businessMetrics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );

  const TopProductsTable = () => (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Top Performing Products</h5>
        <Badge bg="secondary">Revenue</Badge>
      </Card.Header>
      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Sales Count</th>
              <th>Revenue</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {reportData.topProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                      <ShoppingCart size={16} className="text-primary" />
                    </div>
                    {product.name}
                  </div>
                </td>
                <td>{product.sales}</td>
                <td className="fw-bold text-success">{formatCurrency(product.revenue)}</td>
                <td>
                  <ProgressBar 
                    now={(product.sales / 1000) * 100} 
                    variant="success" 
                    style={{ height: '6px' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  const SystemMetrics = () => (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white">
        <h5 className="mb-0">System Performance Metrics</h5>
      </Card.Header>
      <Card.Body>
        {reportData.systemUsage.map((metric, index) => (
          <div key={metric.metric} className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span>{metric.metric}</span>
              <span className="fw-bold">{metric.value}%</span>
            </div>
            <ProgressBar 
              now={metric.value} 
              variant={
                metric.value > 80 ? 'danger' : 
                metric.value > 60 ? 'warning' : 'success'
              }
              style={{ height: '8px' }}
            />
          </div>
        ))}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">Reports & Analytics</h1>
              <p className="text-muted">
                Comprehensive overview of system performance and business metrics
              </p>
            </div>
            <div className="d-flex gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary">
                  <Filter className="me-2" size={16} />
                  Date Range: {dateRange}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setDateRange('today')}>Today</Dropdown.Item>
                  <Dropdown.Item onClick={() => setDateRange('last7')}>Last 7 Days</Dropdown.Item>
                  <Dropdown.Item onClick={() => setDateRange('last30')}>Last 30 Days</Dropdown.Item>
                  <Dropdown.Item onClick={() => setDateRange('last90')}>Last 90 Days</Dropdown.Item>
                  <Dropdown.Item onClick={() => setDateRange('ytd')}>Year to Date</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  <Download className="me-2" size={16} />
                  Export
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleExport('pdf')}>PDF Report</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleExport('excel')}>Excel Sheet</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleExport('csv')}>CSV Data</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button 
                variant="outline-secondary" 
                onClick={loadReportData}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {loading ? (
        <Alert variant="info" className="text-center">
          <RefreshCw className="spinning me-2" />
          Loading report data...
        </Alert>
      ) : (
        <>
          <SummaryCards />

          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4"
          >
            <Tab eventKey="overview" title="Overview">
              <Row className="g-3">
                <Col lg={8}>
                  <RevenueChart />
                </Col>
                <Col lg={4}>
                  <BusinessDistribution />
                </Col>
                <Col lg={6}>
                  <UserGrowthChart />
                </Col>
                <Col lg={6}>
                  <SystemMetrics />
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="performance" title="Performance">
              <Row>
                <Col>
                  <TopProductsTable />
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="detailed" title="Detailed Reports">
              <Row>
                <Col>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">Detailed Analytics</h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted">
                        Detailed reports and custom analytics coming soon...
                      </p>
                      <Button variant="outline-primary">
                        <Eye className="me-2" />
                        Generate Custom Report
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </>
      )}
    </Container>
  );
};

export default Reports;