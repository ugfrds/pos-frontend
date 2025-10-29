// ExpensesPage.js
import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import FiltersCard from './wise'; // New component for filters
import { Container, Row, Col, Card } from 'react-bootstrap';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([
        'Inventory',
        'Salaries',
        'Rent',
        'Utilities',
        'Miscellaneous',
    ]); // Default categories

    const addExpense = (expense) => {
        setExpenses([...expenses, expense]);
    };

    const addCategory = (newCategory) => {
        if (!categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
        }
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <h4>Manage Expenses</h4>
                            <ExpenseForm addExpense={addExpense} categories={categories} addCategory={addCategory} />
                        </Card.Body>
                    </Card>
                    <FiltersCard />
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <h4>Expense History</h4>
                            <ExpenseList expenses={expenses} categories={categories} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ExpensesPage;
