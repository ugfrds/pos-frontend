import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

const InventoryHeader = ({ onAddItem, searchQuery, setSearchQuery }) => {
  return (
    <Row className="align-items-center mb-3">
      <Col md={4}>
        <h3>Inventory Management</h3>
      </Col>
      <Col md={8} className="d-flex justify-content-end align-items-center">
        <Form.Control
          type="text"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="me-2" style={{width: '200px'}}
        />
        <Button variant="primary" onClick={onAddItem}>
          Add Item
        </Button>
      </Col>
    </Row>
  );
};

export default InventoryHeader;