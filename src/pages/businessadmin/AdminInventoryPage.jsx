import React, { useState, useEffect, useContext, useCallback } from "react";
import { Container, Row, Col, Card, Form, Pagination, Alert, Spinner, Tabs, Tab, Button } from "react-bootstrap";
import InventoryHeader from "../../components/bodyComponents/inventory/InventoryHeader";
import InventoryTable from "../../components/bodyComponents/inventory/InventoryTable";
import AddEditInventoryModal from "../../components/bodyComponents/inventory/AddEditInventoryModal";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../api";
import { UserBusinessContext } from "../../context/UserBusinessContext";
import InventorySidebar from "../../components/bodyComponents/inventory/InventorySidebar";
import { getCachedData, invalidateCache } from "../../utils/Cache";

const AdminInventoryPage = () => {
  const { business } = useContext(UserBusinessContext);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredInventoryItems, setFilteredInventoryItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [stockStatusFilter, setStockStatusFilter] = useState("all"); // New state for stock status filter
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInventoryItems();
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [inventoryItems, activeCategory, searchQuery, stockStatusFilter, page, rowsPerPage]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1); // Reset to first page when category changes
  };

  const applyFilters = () => {
    let filtered = inventoryItems;

    if (activeCategory !== "All") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (stockStatusFilter === "low") {
      filtered = filtered.filter(item => item.stock_quantity <= (item.reorder_level || 0) && item.stock_quantity > 0);
    } else if (stockStatusFilter === "out") {
      filtered = filtered.filter(item => item.stock_quantity === 0);
    }

    setTotalCount(filtered.length);
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setFilteredInventoryItems(filtered.slice(startIndex, endIndex));
  };

  const getInventoryItems = async () => {
        setLoading(true);
        setError(null);
        const cacheKey = `inventory-unfiltered-${page}-${rowsPerPage}-${searchQuery}`;
        try {
          const fetchInventoryData = async () => {
            const params = {
              page,
              rowsPerPage,
              search: searchQuery,
            };
            console.log("Fetching inventory with cacheKey:", cacheKey, "and params:", params);
            const data = await fetchProducts(params);
            
            let list = [];
            let total = 0;
    
            if (data && Array.isArray(data.data)) {
              list = data.data;
              total = data.total || data.data.length;
            } else if (data && Array.isArray(data.inventory)) {
              list = data.inventory;
              total = data.total || data.inventory.length;
            } else if (Array.isArray(data)) {
              list = data;
              total = data.length;
            } else {
              console.warn("Unexpected response structure:", data);
              list = [];
              total = 0;
            }
    
            const normalized = list.map((item) => ({
              ...item,
              id: item.id || item._id,
              name: item.name || 'Unnamed Item',
              quantity: item.quantity || item.stock_quantity || 0,
              unitPrice: parseFloat(item.price) || 0,
              category: item.category || 'Uncategorized',
              stock_quantity: item.stock_quantity || item.quantity || 0,
            }));
            
            const uniqueCategories = ["All", ...new Set(normalized.map(item => item.category))];
            return { list: normalized, categories: uniqueCategories };
          };
    
                const cachedData = await getCachedData(cacheKey, fetchInventoryData);
                if (cachedData) {
                  setInventoryItems(cachedData.list);
                  setCategories(cachedData.categories);
                } else {
                  // If cache is empty or invalid, fetch and set data
                  const data = await fetchInventoryData();
                  setInventoryItems(data.list);
                  setCategories(data.categories);
                }
          
              } catch (err) {          console.error("Error fetching inventory items:", err);
          setError("Failed to load inventory items. Please try again.");
          setInventoryItems([]);
          setTotalCount(0);
          setCategories(["All"]);
        } finally {
          setLoading(false);
        }
      };
    
      const handleAddItem = () => {
    
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) {
      return;
    }
    
    try {
      await deleteProduct(id);
      invalidateCache('inventory-*'); // Invalidate cache after successful deletion
      getInventoryItems(); // Re-fetch inventory items after successful deletion
      refreshOverview(); // Refresh overview after deletion
    } catch (err) {
      console.error("Failed to delete inventory item", err);
      setError("Failed to delete item. Please try again.");
    }
  };

  const handleSaveItem = async (itemData) => {
    try {
      const submissionData = {
        ...itemData,
        stock_quantity: parseInt(itemData.quantity),
        price: parseFloat(itemData.unitPrice),
        ...(selectedItem && { id: selectedItem.id }), // Include id if it's an existing item
      };

      if (selectedItem) {
        await updateProduct(selectedItem.id, submissionData);
      } else {
        await createProduct(submissionData);
      }
      invalidateCache('inventory-*'); // Invalidate cache after successful save
      setIsModalOpen(false);
      getInventoryItems();
      refreshOverview(); // Refresh overview after save
    } catch (err) {
      console.error("Failed to save inventory item", err);
      setError("Failed to save item. Please try again.");
    }
  };


  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleViewStockStatus = useCallback((status) => {
    setStockStatusFilter(status);
    setActiveCategory("All"); // Reset category filter when applying stock status filter
    setSearchQuery(""); // Reset search query when applying stock status filter
    setPage(1); // Reset to first page
  }, []);

  const refreshOverview = useCallback(() => {
    // This function will be passed to InventorySidebar to trigger a re-fetch of overview data
    // For now, we can just re-fetch inventory items, which will indirectly update the overview
    // if the overview data is derived from inventory items.
    // However, since InventorySidebar fetches its own overview data, we need a way to trigger that.
    // A simple way is to introduce a state variable that changes, triggering InventorySidebar's useEffect.
    // For now, let's just re-fetch inventory items, and we'll refine this if needed.
    getInventoryItems();
  }, [getInventoryItems]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

      return (
        <Row className="m-3 p-3">
                <Col md={8}>
                  <Card className="h-100 p-3">
                    <Card.Body>
                      <InventoryHeader onAddItem={handleAddItem} />
          
                      {/* Search and Filter Controls */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ width: "50%" }}
                        />
                        <Button variant="outline-secondary" onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("All");
                          setStockStatusFilter("all"); // Reset stock status filter
                          setPage(1);
                        }}>
                          Reset Filters
                        </Button>
                      </div>
          
                      {/* Category Tabs */}
                      <Tabs
                        id="inventory-categories-tabs"
                        activeKey={activeCategory}
                        onSelect={(k) => handleCategoryChange(k)}
                        className="mb-3"
                      >
                        {categories.map((category) => (
                          <Tab eventKey={category} title={category} key={category} />
                        ))}
                      </Tabs>
          
                      {loading ? (
                        <div className="text-center my-5">
                          <Spinner animation="border" variant="primary" />
                          <p className="mt-2">Loading inventory...</p>
                        </div>
                      ) : error ? (
                        <Alert variant="danger" className="text-center">
                          {error}
                        </Alert>
                      ) : (
                        <>
                          <InventoryTable
                            inventoryItems={filteredInventoryItems}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                            currency={business?.settings?.currency || 'USD'}
                          />
                          
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <Form.Select
                              value={rowsPerPage}
                              onChange={handleRowsPerPageChange}
                              style={{ width: "120px" }}
                            >
                              {[10, 25, 50].map((size) => (
                                <option key={size} value={size}>
                                  {size} per page
                                </option>
                              ))}
                            </Form.Select>
                            
                            <span>
                              Showing {filteredInventoryItems.length} of {totalCount} items
                            </span>
                            
                            <Pagination>
                              <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                              <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                              {[...Array(totalPages).keys()].map(p => (
                                <Pagination.Item key={p+1} active={p + 1 === page} onClick={() => handlePageChange(p + 1)}>
                                  {p + 1}
                                </Pagination.Item>
                              ))}
                              <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
                            </Pagination>
                          </div>
                        </>
                      )}
          
                      <AddEditInventoryModal
                        show={isModalOpen}
                        onHide={() => setIsModalOpen(false)}
                        onSave={handleSaveItem}
                        item={selectedItem}
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <InventorySidebar currency={business?.settings?.currency || 'USD'} handleViewStockStatus={handleViewStockStatus} refreshOverview={refreshOverview} />
                </Col>        </Row>
      );
    };
    
    export default AdminInventoryPage;