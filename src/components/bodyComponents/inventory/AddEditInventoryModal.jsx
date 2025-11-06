import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "./InventoryStyles.css";

const AddEditInventoryModal = ({ show, onHide, onSave, item }) => {
  const [formData, setFormData] = useState({ name: "", category: "", quantity: "", unitPrice: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        category: item.category || "",
        quantity: item.quantity || "",
        unitPrice: item.unitPrice || "",
      });
    } else {
      setFormData({ name: "", category: "", quantity: "", unitPrice: "" });
    }
    setError(null);
  }, [item, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.quantity || !formData.unitPrice) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isNaN(formData.quantity) || formData.quantity < 0) {
      setError("Quantity must be a non-negative number.");
      return;
    }
    if (isNaN(formData.unitPrice) || formData.unitPrice < 0) {
      setError("Unit Price must be a non-negative number.");
      return;
    }

    try {
      await onSave({ ...formData, id: item?.id });
      onHide();
    } catch (err) {
      setError(err.message || "Failed to save item.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>{item ? "Edit Inventory Item" : "Add New Inventory Item"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Item Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter item name" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Enter category (optional)" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Unit Price</Form.Label>
            <Form.Control type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} placeholder="Enter unit price" step="0.01" required />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditInventoryModal;
