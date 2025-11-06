import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { FaPlus, FaFilter } from "react-icons/fa";

const ExpensesHeader = ({
  onAddExpense,
  searchQuery,
  setSearchQuery,
  onFilterChange,
  onApplyCustomRange,
}) => {
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    if (newPeriod !== "custom") {
      onFilterChange(newPeriod, "", "");
    }
  };

  const handleApplyClick = () => {
    if (startDate && endDate) {
      onApplyCustomRange(startDate, endDate);
    } else {
      console.error("Please select both start and end dates.");
    }
  };

  return (
    <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
      <Row className="align-items-center">
        <Col md={4}>
          <h4 className="fw-bold mb-0">💸 Expenses</h4>
        </Col>
        <Col
          md={8}
          className="d-flex justify-content-end align-items-center flex-wrap"
        >
          <Form.Control
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="me-2 mb-2"
            style={{ width: "220px" }}
          />

          <Form.Group className="me-2 mb-2">
            <Form.Select
              value={period}
              onChange={handlePeriodChange}
              className="shadow-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="custom">Custom Range</option>
            </Form.Select>
          </Form.Group>

          {period === "custom" && (
            <>
              <Form.Group className="me-2 mb-2">
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="shadow-sm"
                />
              </Form.Group>
              <Form.Group className="me-2 mb-2">
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="shadow-sm"
                />
              </Form.Group>
              <Button
                variant="outline-secondary"
                onClick={handleApplyClick}
                className="me-2 mb-2"
              >
                <FaFilter className="me-1" /> Apply
              </Button>
            </>
          )}

          <Button
            variant="primary"
            onClick={onAddExpense}
            className="d-flex align-items-center mb-2"
          >
            <FaPlus className="me-1" /> Add Expense
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ExpensesHeader;
