import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { format } from "date-fns";

const DebtorsTable = ({ debtors, onEdit, onDelete, currency }) => {
  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>Debtor Name</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {debtors.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center">No debtor records found.</td>
          </tr>
        ) : (
          debtors.map((debtor) => (
            <tr key={debtor.id}>
              <td>{debtor.name}</td>
              <td>{debtor.description}</td>
              <td>{currency} {parseFloat(debtor.amount).toFixed(2)}</td>
              <td>{debtor.status}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(debtor)}>
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(debtor.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default DebtorsTable;
