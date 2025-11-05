import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Tabs, Tab, Form, Pagination } from "react-bootstrap";
import DebtorsHeader from "./DebtorsHeader";
import DebtorsTable from "./DebtorsTable";
import AddEditDebtorModal from "./AddEditDebtorModal";
import DebtorsSidebar from "./DebtorsSidebar";
import { createDebtor, fetchDebtors, deleteDebtor, updateDebtor } from "../../../api";
import { UserBusinessContext } from "../../../context/UserBusinessContext";

const Debtors = () => {
  const { business } = useContext(UserBusinessContext);
  const [debtors, setDebtors] = useState([]);
  const [filteredDebtors, setFilteredDebtors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [amountRange, setAmountRange] = useState([0, null]);
  const [activeTab, setActiveTab] = useState("All"); // Could be 'All', 'Paid', 'Unpaid', 'Overdue'
  const [period, setPeriod] = useState("All Time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDebtors();
  }, [page, rowsPerPage, period, startDate, endDate]);

  useEffect(() => {
    applyFilters();
  }, [debtors, searchQuery, amountRange, activeTab]);

  const getDebtors = async () => {
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
      const data = await fetchDebtors({ params });
      
      let list = [];
      let total = 0;

      if (data && Array.isArray(data.data)) {
        list = data.data;
        total = data.total || data.data.length;
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
        name: item.name || 'N/A',
        amount: parseFloat(item.amount) || 0,
        dueDate: item.dueDate || new Date().toISOString().split('T')[0],
        status: item.status || 'Unpaid',
        description: item.description || ''
      }));
      
      setDebtors(normalized);
      setTotalCount(total);
    } catch (error) {
      console.error("Error fetching debtors:", error);
      setDebtors([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDebtor = () => {
    setSelectedDebtor(null);
    setIsModalOpen(true);
  };

  const handleEditDebtor = (debtor) => {
    setSelectedDebtor(debtor);
    setIsModalOpen(true);
  };

  const handleDeleteDebtor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this debtor record?")) {
      return;
    }
    
    try {
      await deleteDebtor(id);
      setDebtors((prev) => prev.filter((deb) => deb.id !== id));
      if (filteredDebtors.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Failed to delete debtor", error);
      alert("Failed to delete debtor. Please try again.");
    }
  };

  const handleSaveDebtor = async (debtorData) => {
    try {
      const submissionData = {
        ...debtorData,
        amount: parseFloat(debtorData.amount),
        status: debtorData.status || 'Unpaid'
      };

      let result;
      if (debtorData.id) {
        result = await updateDebtor(debtorData.id, submissionData);
      } else {
        result = await createDebtor(submissionData);
      }

      const normalizedResult = { 
        ...result, 
        id: result.id || result._id 
      };

      if (debtorData.id) {
        setDebtors((prev) => 
          prev.map((deb) => (deb.id === normalizedResult.id ? normalizedResult : deb))
        );
      } else {
        setDebtors((prev) => [normalizedResult, ...prev]);
        setPage(1);
      }
    } catch (error) {
      console.error("Failed to save debtor", error);
      alert("Failed to save debtor. Please try again.");
      throw error;
    }
  };

  const applyFilters = () => {
    let filtered = [...debtors];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (deb) =>
          (deb.name?.toLowerCase().includes(query) || false) ||
          (deb.description?.toLowerCase().includes(query) || false) ||
          (deb.status?.toLowerCase().includes(query) || false)
      );
    }

    if (activeTab !== "All") {
      filtered = filtered.filter((deb) => deb.status === activeTab);
    }

    if (amountRange && amountRange.length === 2) {
      const [min, max] = amountRange;
      filtered = filtered.filter((deb) => {
        const amount = deb.amount;
        const minCondition = min === null || amount >= min;
        const maxCondition = max === null || amount <= max;
        return minCondition && maxCondition;
      });
    }

    setFilteredDebtors(filtered);
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

  const totalFilteredPages = Math.ceil(filteredDebtors.length / rowsPerPage);
  const paginatedDebtors = filteredDebtors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const debtorStatuses = ["All", "Unpaid", "Paid", "Overdue"];

  return (
    <Row className="m-3 p-3">
      <Col md={8}>
        <Card className="h-100 p-3">
          <Card.Body>
            <DebtorsHeader
              onAddDebtor={handleAddDebtor}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onFilterChange={handleFilterChange}
              onApplyCustomRange={handleApplyCustomRange}
              currentPeriod={period}
            />
            
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => {
                setActiveTab(k);
                setPage(1);
              }}
              className="mb-3"
            >
              {debtorStatuses.map((status) => (
                <Tab key={status} eventKey={status} title={status} />
              ))}
            </Tabs>


            {loading ? (
              <p>Loading debtors...</p>
            ) : paginatedDebtors.length === 0 ? (
              <p className="text-center mt-3">No debtors found for {period}.</p>
            ) : (
              <>
                <DebtorsTable
                  debtors={paginatedDebtors}
                  onEdit={handleEditDebtor}
                  onDelete={handleDeleteDebtor}
                  currency={business?.settings?.currency || "$"}
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
                    Showing {paginatedDebtors.length} of {filteredDebtors.length} debtors
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

            <AddEditDebtorModal
              show={isModalOpen}
              onHide={() => setIsModalOpen(false)}
              onSave={handleSaveDebtor}
              debtor={selectedDebtor}
            />
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <DebtorsSidebar />
      </Col>        
    </Row>
  );
};

export default Debtors;
