import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddEditExpenseModal = ({
  show,
  onHide,
  onSave,
  expense,
  existingCategories,
}) => {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    customCategory: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date || "",
        description: expense.description || "",
        category: expense.category || "",
        amount: expense.amount || "",
        customCategory: "",
      });
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setFormData({
        date: today,
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
      formData.category === "custom"
        ? formData.customCategory.trim()
        : formData.category;

    onSave({
      ...formData,
      category: finalCategory || "Uncategorized",
      id: expense?.id || null,
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          {expense ? "Update Expense" : "Add New Expense"}
        </Modal.Title>
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
              placeholder="Enter description"
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
              {existingCategories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
              <option value="custom">+ Create new</option>
            </Form.Select>
          </Form.Group>

          {formData.category === "custom" && (
            <Form.Group className="mb-3">
              <Form.Label>New Category</Form.Label>
              <Form.Control
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Enter new category name"
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
              placeholder="Enter amount"
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
};

export default AddEditExpenseModal;
