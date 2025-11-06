import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const InventoryHeader = ({ onAddItem }) => {
  return (
    <Row className="align-items-center mb-4">
      <Col md={6}>
        <h3 className="fw-bold text-dark mb-0">Inventory Management</h3>
      </Col>

      <Col
        md={6}
        className="d-flex justify-content-end align-items-center gap-2"
      >
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2 shadow-sm"
          onClick={onAddItem}
        >
          <FaPlus />
          <span>Add Item</span>
        </Button>
      </Col>
    </Row>
  );
};

export default InventoryHeader;
