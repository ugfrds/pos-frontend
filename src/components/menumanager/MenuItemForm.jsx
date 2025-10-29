import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';


const MenuItemForm = ({ currentItem, onAddOrUpdateItem, menuItems = [] }) => { // Default value for menuItems
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (currentItem) {
            setName(currentItem.name);
            setPrice(currentItem.price);
            setCategory(currentItem.category);
        } else {
            setName('');
            setPrice('');
            setCategory('');
        }
    }, [currentItem]);

    useEffect(() => {
        // Ensure menuItems is an array and filter out undefined or null values
        const validItems = Array.isArray(menuItems) ? menuItems : [];
        setCategories([...new Set(validItems.map(item => item?.category).filter(Boolean))]);
    }, [menuItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const categoryToUse = newCategory ? newCategory : category;
        const newItem = {
            id: currentItem ? currentItem.id : undefined, // Ensure id is included if updating
            name,
            price: parseFloat(price),
            category: categoryToUse,
        };
    
        try {
            await onAddOrUpdateItem(newItem);
            // Clear form fields
            setName('');
            setPrice('');
            setCategory('');
            setNewCategory('');
        } catch (error) {
            console.error('Failed to save the item:', error);
        }
    };
    
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formItemName">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter item name"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formItemPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formItemCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNewCategory">
                <Form.Label>Or Create New Category</Form.Label>
                <Form.Control
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
                {currentItem ? 'Update Item' : 'Add Item'}
            </Button>
        </Form>
    );
};

export default MenuItemForm;
