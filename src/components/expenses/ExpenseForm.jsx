// ExpenseForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';

const ExpenseForm = ({ addExpense, categories, addCategory }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [newCategory, setNewCategory] = useState('');

    const onSubmit = (data) => {
        addExpense(data);
        reset(); // Clear the form after submission
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            addCategory(newCategory.trim());
            setNewCategory(''); // Clear input after adding
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="mt-3">
            {errors.amount && <Alert variant="danger">Please enter a valid amount.</Alert>}
            {errors.expenseType && <Alert variant="danger">Please select a valid expense type.</Alert>}

            <Form.Group controlId="expenseType">
                <Form.Label>Expense Type</Form.Label>
                <Form.Control as="select" {...register("expenseType", { required: true })} className={errors.expenseType ? 'is-invalid' : ''}>
                    <option value="">Select an expense type</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="newCategory">
                <Form.Label>Add New Category</Form.Label>
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Enter new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button variant="secondary" onClick={handleAddCategory}>Add</Button>
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                    type="number"
                    {...register("amount", { required: true, min: 0.01 })}
                    placeholder="Enter amount"
                    className={errors.amount ? 'is-invalid' : ''}
                />
            </Form.Group>

            <Form.Group controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                    type="date"
                    {...register("date", { required: true })}
                />
            </Form.Group>

            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    {...register("description")}
                    placeholder="Add a description (optional)"
                />
            </Form.Group>

            <Button variant="primary" type="submit">Add Expense</Button>
        </Form>
    );
};

export default ExpenseForm;
