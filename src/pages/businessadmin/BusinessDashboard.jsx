import { useState, useEffect, useContext, useCallback } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Spinner, 
  Alert,
  Badge
} from 'react-bootstrap';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Calendar,
  BarChart3,
  Settings,
  RefreshCw,
  ArrowRight,
  DollarSign,
  Users,
  Star
} from 'lucide-react';
import { getDashboardData } from '../../api';
import { Link } from 'react-router-dom';
import { FormatCurrency } from '../../utils/index';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import SalesChart from '../../components/salesChart';
import ExpensesSidebar from '../../components/bodyComponents/expenses/ExpensesSidebar';
//import './AdminDashboard.css';

const AdminDashboard = () => {
    const [period, setPeriod] = useState('daily');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dashboardData, setDashboardData] = useState({
        totalSales: 0,
        totalOrders: 0,
        topMenuItem: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { business } = useContext(UserBusinessContext);
    const currency = business.settings.currency;

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = period === 'custom' ? { startDate, endDate } : {};
            const data = await getDashboardData(period, params.startDate, params.endDate);

            setDashboardData({
                totalSales: data.totalSales ?? 0,
                totalOrders: data.totalOrders ?? 0,
                topMenuItem: data.topMenuItem ?? '',
            });
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Unable to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [period, startDate, endDate]);

    useEffect(() => {
        if (period !== 'custom') fetchDashboardData();
    }, [fetchDashboardData]);

    const handleCustomRangeFetch = () => {
        if (startDate && endDate) fetchDashboardData();
        else setError('Please select both start and end dates.');
    };

    const getPeriodLabel = () => {
        switch (period) {
            case 'daily': return 'Today';
            case 'weekly': return 'This Week';
            case 'monthly': return 'This Month';
            case 'all': return 'All Time';
            case 'custom': return 'Custom Range';
            default: return 'Today';
        }
    };

    return (
        <Container fluid className="admin-dashboard">
            {/* Header Section */}
            <Card className="dashboard-header mb-4">
                <Card.Body className="p-4">
                    <Row className="align-items-center">
                        <Col>
                            <div className="d-flex align-items-center mb-2">
                                <TrendingUp className="text-primary me-3" size={32} />
                                <div>
                                    <h1 className="h2 mb-1 gradient-text">Business Overview</h1>
                                    <p className="text-muted mb-0">
                                        Welcome back! Here's what's happening with your business {getPeriodLabel()}.
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xs="auto">
                            <Button 
                                variant="primary" 
                                onClick={fetchDashboardData}
                                disabled={loading}
                                className="d-flex align-items-center"
                            >
                                <RefreshCw className={`me-2 ${loading ? 'spinning' : ''}`} size={18} />
                                Refresh Data
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Controls Section */}
            <Card className="dashboard-controls mb-4">
                <Card.Body>
                    <Row className="align-items-end g-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="d-flex align-items-center">
                                    <Calendar className="me-2" size={18} />
                                    <strong>Time Period</strong>
                                </Form.Label>
                                <Form.Select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="modern-select"
                                >
                                    <option value="daily">Today</option>
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
                                        <Form.Label><strong>Start Date</strong></Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="modern-input"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label><strong>End Date</strong></Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="modern-input"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="primary"
                                        onClick={handleCustomRangeFetch}
                                        disabled={!startDate || !endDate}
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

            {/* Loading State */}
            {loading && (
                <Card className="text-center my-4">
                    <Card.Body className="py-5">
                        <Spinner animation="border" variant="primary" className="mb-3" />
                        <h5>Loading dashboard data...</h5>
                    </Card.Body>
                </Card>
            )}

            {/* Error State */}
            {error && (
                <Alert variant="danger" className="text-center">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                        <span className="fs-4">⚠️</span>
                    </div>
                    <h5>{error}</h5>
                    <Button variant="outline-danger" onClick={fetchDashboardData}>
                        Try Again
                    </Button>
                </Alert>
            )}

            {/* Main Dashboard Content */}
            {!loading && !error && (
                <>
                    {/* Stats Grid */}
                    <Row className="g-3 mb-4">
                        {/* Total Sales Card */}
                        <Col xl={3} lg={6} md={6}>
                            <Card className="stat-card h-100 sales-card">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="card-icon me-3">
                                            <DollarSign className="icon" />
                                        </div>
                                        <div>
                                            <Card.Title className="mb-0 h4">
                                                {FormatCurrency(dashboardData.totalSales, currency)}
                                            </Card.Title>
                                            <Card.Text className="text-muted mb-0">Total Sales</Card.Text>
                                        </div>
                                    </div>
                                    <Card.Text className="text-muted small mb-3">
                                        Gross sales amount for {getPeriodLabel().toLowerCase()}
                                    </Card.Text>
                                    <Button 
                                        as={Link} 
                                        to="/admin/sales-report" 
                                        variant="outline-primary" 
                                        className="w-100 d-flex align-items-center justify-content-center"
                                    >
                                        View Report <ArrowRight className="ms-2" size={16} />
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Total Orders Card */}
                        <Col xl={3} lg={6} md={6}>
                            <Card className="stat-card h-100 orders-card">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="card-icon me-3">
                                            <ShoppingCart className="icon" />
                                        </div>
                                        <div>
                                            <Card.Title className="mb-0 h4">{dashboardData.totalOrders}</Card.Title>
                                            <Card.Text className="text-muted mb-0">Total Orders</Card.Text>
                                        </div>
                                    </div>
                                    <Card.Text className="text-muted small mb-3">
                                        Number of transactions processed
                                    </Card.Text>
                                    <Button 
                                        as={Link} 
                                        to="/pending" 
                                        variant="outline-success" 
                                        className="w-100 d-flex align-items-center justify-content-center"
                                    >
                                        Manage Orders <ArrowRight className="ms-2" size={16} />
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Top Item Card */}
                        <Col xl={3} lg={6} md={6}>
                            <Card className="stat-card h-100 top-item-card">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="card-icon me-3">
                                            <Star className="icon" />
                                        </div>
                                        <div>
                                            <Card.Title className="mb-0 h4">
                                                {dashboardData.topMenuItem?.name || 'N/A'}
                                            </Card.Title>
                                            <Card.Text className="text-muted mb-0">Top Item Sold</Card.Text>
                                        </div>
                                    </div>
                                    <Card.Text className="text-muted small mb-3">
                                        Most popular menu item
                                    </Card.Text>
                                    <Button 
                                        as={Link} 
                                        to="/admin/manage-menu" 
                                        variant="outline-warning" 
                                        className="w-100 d-flex align-items-center justify-content-center"
                                    >
                                        Manage Menu <ArrowRight className="ms-2" size={16} />
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Growth Metrics Card */}
                        <Col xl={3} lg={6} md={6}>
                            <Card className="stat-card h-100 metrics-card">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="card-icon me-3">
                                            <TrendingUp className="icon" />
                                        </div>
                                        <div>
                                            <Card.Title className="mb-0 h4">+12.5%</Card.Title>
                                            <Card.Text className="text-muted mb-0">Growth Rate</Card.Text>
                                        </div>
                                    </div>
                                    <Card.Text className="text-muted small mb-3">
                                        Compared to previous period
                                    </Card.Text>
                                    <Button 
                                        as={Link} 
                                        to="/admin/analytics" 
                                        variant="outline-info" 
                                        className="w-100 d-flex align-items-center justify-content-center"
                                    >
                                        View Analytics <ArrowRight className="ms-2" size={16} />
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Charts and Sidebar Section */}
                    <Row className="g-3 mb-4">
                        <Col lg={8}>
                            <Card className="h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Card.Title className="mb-0">
                                            <BarChart3 className="me-2" size={20} />
                                            Sales Performance
                                        </Card.Title>
                                        <div>
                                            <Button variant="outline-primary" size="sm" className="me-2 active">Daily</Button>
                                            <Button variant="outline-primary" size="sm" className="me-2">Weekly</Button>
                                            <Button variant="outline-primary" size="sm">Monthly</Button>
                                        </div>
                                    </div>
                                    <SalesChart />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <ExpensesSidebar />
                        </Col>
                    </Row>

                    {/* Quick Actions */}
                    <Card>
                        <Card.Body>
                            <Card.Title className="mb-4">
                                <Settings className="me-2" size={20} />
                                Quick Actions
                            </Card.Title>
                            <Row className="g-3">
                                <Col md={3} sm={6}>
                                    <Button 
                                        as={Link} 
                                        to="/admin/manage-menu" 
                                        variant="outline-primary" 
                                        className="w-100 h-100 py-3 quick-action-btn"
                                    >
                                        <Package size={24} className="mb-2" />
                                        <div>Manage Menu</div>
                                    </Button>
                                </Col>
                                <Col md={3} sm={6}>
                                    <Button 
                                        as={Link} 
                                        to="/pending" 
                                        variant="outline-success" 
                                        className="w-100 h-100 py-3 quick-action-btn"
                                    >
                                        <ShoppingCart size={24} className="mb-2" />
                                        <div>Process Orders</div>
                                    </Button>
                                </Col>
                                <Col md={3} sm={6}>
                                    <Button 
                                        as={Link} 
                                        to="/admin/sales-report" 
                                        variant="outline-info" 
                                        className="w-100 h-100 py-3 quick-action-btn"
                                    >
                                        <BarChart3 size={24} className="mb-2" />
                                        <div>View Reports</div>
                                    </Button>
                                </Col>
                                <Col md={3} sm={6}>
                                    <Button 
                                        as={Link} 
                                        to="/admin/settings" 
                                        variant="outline-secondary" 
                                        className="w-100 h-100 py-3 quick-action-btn"
                                    >
                                        <Settings size={24} className="mb-2" />
                                        <div>Settings</div>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default AdminDashboard;