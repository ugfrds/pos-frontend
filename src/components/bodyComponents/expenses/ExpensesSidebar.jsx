import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  Dropdown,
  ListGroup,
  Spinner,
  Alert,
  Form,
  Button,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  FaArrowUp,
  FaArrowDown,
  FaExclamationCircle,
  FaSyncAlt
} from 'react-icons/fa';
import { getExpensesOverview } from '../../../api.jsx';
import { FormatCurrency } from '../../../utils';
import { UserBusinessContext } from '../../../context/UserBusinessContext';
import '../inventory/InventoryStyles.css';

const StatCard = ({ title, value, trend }) => (
  <ListGroup.Item className="d-flex justify-content-between align-items-start py-3">
    <div className="ms-2 me-auto">
      <div className="fw-bold">{title}</div>
      {value}
    </div>
    {trend && (
      <div className="d-flex flex-column align-items-end">
        <small
          className={`d-flex align-items-center ${
            trend.direction === 'up' ? 'text-success' : 'text-danger'
          }`}
        >
          {trend.direction === 'up' ? <FaArrowUp /> : <FaArrowDown />}{' '}
          {trend.value}
        </small>
      </div>
    )}
  </ListGroup.Item>
);

const ExpensesSidebar = () => {
  const { business } = useContext(UserBusinessContext);
  const currency = business?.settings?.currency || 'USD';
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('thisMonth'); // ✅ Default daily
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const fetchOverview = async () => {
    try {
      setLoading(true);
      let data;
      if (period === 'custom') {
        data = await getExpensesOverview(period, customStartDate, customEndDate);
      } else {
        data = await getExpensesOverview(period);
      }
      setOverview(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expenses overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, customStartDate, customEndDate]);

  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod);
    if (selectedPeriod !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  if (loading)
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger">
        <FaExclamationCircle className="me-2" /> {error}
      </Alert>
    );

  const periodLabels = {
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    custom: 'Custom Range',
  };

  return (
    <Card className="shadow-sm rounded modern-card">
      <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
        <Card.Title as="h5" className="mb-0">
          Expenses Overview
        </Card.Title>
        <div className="d-flex align-items-center">
          <Dropdown onSelect={handlePeriodChange} className="me-2">
            <Dropdown.Toggle variant="outline-light" size="sm">
              {periodLabels[period] || 'Select Period'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="today">Today</Dropdown.Item>
              <Dropdown.Item eventKey="thisWeek">This Week</Dropdown.Item>
              <Dropdown.Item eventKey="thisMonth">This Month</Dropdown.Item>
              <Dropdown.Item eventKey="custom">Custom Range</Dropdown.Item>
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
        {period === 'custom' && (
          <div className="mb-3">
            <Form.Group controlId="customStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="customEndDate" className="mt-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="mt-3"
_              onClick={fetchOverview}
            >
              Fetch Custom Data
            </Button>
          </div>
        )}

        {overview && (
          <>
            <ListGroup variant="flush">
              <StatCard
                title="Total Expenses"
                value={FormatCurrency(overview.totalExpenses, currency)}
                trend={{
                  direction: overview.changeVsPrevious >= 0 ? 'up' : 'down',
                  value: `${overview.changeVsPrevious.toFixed(2)}%`,
                }}
              />
              <StatCard
                title="Top Category"
                value={
                  overview.topCategory
                    ? `${overview.topCategory.name} (${FormatCurrency(
                        overview.topCategory.amount,
                        currency
                      )})`
                    : 'N/A'
                }
              />
              <StatCard
                title="Avg. Daily Spend"
                value={FormatCurrency(overview.avgDailySpend, currency)}
              />
              <StatCard
                title="Largest Expense"
                value={
                  overview.largestExpense
                    ? `${overview.largestExpense.name} (${FormatCurrency(
                        overview.largestExpense.amount,
                        currency
                      )})`
                    : 'N/A'
                }
              />
            </ListGroup>

            {overview.categoryBreakdown?.length > 0 && (
              <div className="mt-4">
                <h6 className="text-center text-muted mb-3">
                  Expenses by Category
                </h6>
                <ListGroup variant="flush">
                  {overview.categoryBreakdown.map((cat, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{cat.name}</span>
                      <span>
                        {FormatCurrency(cat.amount, currency)} (
                        {((cat.amount / overview.totalExpenses) * 100).toFixed(1)}%)
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ExpensesSidebar;