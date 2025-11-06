import React, { useEffect, useState, useContext } from "react";
import { Card, Spinner, Alert, OverlayTrigger, Tooltip, Button, ListGroup, Dropdown } from "react-bootstrap";
import { getDebtorsOverview } from "../../../api";
import { FaExclamationCircle, FaSyncAlt } from "react-icons/fa";
import { UserBusinessContext } from "../../../context/UserBusinessContext";
import { FormatCurrency } from "../../../utils";

const StatCard = ({ title, value }) => (
  <ListGroup.Item className="d-flex justify-content-between align-items-start py-3">
    <div className="ms-2 me-auto">
      <div className="fw-bold">{title}</div>
      {value}
    </div>
  </ListGroup.Item>
);

const DebtorsSidebar = () => {
  const { business } = useContext(UserBusinessContext);
  const currency = business?.settings?.currency || 'USD';
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('thisMonth');

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await getDebtorsOverview(period);
      setOverview(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch debtors overview.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [period]);

  if (loading) return <div className="text-center p-4"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger"><FaExclamationCircle className="me-2"/> {error}</Alert>;

  const hasData = overview && (overview.totalUnpaid > 0 || overview.totalOverdue > 0 || overview.numberOfDebtors > 0);

  const periodLabels = {
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
  };

  return (
    <Card className="shadow-sm rounded modern-card">
      <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
        <Card.Title as="h5" className="mb-0">Debtors Summary</Card.Title>
        <div className="d-flex align-items-center">
          <Dropdown onSelect={(p) => setPeriod(p)} className="me-2">
            <Dropdown.Toggle variant="outline-light" size="sm">
              {periodLabels[period] || 'Select Period'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="today">Today</Dropdown.Item>
              <Dropdown.Item eventKey="thisWeek">This Week</Dropdown.Item>
              <Dropdown.Item eventKey="thisMonth">This Month</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <OverlayTrigger placement="top" overlay={<Tooltip>Refresh</Tooltip>}>
            <Button size="sm" variant="outline-light" onClick={fetchOverview}>
              <FaSyncAlt />
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Header>
      <Card.Body>
        {hasData ? (
          <ListGroup variant="flush">
            <StatCard title="Total Unpaid" value={FormatCurrency(overview.totalUnpaid, currency)} />
            <StatCard title="Total Overdue" value={FormatCurrency(overview.totalOverdue, currency)} />
            <StatCard title="Number of Debtors" value={overview.numberOfDebtors} />
          </ListGroup>
        ) : (
          <p className="text-center">No debtors data available.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default DebtorsSidebar;
