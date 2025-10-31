import React from "react";
import { Button } from "react-bootstrap";

const DebtorsHeader = ({ onAddDebtor}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1>Debtors</h1>
      <Button onClick={onAddDebtor}>Add Debtor</Button>
    </div>
  );
};

export default DebtorsHeader;
