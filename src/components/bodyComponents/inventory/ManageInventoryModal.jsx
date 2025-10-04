import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
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

export default function ManageInventoryModal({
  open,
  onClose,
  product,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock_quantity: "",
  });

  // Sync `formData` with the product being edited
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        stock_quantity: product.stock_quantity || "",
      });
    } else if (!product && open) {
      setFormData({
        name: "",
        category: "",
        price: "",
        stock_quantity: "",
      });
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...formData, id: product?.id || null });
    onClose(); // Close modal after saving
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" mb={2}>
          {product ? "Update Product" : "Add New Product"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Stock Quantity"
              name="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {product ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
