import React from "react";
import { Button, Row, Col } from "react-bootstrap";

const DebtorsHeader = ({ onAddDebtor }) => {
  return (
    <Row className="align-items-center mb-3">
      <Col>
        <h3>Debtors</h3>
      </Col>
      <Col className="d-flex justify-content-end">
        <Button variant="primary" onClick={onAddDebtor}>
          Add Debtor
        </Button>
      </Col>
    </Row>
  );
};

export default DebtorsHeader;
