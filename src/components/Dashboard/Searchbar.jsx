// src/components/SearchBar.js
import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';

const SearchBar = ({ onSearch, onClear }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <Form className="d-flex mb-4" onSubmit={handleSearch}>
            <FormControl
                type="search"
                placeholder="Search menu items"
                className="me-2"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
                Search
            </Button>
            {query && (
                <Button variant="outline-secondary" onClick={handleClear} className="ms-2">
                    Clear
                </Button>
            )}
        </Form>
    );
};

export default SearchBar;
