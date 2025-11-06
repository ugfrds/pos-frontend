import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const DebtorsTable = ({ debtors, onEdit, onDelete, currency }) => {
  return (
    <div className="table-container mt-3">
      <Table striped hover responsive className="shadow-sm align-middle modern-table mb-0">
        <thead className="table-dark text-uppercase small">
          <tr>
            <th>Debtor Name</th>
            <th>Description</th>
            <th className="text-end">Amount</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {debtors.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted py-4">
                No debtor records found.
              </td>
            </tr>
          ) : (
            debtors.map((debtor) => (
              <tr key={debtor.id}>
                <td>{debtor.name}</td>
                <td>{debtor.description}</td>
                <td className="text-end">{currency} {parseFloat(debtor.amount).toFixed(2)}</td>
                <td>{debtor.status}</td>
                <td className="text-center">
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
    </div>
  );
};

export default DebtorsTable;
