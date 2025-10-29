import React from "react";
import { Box, Typography, Button, TextField } from "@mui/material";

const ExpensesHeader = ({ onAddExpense, onDateChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Expenses
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="From"
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => onDateChange("from", e.target.value)}
        />
        <TextField
          label="To"
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => onDateChange("to", e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={onAddExpense}>
          Add Expense
        </Button>
      </Box>
    </Box>
  );
};

export default ExpensesHeader;
