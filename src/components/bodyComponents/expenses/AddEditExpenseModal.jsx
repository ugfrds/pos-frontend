import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function AddEditExpenseModal({
  open,
  onClose,
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

  // Sync `formData` with the expense being edited
  useEffect(() => {
    if (expense && open) {
      setFormData({
        date: expense.date || "",
        description: expense.description || "",
        category: expense.category || "",
        amount: expense.amount || "",
        customCategory: "", // reset customCategory when editing an expense
      });
    } else if (!expense && open) {
      setFormData({
        date: "",
        description: "",
        category: "",
        amount: "",
        customCategory: "",
      });
    }
  }, [expense, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const expenseData = { ...formData, id: expense?.id || null };
    onSave(expenseData); // Pass expense data to onSave
    onClose(); // Close modal after saving
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" mb={2}>
          {expense ? "Update Expense" : "Add New Expense"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              name="date"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={formData.category || formData.customCategory}
                onChange={handleChange}
                name={formData.category ? "category" : "customCategory"}
              >
                {existingCategories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
                {!formData.category && (
                  <MenuItem value={formData.customCategory}>
                    {formData.customCategory || "Create New Category"}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {formData.category === "" && (
            <Grid item xs={12}>
              <TextField
                label="Custom Category"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          )}

          <Grid item xs={6}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {expense ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
