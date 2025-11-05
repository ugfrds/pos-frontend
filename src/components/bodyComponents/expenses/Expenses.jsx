import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Tabs, Tab, Form, Pagination } from "react-bootstrap";
import ExpensesHeader from "./ExpensesHeader";
import ExpensesTable from "./ExpensesTable";
import AddEditExpenseModal from "./AddEditExpenseModal";

import ExpensesSidebar from "./ExpensesSidebar";
import { createExpense, fetchExpenses, fetchExpenseCategories, deleteExpense, updateExpense } from "../../../api";
import { UserBusinessContext } from "../../../context/UserBusinessContext";

const Expenses = () => {
  const { business } = useContext(UserBusinessContext);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [amountRange, setAmountRange] = useState([0, null]);
  const [activeTab, setActiveTab] = useState("All");
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExpenses();
    getCategories();
  }, [page, rowsPerPage, period, startDate, endDate]);

  useEffect(() => {
    applyFilters();
  }, [expenses, searchQuery, amountRange, activeTab]);

  const getExpenses = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        rowsPerPage,
      };
      if (period) {
        params.period = period;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
      const data = await fetchExpenses({ params });
      console.log("raw expenses response:", data);
      
      let list = [];
      let total = 0;

      if (data && Array.isArray(data.data)) {
        list = data.data;
        total = data.total || data.data.length;
      } else if (data && Array.isArray(data.expenses)) {
        list = data.expenses;
        total = data.total || data.expenses.length;
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
        description: item.description || '',
        category: item.category || 'Uncategorized',
        amount: parseFloat(item.amount) || 0,
        date: item.date || item.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      }));
      
      console.log("normalized expenses:", normalized);
      setExpenses(normalized);
      setTotalCount(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const data = await fetchExpenseCategories();
      console.log("raw categories response:", data);
      
      let cats = [];
      if (Array.isArray(data)) {
        cats = data;
      } else if (data && Array.isArray(data.categories)) {
        cats = data.categories;
      } else if (data && Array.isArray(data.data)) {
        cats = data.data;
      } else {
        console.warn("Unexpected categories response structure:", data);
        cats = [];
      }
      
      const uniqueCategories = [...new Set(cats.filter(cat => 
        cat && cat !== "All" && typeof cat === "string"
      ))];
      
      setCategories(["All", ...uniqueCategories]);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setCategories(["All"]);
    }
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }
    
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      if (filteredExpenses.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Failed to delete expense", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      const submissionData = {
        ...expenseData,
        category: expenseData.category || 'Uncategorized',
        amount: parseFloat(expenseData.amount),
        name: expenseData.name || expenseData.description || `Expense - ${expenseData.category}`
      };

      let result;
      if (expenseData.id) {
        result = await updateExpense(expenseData.id, submissionData);
      } else {
        result = await createExpense(submissionData);
      }

      const normalizedResult = { 
        ...result, 
        id: result.id || result._id 
      };

      if (expenseData.id) {
        setExpenses((prev) => 
          prev.map((exp) => (exp.id === normalizedResult.id ? normalizedResult : exp))
        );
      } else {
        setExpenses((prev) => [normalizedResult, ...prev]);
        setPage(1);
      }
      if (expenseData.category && !categories.includes(expenseData.category)) {
        setCategories(prev => [...prev, expenseData.category]);
      }
    } catch (error) {
      console.error("Failed to save expense", error);
      alert("Failed to save expense. Please try again.");
      throw error;
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          (exp.description?.toLowerCase().includes(query) || false) ||
          (exp.category?.toLowerCase().includes(query) || false) ||
          (exp.name?.toLowerCase().includes(query) || false)
      );
    }

    if (activeTab !== "All") {
      filtered = filtered.filter((exp) => exp.category === activeTab);
    }

    if (amountRange && amountRange.length === 2) {
      const [min, max] = amountRange;
      filtered = filtered.filter((exp) => {
        const amount = exp.amount;
        const minCondition = min === null || amount >= min;
        const maxCondition = max === null || amount <= max;
        return minCondition && maxCondition;
      });
    }

    setFilteredExpenses(filtered);
  };

  const handleFilterChange = (newPeriod, newStartDate, newEndDate) => {
    setPeriod(newPeriod);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setPage(1);
  };

  const handleApplyCustomRange = (newStartDate, newEndDate) => {
    setPeriod('custom');
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setPage(1);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const totalFilteredPages = Math.ceil(filteredExpenses.length / rowsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

      return (
        <Row className="m-3 p-3">
                <Col md={8}>
                  <Card className="h-100 p-3">
                    <Card.Body>
                      <ExpensesHeader
                        onAddExpense={handleAddExpense}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onFilterChange={handleFilterChange}
                        onApplyCustomRange={handleApplyCustomRange}
                      />
                      
                      <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => {
                          setActiveTab(k);
                          setPage(1);
                        }}
                        className="mb-3"
                      >
                        {categories.map((cat) => (
                          <Tab key={cat} eventKey={cat} title={cat} />
                        ))}
                      </Tabs>
          
          
                      {loading ? (
                        <p>Loading expenses...</p>
                      ) : (
                        <>
                          <ExpensesTable
                            expenses={paginatedExpenses}
                            onEdit={handleEditExpense}
                            onDelete={handleDeleteExpense}
                            currency={business.settings.currency}
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
                              Showing {paginatedExpenses.length} of {filteredExpenses.length} expenses
                            </span>
                            
                            <Pagination>
                              <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                              <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                              {[...Array(totalFilteredPages).keys()].map(p => (
                                <Pagination.Item key={p+1} active={p + 1 === page} onClick={() => handlePageChange(p + 1)}>
                                  {p + 1}
                                </Pagination.Item>
                              ))}
                              <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalFilteredPages} />
                              <Pagination.Last onClick={() => handlePageChange(totalFilteredPages)} disabled={page === totalFilteredPages} />
                            </Pagination>
                          </div>
                        </>
                      )}
          
                      <AddEditExpenseModal
                        show={isModalOpen}
                        onHide={() => setIsModalOpen(false)}
                        onSave={handleSaveExpense}
                        expense={selectedExpense}
                        existingCategories={categories.filter(cat => cat !== "All")}
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <ExpensesSidebar />
                </Col>        </Row>
      );
    };
    
    export default Expenses;