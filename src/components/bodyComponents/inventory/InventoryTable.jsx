import React from "react";
import { Table, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FormatCurrency } from "../../../utils/index";
import "./InventoryStyles.css";

const InventoryTable = ({ inventoryItems, onEdit, onDelete, currency }) => {
  return (
    <div className="inventory-table-container shadow-sm rounded bg-white p-3">
      <Table hover responsive className="align-middle mb-0 modern-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th className="text-center">Stock</th>
            <th className="text-end">Unit Price</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-muted">
                No inventory items found.
              </td>
            </tr>
          ) : (
            inventoryItems.map((item) => (
              <tr key={item.id}>
                <td className="fw-semibold">{item.name}</td>
                <td>{item.category || "—"}</td>
                <td className="text-center">{item.stock_quantity}</td>
                <td className="text-end">
                  {FormatCurrency(item.unitPrice, currency)}
                </td>
                <td className="text-center">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Edit</Tooltip>}
                  >
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2 rounded-circle icon-btn"
                      onClick={() => onEdit(item)}
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Delete</Tooltip>}
                  >
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-circle icon-btn"
                      onClick={() => onDelete(item.id)}
                    >
                      <FaTrash />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default InventoryTable;
