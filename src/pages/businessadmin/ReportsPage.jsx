import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import AdminInventoryPage from './AdminInventoryPage';
import ExpendituresPage from './expendituresPage';
import '../../components/styles/Reports.css'; // Assuming you'll create this CSS file

const ReportsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    if (location.pathname.includes('expenses')) {
      setActiveTab('expenses');
    } else {
      setActiveTab('inventory');
    }
  }, [location.pathname]);

  return (
    <Container fluid className="reports-page-container">
      <Row>
        <Col md={2} className="reports-sidebar">
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/admin/reports/inventory"
              className={activeTab === 'inventory' ? 'active' : ''}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/reports/expenses"
              className={activeTab === 'expenses' ? 'active' : ''}
              onClick={() => setActiveTab('expenses')}
            >
              Expenses
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={10} className="reports-content">
          {activeTab === 'inventory' ? <AdminInventoryPage /> : <ExpendituresPage />}
        </Col>
      </Row>
    </Container>
  );
};

export default ReportsPage;
