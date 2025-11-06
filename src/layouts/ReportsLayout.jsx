import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  DollarSign,
  Users,
} from 'lucide-react';
import '../components/styles/ReportsLayout.css';

const ReportsLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Helper function for tooltips
  const renderTooltip = (text) => (
    <Tooltip id={`tooltip-${text.toLowerCase()}`}>{text}</Tooltip>
  );

  return (
    <div className="reports-layout-container d-flex">
      {/* Sidebar */}
      <aside
        className={`reports-layout-sidebar ${
          isSidebarOpen ? 'expanded' : 'collapsed'
        }`}
      >
        {/* Toggle button */}
        <div
          className="reports-layout-sidebar-toggle d-flex align-items-center justify-content-center mb-4"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </div>

        {/* Navigation */}
        <Nav className="flex-column w-100">
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 150 }}
            overlay={!isSidebarOpen ? renderTooltip('Inventory') : <></>}
          >
            <Nav.Link
              as={Link}
              to="/admin/reports/inventory"
              className="text-white d-flex align-items-center mb-3 nav-item"
            >
              <BarChart3 className="me-2" />
              {isSidebarOpen && 'Inventory'}
            </Nav.Link>
          </OverlayTrigger>

          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 150 }}
            overlay={!isSidebarOpen ? renderTooltip('Expenses') : <></>}
          >
            <Nav.Link
              as={Link}
              to="/admin/reports/expenses"
              className="text-white d-flex align-items-center mb-3 nav-item"
            >
              <DollarSign className="me-2" />
              {isSidebarOpen && 'Expenses'}
            </Nav.Link>
          </OverlayTrigger>

          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 150 }}
            overlay={!isSidebarOpen ? renderTooltip('Debtors') : <></>}
          >
            <Nav.Link
              as={Link}
              to="/admin/reports/debtors"
              className="text-white d-flex align-items-center mb-3 nav-item"
            >
              <Users className="me-2" />
              {isSidebarOpen && 'Debtors'}
            </Nav.Link>
          </OverlayTrigger>
        </Nav>
      </aside>

      {/* Main Content */}
      <main className="reports-layout-main flex-grow-1 p-4">{children}</main>
    </div>
  );
};

export default ReportsLayout;
