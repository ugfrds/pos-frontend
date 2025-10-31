import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FormatCurrency } from "../../../utils/index";

const InventoryTable = ({ inventoryItems, onEdit, onDelete, currency }) => {
  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Stock Quantity</th>
          <th>Unit Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {inventoryItems.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center">No inventory items found.</td>
          </tr>
        ) : (
          inventoryItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.stock_quantity}</td>
              <td>{FormatCurrency(item.unitPrice, currency)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(item)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
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

export default InventoryTable;