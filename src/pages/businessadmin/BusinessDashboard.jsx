import  { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { getDashboardData } from '../../api';
import { Link } from 'react-router-dom';
import { FormatCurrency } from '../../utils/index';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import { FaChartBar, FaClipboardList, FaUtensils } from 'react-icons/fa';
import SalesChart from '../../components/salesChart';

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
                    totalSales: data.totalSales,
                    totalOrders: data.totalOrders,
                    topMenuItem: data.topMenuItem,
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
                            <Card className="mb-4 shadow">
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <FaChartBar size={30} className="me-3 text-primary" />
                                        <div>
                                            <Card.Title>Total Sales</Card.Title>
                                            <Card.Text className="display-6">
                                                {FormatCurrency(dashboardData.totalSales, currency)}
                                            </Card.Text>
                                        </div>
                                    </div>
                                    <Button variant="outline-primary" className="mt-3" href="/admin/sales-report">
                                        View Sales Report
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Orders Summary Card */}
                        <Col md={4}>
                            <Card className="mb-4 shadow">
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <FaClipboardList size={30} className="me-3 text-success" />
                                        <div>
                                            <Card.Title>Total Orders</Card.Title>
                                            <Card.Text className="display-6">{dashboardData.totalOrders}</Card.Text>
                                        </div>
                                    </div>
                                    <Button variant="outline-success" className="mt-3" as={Link} to="/pending">
                                        Manage Orders
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Top Menu Item Card */}
                        <Col md={4}>
                            <Card className="mb-4 shadow">
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <FaUtensils size={30} className="me-3 text-warning" />
                                        <div>
                                            <Card.Title>Top Menu Item</Card.Title>
                                            <Card.Text className="display-6">{dashboardData.topMenuItem}</Card.Text>
                                        </div>
                                    </div>
                                    <Button variant="outline-warning" className="mt-3" as={Link} to="/admin/manage-menu">
                                        Manage Menu
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Sales Chart Placeholder */}
                    <Row>
                        <Col md={12}>
                            <Card className="mb-4 shadow">
                                <Card.Body>
                                    <Card.Title>Sales Over Time</Card.Title>
                                    <SalesChart  />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default AdminDashboard;
