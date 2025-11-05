import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { FaFilter } from 'react-icons/fa';

const ExpensesHeader = ({ onAddExpense, searchQuery, setSearchQuery, onFilterChange, onApplyCustomRange }) => {
  const [period, setPeriod] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      onFilterChange(newPeriod, '', '');
    }
  };

  const handleApplyClick = () => {
    if (startDate && endDate) {
      onApplyCustomRange(startDate, endDate);
    } else {
      // Optionally, show an error message to the user
      console.error('Please select both start and end dates.');
    }
  };

  return (
    <Row className="align-items-center mb-3">
      <Col md={4}>
        <h3>Expenses</h3>
      </Col>
      <Col md={8} className="d-flex justify-content-end align-items-center">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="me-2" style={{width: '200px'}}
        />
        <Form.Group className="me-2">
          <Form.Select
            value={period}
            onChange={handlePeriodChange}
          >
            <option value="today">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="custom">Custom Range</option>
          </Form.Select>
        </Form.Group>

        {period === 'custom' && (
          <>
            <Form.Group className="me-2">
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="me-2">
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleApplyClick} className="me-2">
              Apply
            </Button>
          </>
        )}
        <Button variant="primary" onClick={onAddExpense}>
          Add Expense
        </Button>
      </Col>
    </Row>
  );
};

export default ExpensesHeader;