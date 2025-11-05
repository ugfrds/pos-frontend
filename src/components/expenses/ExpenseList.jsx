// ExpenseList.js
import React, { useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import {FormatCurrency} from '../../utils/index';

const ExpenseList = ({ expenses }) => {
    const [filter, setFilter] = useState({ type: '', startDate: '', endDate: '' });
    const [sortBy, setSortBy] = useState('date');

    // Sort expenses based on the selected field
    const sortedExpenses = [...expenses].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'amount') {
            return b.amount - a.amount;
        } else if (sortBy === 'type') {
            return a.expenseType.localeCompare(b.expenseType);
        }
        return 0;
    });

    // Filter expenses based on date range and type
    const filteredExpenses = sortedExpenses.filter((expense) => {
        const withinDateRange = (!filter.startDate || new Date(expense.date) >= new Date(filter.startDate))
            && (!filter.endDate || new Date(expense.date) <= new Date(filter.endDate));
        const matchesType = filter.type ? expense.expenseType === filter.type : true;

        return withinDateRange && matchesType;
    });

    return (
        <div>
            <h4>Filters</h4>
            <Form className="mb-3">
                <Form.Group controlId="filterType">
                    <Form.Label>Filter by Type</Form.Label>
                    <Form.Control as="select" onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                        <option value="">All Types</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Salaries">Salaries</option>
                        <option value="Rent">Rent</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="filterStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" onChange={(e) => setFilter({ ...filter, startDate: e.target.value })} />
                </Form.Group>

                <Form.Group controlId="filterEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="date" onChange={(e) => setFilter({ ...filter, endDate: e.target.value })} />
                </Form.Group>
            </Form>

            <h4>Sort by</h4>
            <Form.Group controlId="sortBy">
                <Form.Control as="select" onChange={(e) => setSortBy(e.target.value)}>
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="type">Type</option>
                </Form.Control>
            </Form.Group>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.map((expense, index) => (
                        <tr key={index}>
                            <td>{expense.date}</td>
                            <td>{expense.expenseType}</td>
                            <td>{FormatCurrency(expense.amount)}</td>
                            <td>{expense.description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ExpenseList;
