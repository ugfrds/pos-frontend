// FiltersCard.js
import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const FiltersCard = () => {
    const [filter, setFilter] = useState({ type: '', startDate: '', endDate: '' });

    return (
        <Card className="mb-4">
            <Card.Body>
                <h4>Filters</h4>
                <Form>
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

                    <Button variant="primary" className="mt-2">Apply Filters</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default FiltersCard;
