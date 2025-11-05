import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Spinner, Alert, Dropdown, Form, Button } from 'react-bootstrap';
import { FaExclamationCircle } from 'react-icons/fa';
import { getInventoryOverview } from '../../../api.jsx'; // Re-importing the API function
import { FormatCurrency } from '../../../utils/index.jsx'; // Assuming this utility exists

const StatCard = ({ title, value }) => (
  <ListGroup.Item className="d-flex justify-content-between align-items-start">
    <div className="ms-2 me-auto">
      <div className="fw-bold">{title}</div>
      {value}
    </div>
  </ListGroup.Item>
);

const InventorySidebar = ({ currency, handleViewStockStatus, refreshOverview }) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const data = await getInventoryOverview();
        setOverview(data);
      } catch (err) {
        console.error("Failed to fetch inventory overview:", err);
        setError('Failed to fetch inventory overview.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [refreshOverview]); // Depend on refreshOverview to re-fetch when inventory changes

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <FaExclamationCircle className="me-2" /> {error}
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title as="h5" className="mb-0">Inventory Overview</Card.Title>
      </Card.Header>
      <Card.Body>
        {overview && (
          <ListGroup variant="flush">
            <StatCard
              title="Total Stock Value"
              value={overview.totalStockValue ? FormatCurrency(overview.totalStockValue, currency) : 'N/A'}
            />
            <StatCard
              title="Total Unique Items"
              value={overview.totalUniqueItems || 0}
            />
            <ListGroup.Item className="d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Low Stock Items</div>
                {overview.lowStockItemsCount || 0}
              </div>
              <Button variant="outline-primary" size="sm" onClick={() => handleViewStockStatus("low")}>
                View
              </Button>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Out of Stock Items</div>
                {overview.outOfStockItemsCount || 0}
              </div>
              <Button variant="outline-primary" size="sm" onClick={() => handleViewStockStatus("out")}>
                View
              </Button>
            </ListGroup.Item>
          </ListGroup>
        )}

        {overview && overview.categoryBreakdown && overview.categoryBreakdown.length > 0 && (
          <div className="mt-4">
            <h6 className="text-center">Stock Value by Category</h6>
            <ListGroup variant="flush">
              {overview.categoryBreakdown.map((cat, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <span>{cat.name}</span>
                  <span>{FormatCurrency(cat.value, currency)} ({((cat.value / overview.totalStockValue) * 100).toFixed(1)}%)</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default InventorySidebar;
