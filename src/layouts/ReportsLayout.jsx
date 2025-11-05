
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../components/styles/ReportsLayout.css';

const ReportsLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Container fluid>
      <Row>
        <Col as="nav" xs={isSidebarOpen ? 2 : 1} className={`reports-layout-sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
          <div className="reports-layout-sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </div>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/admin/reports/inventory">Inventory</Nav.Link>
            <Nav.Link as={Link} to="/admin/reports/expenses">Expenses</Nav.Link>
            <Nav.Link as={Link} to="/admin/reports/debtors">Debtors</Nav.Link>
          </Nav>
        </Col>
        <Col as="main" xs={isSidebarOpen ? 10 : 11}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default ReportsLayout;
