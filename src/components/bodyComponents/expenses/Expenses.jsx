import React, { useState } from "react";
import { Box } from "@mui/material";
import ExpensesHeader from "./ExpensesHeader";
import ExpensesTable from "./ExpensesTable";
import AddEditExpenseModal from "./AddEditExpenseModal";

const mockExpenses = [
  { id: 1, date: "2024-12-01", description: "Rent", category: "Office", amount: 1200 },
  { id: 2, date: "2024-12-05", description: "Utilities", category: "Bills", amount: 300 },
  { id: 3, date: "2024-12-10", description: "Team Lunch", category: "Miscellaneous", amount: 150 },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleSaveExpense = (expense) => {
    if (expense.id) {
      // Edit existing expense
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === expense.id ? expense : exp))
      );
    } else {
      // Add new expense
      const newExpense = { ...expense, id: Date.now() };
      setExpenses((prev) => [...prev, newExpense]);
    }
  };

  return (
    <Box>
      <ExpensesHeader onAddExpense={handleAddExpense} />
      <ExpensesTable
        expenses={expenses}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />
      <AddEditExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        expense={selectedExpense}
        existingCategories={["Office", "Bills", "Miscellaneous", "Travel", "Marketing"]}
      />
    </Box>
  );
};

export default Expenses;
