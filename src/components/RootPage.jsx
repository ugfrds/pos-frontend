import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
//import api from './api'; // Import centralized API file

const RootPage = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [productId, setProductId] = useState(null);

  // useEffect(() => {
  //   if (isUpdating && productId) {
  //     // Fetch existing product details when updating
  //     api.getProductById(productId)
  //       .then(response => {
  //         setProduct(response.data);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching product details:', error);
  //       });
  //   }
  //}, [isUpdating, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isUpdating) {
  //     api.updateProduct(productId, product)
  //       .then(() => {
  //         alert('Product updated successfully!');
  //         resetForm();
  //       })
  //       .catch(error => {
  //         console.error('Error updating product:', error);
  //       });
  //   } else {
  //     api.createProduct(product)
  //       .then(() => {
  //         alert('Product created successfully!');
  //         resetForm();
  //       })
  //       .catch(error => {
  //         console.error('Error creating product:', error);
  //       });
  //   }
  // };

  const resetForm = () => {
    setProduct({ name: '', category: '', price: '', stock: '' });
    setIsUpdating(false);
    setProductId(null);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        {isUpdating ? 'Update Product' : 'Create Product'}
      </Typography>
      <form >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              {isUpdating ? 'Update' : 'Create'}
            </Button>
            {isUpdating && (
              <Button
                variant="outlined"
                color="secondary"
                style={{ marginLeft: '10px' }}
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RootPage;
