import React, { useState, useEffect } from 'react';
import { Card, Dropdown, ListGroup, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaExclamationCircle } from 'react-icons/fa';
import { getExpensesOverview } from '../../../api';
const StatCard = ({ title, value, trend }) => (
  <ListGroup.Item className="d-flex justify-content-between align-items-start">
    <div className="ms-2 me-auto">
      <div className="fw-bold">{title}</div>
      {value}
    </div>
    <div className="d-flex flex-column align-items-end">
        {trend && (
            <small className={`d-flex align-items-center ${trend.direction === 'up' ? 'text-success' : 'text-danger'}`}>
                {trend.direction === 'up' ? <FaArrowUp /> : <FaArrowDown />} {trend.value}
            </small>
        )}
    </div>
  </ListGroup.Item>
);

const ExpensesSidebar = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
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
      } catch (err) {
        setError('Failed to fetch expenses overview.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [period, customStartDate, customEndDate]);

  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod);
    if (selectedPeriod !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FaExclamationCircle className="me-2" /> {error}
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title as="h5" className="mb-0">Expenses Overview</Card.Title>
        <Dropdown onSelect={handlePeriodChange}>
          <Dropdown.Toggle variant="outline-secondary" size="sm">
            {period === 'today' && 'Today'}
            {period === 'thisWeek' && 'This Week'}
            {period === 'thisMonth' && 'This Month'}
            {period === 'custom' && 'Custom Range'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="today">Today</Dropdown.Item>
            <Dropdown.Item eventKey="thisWeek">This Week</Dropdown.Item>
            <Dropdown.Item eventKey="thisMonth">This Month</Dropdown.Item>
            <Dropdown.Item eventKey="custom">Custom Range</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Header>
      <Card.Body>
        {period === 'custom' && (
          <div className="mb-3">
            <Form.Group controlId="customStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="customEndDate" className="mt-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={() => fetchOverview()}>Fetch Custom Data</Button>
          </div>
        )}

        <ListGroup variant="flush">
          <StatCard
            title="Total Expenses"
            value={`${overview.totalExpenses.toFixed(2)}`}
            trend={{ direction: overview.changeVsPrevious >= 0 ? 'up' : 'down', value: `${overview.changeVsPrevious.toFixed(2)}%` }}
          />
          <StatCard
            title="Top Category"
            value={overview.topCategory ? `${overview.topCategory.name} (${overview.topCategory.amount.toFixed(2)})` : 'N/A'}
          />
          <StatCard
            title="Avg. Daily Spend"
            value={`${overview.avgDailySpend.toFixed(2)}`}
          />
          <StatCard
            title="Largest Expense"
            value={overview.largestExpense ? `${overview.largestExpense.name} (${overview.largestExpense.amount.toFixed(2)})` : 'N/A'}
          />
        </ListGroup>

        {overview.categoryBreakdown && overview.categoryBreakdown.length > 0 && (
          <div className="mt-4">
            <h6 className="text-center">Expenses by Category</h6>
            <ListGroup variant="flush">
              {overview.categoryBreakdown.map((cat, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <span>{cat.name}</span>
                  <span>{cat.amount.toFixed(2)} ({((cat.amount / overview.totalExpenses) * 100).toFixed(1)}%)</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ExpensesSidebar;
