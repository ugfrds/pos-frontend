import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
} from "react-bootstrap";

export default function AddEditExpenseModal({
  show,
  onHide,
  onSave,
  expense,
  existingCategories,
}) {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    customCategory: "",
  });

  useEffect(() => {
    if (expense && show) {
      setFormData({
        date: expense.date || "",
        description: expense.description || "",
        category: expense.category || "",
        amount: expense.amount || "",
        customCategory: "",
      });
    } else if (!expense && show) {
      setFormData({
        date: "",
        description: "",
        category: "",
        amount: "",
        customCategory: "",
      });
    }
  }, [expense, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = () => {
  const finalCategory =
    formData.category === "custom" ? formData.customCategory.trim() : formData.category;

  const expenseData = {
    ...formData,
    category: finalCategory || "Uncategorized",
    id: expense?.id || null,
  };

  onSave(expenseData);
  onHide();
};


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{expense ? "Update Expense" : "Add New Expense"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {existingCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
              <option value="custom">Create New Category</option>
            </Form.Select>
          </Form.Group>
          {formData.category === "custom" && (
            <Form.Group className="mb-3">
              <Form.Label>Custom Category</Form.Label>
              <Form.Control
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {expense ? "Update" : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}