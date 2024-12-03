// src/components/MenuCategory.js
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const MenuCategory = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="mb-4">
            <ButtonGroup>
                <Button 
                    variant={selectedCategory ? "secondary" : "dark"} 
                    className="me-2 mb-2"
                    onClick={() => onSelectCategory(null)}
                >
                    All
                </Button>
                {categories.map((category) => (
                    <Button 
                        key={category} 
                        variant={selectedCategory === category ? "primary" : "dark"} 
                        className="me-2 mb-2"
                        onClick={() => onSelectCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    );
};

export default MenuCategory;
