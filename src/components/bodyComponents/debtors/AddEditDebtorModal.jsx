import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const AddEditDebtorModal = ({ show, onHide, onSave, debtor }) => {
  const [debtorData, setDebtorData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    status: "Unpaid",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (debtor) {
      setDebtorData({
        name: debtor.name || "",
        amount: debtor.amount || "",
        dueDate: debtor.dueDate || "",
        status: debtor.status || "Unpaid",
        description: debtor.description || "",
        id: debtor.id, // Keep the ID for updates
      });
    } else {
      setDebtorData({
        name: "",
        amount: "",
        dueDate: "",
        status: "Unpaid",
        description: "",
      });
    }
    setError("");
  }, [debtor, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDebtorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!debtorData.name || !debtorData.amount || !debtorData.dueDate) {
      setError("Please fill in all required fields (Name, Amount, Due Date).");
      return;
    }
    if (isNaN(parseFloat(debtorData.amount)) || parseFloat(debtorData.amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    try {
      await onSave(debtorData);
      onHide();
    } catch (err) {
      setError(err.message || "Failed to save debtor.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{debtor ? "Edit Debtor" : "Add New Debtor"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Debtor Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={debtorData.name}
              onChange={handleChange}
              placeholder="Enter debtor name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={debtorData.amount}
              onChange={handleChange}
              placeholder="Enter amount owed"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={debtorData.dueDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={debtorData.status}
              onChange={handleChange}
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={debtorData.description}
              onChange={handleChange}
              placeholder="Add a description (e.g., invoice number, reason for debt)"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditDebtorModal;
