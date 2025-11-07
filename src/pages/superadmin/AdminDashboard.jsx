import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Navbar, 
  Nav,
  Badge,
  ProgressBar,
  Alert,
  Dropdown
} from 'react-bootstrap';
import { 
  BsPeople as People, 
  BsBuilding as Building, 
  BsBarChart as BarChart, 
  BsGear as Gear,
  BsBell as Bell,
  BsPersonCircle as PersonCircle,
  BsClock as Clock,
  BsCheckCircle as CheckCircle,
  BsExclamationTriangle as ExclamationTriangle
} from 'react-icons/bs';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    activeSessions: 0,
    systemHealth: 100
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API calls
    setStats({
      totalUsers: 1247,
      totalBusinesses: 89,
      activeSessions: 42,
      systemHealth: 95
    });

    setRecentActivities([
      { id: 1, action: 'New user registered', time: '5 min ago', type: 'success' },
      { id: 2, action: 'Business account created', time: '12 min ago', type: 'info' },
      { id: 3, action: 'System backup completed', time: '1 hour ago', type: 'success' },
      { id: 4, action: 'High memory usage detected', time: '2 hours ago', type: 'warning' }
    ]);

    setSystemAlerts([
      { id: 1, message: 'Database connection optimal', type: 'success' },
      { id: 2, message: 'API response time normal', type: 'success' },
      { id: 3, message: 'Storage at 85% capacity', type: 'warning' }
    ]);
  }, []);

  const getHealthVariant = (health) => {
    if (health >= 80) return 'success';
    if (health >= 60) return 'warning';
    return 'danger';
  };

  const getAlertVariant = (type) => {
    const variants = {
      success: 'success',
      warning: 'warning',
      danger: 'danger',
      info: 'info'
    };
    return variants[type] || 'info';
  };

  return (
    <div className="bg-light min-vh-100">
      
      {/* Main Content */}
      <Container fluid className="py-4">
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1">Welcome back, SuperAdmin!</h1>
                <p className="text-muted">Here's what's happening with your system today.</p>
              </div>
              <div className="text-end">
                <small className="text-muted">Last login: Today, 09:24 AM</small>
                <br />
                <Badge bg="success">System Online</Badge>
              </div>
            </div>
          </Col>
        </Row>

        {/* System Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-muted mb-2">Total Users</h6>
                    <h3 className="mb-0">{stats.totalUsers.toLocaleString()}</h3>
                    <small className="text-success">
                      +12% from last week
                    </small>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <People size={24} className="text-primary" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-muted mb-2">Businesses</h6>
                    <h3 className="mb-0">{stats.totalBusinesses}</h3>
                    <small className="text-success">
                      +3 new this week
                    </small>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <Building size={24} className="text-success" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-muted mb-2">Active Sessions</h6>
                    <h3 className="mb-0">{stats.activeSessions}</h3>
                    <small className="text-muted">
                      Live users
                    </small>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <Clock size={24} className="text-warning" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-muted mb-2">System Health</h6>
                    <h3 className="mb-0">{stats.systemHealth}%</h3>
                    <ProgressBar 
                      now={stats.systemHealth} 
                      variant={getHealthVariant(stats.systemHealth)}
                      className="mt-2"
                      style={{ height: '4px' }}
                    />
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <CheckCircle size={24} className="text-info" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Quick Actions */}
          <Col md={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-3">
                    <Card className="h-100 border">
                      <Card.Body className="text-center">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                          <People size={32} className="text-primary" />
                        </div>
                        <h6>Manage Users</h6>
                        <p className="text-muted small mb-3">
                          Create, edit, or delete user accounts
                        </p>
                        <Button variant="primary" size="sm" href="/superadmin/manage-users">
                          Manage Users
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={4} className="mb-3">
                    <Card className="h-100 border">
                      <Card.Body className="text-center">
                        <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                          <Building size={32} className="text-success" />
                        </div>
                        <h6>Manage Businesses</h6>
                        <p className="text-muted small mb-3">
                          Create, edit, or delete businesses
                        </p>
                        <Button variant="success" size="sm" href="/superadmin/manage-businesses">
                          Manage Businesses
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={4} className="mb-3">
                    <Card className="h-100 border">
                      <Card.Body className="text-center">
                        <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                          <BarChart size={32} className="text-info" />
                        </div>
                        <h6>Reports & Analytics</h6>
                        <p className="text-muted small mb-3">
                          View system-wide reports
                        </p>
                        <Button variant="info" size="sm" href="/superadmin/reports">
                          View Reports
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Activity</h5>
                <Button variant="outline-primary" size="sm">
                  View All
                </Button>
              </Card.Header>
              <Card.Body>
                {recentActivities.map(activity => (
                  <div key={activity.id} className="d-flex align-items-center mb-3">
                    <div className={`bg-${getAlertVariant(activity.type)} bg-opacity-10 p-2 rounded me-3`}>
                      {activity.type === 'success' && <CheckCircle size={16} className={`text-${getAlertVariant(activity.type)}`} />}
                      {activity.type === 'warning' && <ExclamationTriangle size={16} className={`text-${getAlertVariant(activity.type)}`} />}
                      {activity.type === 'info' && <Bell size={16} className={`text-${getAlertVariant(activity.type)}`} />}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <span>{activity.action}</span>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* System Alerts Sidebar */}
          <Col md={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">System Status</h5>
              </Card.Header>
              <Card.Body>
                {systemAlerts.map(alert => (
                  <Alert key={alert.id} variant={getAlertVariant(alert.type)} className="py-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        {alert.type === 'success' && <CheckCircle size={16} />}
                        {alert.type === 'warning' && <ExclamationTriangle size={16} />}
                      </div>
                      <small>{alert.message}</small>
                    </div>
                  </Alert>
                ))}
              </Card.Body>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Performance Metrics</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>CPU Usage</small>
                    <small>42%</small>
                  </div>
                  <ProgressBar now={42} variant="info" style={{ height: '6px' }} />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Memory</small>
                    <small>68%</small>
                  </div>
                  <ProgressBar now={68} variant="warning" style={{ height: '6px' }} />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Storage</small>
                    <small>85%</small>
                  </div>
                  <ProgressBar now={85} variant="danger" style={{ height: '6px' }} />
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <small>Network</small>
                    <small>92%</small>
                  </div>
                  <ProgressBar now={92} variant="success" style={{ height: '6px' }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;