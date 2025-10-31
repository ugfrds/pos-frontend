import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
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
    <Card style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Card.Body>
        <Card.Title as="h5">{isUpdating ? 'Update Product' : 'Create Product'}</Card.Title>
        <Form >
          <Row className="g-2">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Button variant="primary" type="submit">
                {isUpdating ? 'Update' : 'Create'}
              </Button>
              {isUpdating && (
                <Button
                  variant="secondary"
                  style={{ marginLeft: '10px' }}
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RootPage;
