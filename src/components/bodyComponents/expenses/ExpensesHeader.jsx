import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

const ExpensesHeader = ({ onAddExpense, searchQuery, setSearchQuery, amountRange, setAmountRange }) => {
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
        {/* TODO: Add amount range filter if needed */}
        <Button variant="primary" onClick={onAddExpense}>
          Add Expense
        </Button>
      </Col>
    </Row>
  );
};

export default ExpensesHeader;