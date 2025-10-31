import React, { useState, useEffect } from 'react';
import { getExpensesOverview } from '../../../api.jsx';
import { Card, ListGroup, Spinner, Alert, Dropdown, Form, Button } from 'react-bootstrap';
import { FaMoneyBillWave, FaTags, FaCalendarDay, FaChartLine, FaExclamationCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';

const StatCard = ({ title, value, icon, trend }) => (
  <ListGroup.Item className="d-flex justify-content-between align-items-start">
    <div className="ms-2 me-auto">
      <div className="fw-bold">{title}</div>
      {value}
    </div>
    <div className="d-flex flex-column align-items-end">
        {icon}
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

  const trendData = {
    labels: overview.sevenDayTrend.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Last 7 Days',
        data: overview.sevenDayTrend.map(d => d.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

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
            icon={<FaMoneyBillWave size={24} />}
            trend={{ direction: overview.changeVsPrevious >= 0 ? 'up' : 'down', value: `${overview.changeVsPrevious.toFixed(2)}%` }}
          />
          <StatCard
            title="Top Category"
            value={overview.topCategory ? `${overview.topCategory.name} (${overview.topCategory.amount.toFixed(2)})` : 'N/A'}
            icon={<FaTags size={24} />}
          />
          <StatCard
            title="Avg. Daily Spend"
            value={`${overview.avgDailySpend.toFixed(2)}`}
            icon={<FaCalendarDay size={24} />}
          />
          <StatCard
            title="Largest Expense"
            value={overview.largestExpense ? `${overview.largestExpense.name} (${overview.largestExpense.amount.toFixed(2)})` : 'N/A'}
            icon={<FaChartLine size={24} />}
          />
        </ListGroup>
        <div className="mt-4">
            <h6 className="text-center">7-Day Trend</h6>
            <Bar data={trendData} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExpensesSidebar;
