import  { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { getDashboardData } from '../../api';
import { Link } from 'react-router-dom';
import { FormatCurrency } from '../../utils/index';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import SalesChart from '../../components/salesChart';
import ExpensesSidebar from '../../components/bodyComponents/expenses/ExpensesSidebar';

const AdminDashboard = () => {
    const [period, setPeriod] = useState('daily');
    const [startDate, setStartDate] = useState(''); // Custom Start Date 
    const [endDate, setEndDate] = useState(''); // Custom End Date
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
        if (startDate && endDate) fetchDashboardData(); // Fetch only if both dates are selected
        else setError('Please select both start and end dates.');
    };
    
    return (
        <Container fluid className="mt-4">
            <h2 className="mb-4 text-center">Admin Dashboard</h2>

            <Form.Group controlId="timePeriod" className="mb-4">
                <Form.Label>Select Time Period</Form.Label>
                <Form.Control
                    as="select"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                >
                    <option value="daily">Today</option>
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                    <option value="all">All Time</option>
                    <option value="custom">Custom Range</option>
                </Form.Control>
            </Form.Group>

            {period === 'custom' && (
                <div className="mb-4">
                    <Form.Group>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>
                     <Button variant="primary" onClick={handleCustomRangeFetch} className="mt-2">
                     Fetch Data
                    </Button>
                </div>
            )}
            {/* Loading and Error States */}
            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}

            {!loading && !error && (
                <>
                    <Row>
                        {/* Sales Summary Card */}
                        <Col md={4}>
                            <Card className="text-center mb-4">
                                <Card.Body>
                                    <Card.Title>Total Sales</Card.Title>
                                    <h2 className="text-primary display-6">
                                        {FormatCurrency(dashboardData.totalSales, currency)}
                                    </h2>
                                    <Card.Text className="text-muted">Gross sales amount</Card.Text>
                                    <Button variant="outline-primary" className="mt-3" as={Link} to="/admin/sales-report">
                                        View Sales Report
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Orders Summary Card */}
                        <Col md={4}>
                            <Card className="text-center mb-4">
                                <Card.Body>
                                    <Card.Title>Total Orders</Card.Title>
                                    <h2 className="text-success display-6">{dashboardData.totalOrders}</h2>
                                    <Card.Text className="text-muted">Number of transactions</Card.Text>
                                    <Button variant="outline-success" className="mt-3" as={Link} to="/pending">
                                        Manage Orders
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Top Item Sold Card */}
                        <Col md={4}>
                            <Card className="text-center mb-4">
                                <Card.Body>
                                    <Card.Title>Top Item Sold</Card.Title>
                                    <h2 className="text-warning display-6">{dashboardData.topMenuItem?.name || 'N/A'}</h2>
                                    <Card.Text className="text-muted">Most popular item</Card.Text>
                                    <Button variant="outline-warning" className="mt-3" as={Link} to="/admin/manage-menu">
                                        Manage Menu
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Sales Chart Placeholder */}
                    <Row>
                        <Col md={8}>
                            <Card className="mb-4 shadow">
                                <Card.Body>
                                    <Card.Title>Sales Over Time</Card.Title>
                                    <SalesChart />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <ExpensesSidebar />
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default AdminDashboard;
