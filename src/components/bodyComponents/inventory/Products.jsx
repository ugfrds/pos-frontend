import  { useState, useEffect } from "react";
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "../../../api";
import ManageInventoryModal from "./ManageInventoryModal";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Paper,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // To hold product data for editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 

   // Handle rows per page change
   const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Convert string to number
    setPage(0); // Reset to first page
  };

  // Slice data for current page
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    // Fetch initial list of products
    const getProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchMenuItems();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        // Update product
        const updatedProduct = await updateMenuItem(formData.id, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
      } else {
        // Create new product
        const newProduct = await createMenuItem(formData);
        setProducts((prev) => [...prev, newProduct]);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeCategory === "All" || product.category === activeCategory)
    );
    setFilteredProducts(filtered); // Update filtered products
  }, [products, searchQuery, activeCategory]); 

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Trigger filtering via useEffect
  };

  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue); // Trigger filtering via useEffect
  };

  const handleReset = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  // Categories for the tabs
  const categories = ["All", ...new Set(products.map((item) => item.category))];

  return loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <CircularProgress />
    </Box>
  ) : (
    
      <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      {/* Top Action Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        sx={{ mb: 2 }}
      >
        Add New Product
      </Button>
        <TextField
          placeholder="Search products..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: "50%" }}
        />
      </Box>

      {/* Reset Button */}
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset Filters
        </Button>
      </Box>

      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {categories.map((category) => (
          <Tab label={category} value={category} key={category} />
        ))}
      </Tabs>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

         {/* Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        component="div"
        count={filteredProducts.length} // Total number of items
        rowsPerPage={rowsPerPage} // Rows per page
        page={page} // Current page
        onPageChange={handleChangePage} // Page change handler
        onRowsPerPageChange={handleChangeRowsPerPage} // Rows per page change handler
      />
      </TableContainer>
      
      {/* ManageInventoryModal for creating/updating products */}
      <ManageInventoryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onSave={handleSave}
      />
    </Box>
  );
}
