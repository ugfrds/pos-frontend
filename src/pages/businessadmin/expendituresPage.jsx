import React, { useState } from 'react';
import Header from '../../components/expenses/Header';
import DateRangeFilter from '../../components/expenses/dateRangeFilter';
//import SummarySection from '../../components/expenses/SummarySection';
import ExpendituresTable from '../../components/expenses//ExpendituresTable';
import AddExpenditureModal from '../../components/expenses/AddExpenditureModal';
import AddCategoryModal from '../../components/expenses/AddCategoryModal';

const ExpendituresPage = () => {
  // State to manage expenditures, categories, vendors, and modal visibility
  const [expenditures, setExpenditures] = useState([]);
  const [categories, setCategories] = useState(['Supplies', 'Utilities', 'Payroll']);
  const [vendors, setVendors] = useState(['Vendor A', 'Vendor B']);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddExpenditureModalVisible, setIsAddExpenditureModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);

  // Function to open the Add Expenditure Modal
  const openAddExpenditureModal = () => {
    setIsAddExpenditureModalVisible(true);
  };

  // Function to close the Add Expenditure Modal
  const closeAddExpenditureModal = () => {
    setIsAddExpenditureModalVisible(false);
  };

  // Function to open the Add Category Modal
  const openAddCategoryModal = () => {
    setIsAddCategoryModalVisible(true);
  };

  // Function to close the Add Category Modal
  const closeAddCategoryModal = () => {
    setIsAddCategoryModalVisible(false);
  };

  // Function to handle adding a new expenditure
  const handleAddExpenditure = (newExpenditure) => {
    setExpenditures([...expenditures, newExpenditure]);
    closeAddExpenditureModal();
  };

  // Function to handle adding a new category
  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    closeAddCategoryModal();
  };

  // Function to handle filtering by date range
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  // Function to handle search term change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="container mt-4">
      <Header onAddExpenditure={openAddExpenditureModal} />
      <DateRangeFilter onDateChange={handleDateRangeChange} onSearchChange={handleSearchChange} />
      {/*<SummarySection totalExpenditures={expenditures.reduce((total, exp) => total + exp.amount, 0)} topVendors={vendors} />*/}
      <ExpendituresTable expenditures={expenditures} onEdit={openAddExpenditureModal} onDelete={(id) => setExpenditures(expenditures.filter(exp => exp.id !== id))} />
      <AddExpenditureModal
        isVisible={isAddExpenditureModalVisible}
        onClose={closeAddExpenditureModal}
        onSave={handleAddExpenditure}
        categories={categories}
        vendors={vendors}
      />
      <AddCategoryModal
        isVisible={isAddCategoryModalVisible}
        onClose={closeAddCategoryModal}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
};

export default ExpendituresPage;
