import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { getDashboardData } from '../../api';
import { Link } from 'react-router-dom';
import { FormatCurrency } from '../../utils/index';
import { UserBusinessContext } from '../../context/UserBusinessContext';
const AdminDashboard = () => {
    const [period, setPeriod] = useState('daily');
    const [dashboardData, setDashboardData] = useState({
        totalSales: 0,
        totalOrders: 0,
        topMenuItem: '',
    });
    const { business } = useContext(UserBusinessContext);
    const currency = business.settings.currency;
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await getDashboardData(period); 
                setDashboardData({
                    totalSales: data.totalSales,
                    totalOrders: data.totalOrders,
                    topMenuItem: data.topMenuItem,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, [period]);

    return (
        <Container fluid className="mt-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            <Form.Group controlId="timePeriod">
                <Form.Label>Select Time Period</Form.Label>
                <Form.Control as="select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="all">All Time</option>
                </Form.Control>
            </Form.Group>

            <Row>
                {/* Sales Summary Card */}
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Total Sales</Card.Title>
                            <Card.Text className="display-4">
                            {FormatCurrency(dashboardData.totalSales, currency)}        
                            </Card.Text>
                            <Button variant="primary" href="/sales-report">
                                View Sales Report
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Orders Summary Card */}
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Total Orders</Card.Title>
                            <Card.Text className="display-4">{dashboardData.totalOrders}</Card.Text>
                            <Button variant="primary" as={Link} to="/pending">
                                Manage Orders
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top Menu Item Card */}
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Top Menu Item</Card.Title>
                            <Card.Text className="display-4">{dashboardData.topMenuItem}</Card.Text>
                            <Button variant="primary"  as={Link} to="/admin/manage-menu">
                                Manage Menu
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Placeholder for a Chart or Graph */}
            <Row>
                <Col md={12}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Sales Over Time</Card.Title>
                            <div style={{ height: '300px', background: '#f8f9fa', textAlign: 'center', paddingTop: '130px' }}>
                                [Chart Placeholder]
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
