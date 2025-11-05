import { useState, useEffect } from 'react';
import { Form, Container, Row, Col} from 'react-bootstrap';
import MenuItemForm from '../../components/menumanager/MenuItemForm';
import MenuItemManager from '../../components/menumanager/MenuItemManager';
import { fetchMenuItems, updateMenuItem, createMenuItem, deleteMenuItem } from '../../api';
import Notification from '../../components/Notification';  

const MenuManagementPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ message: '', variant: '' });

    useEffect(() => {
        getMenuItems();
    }, []);

    const getMenuItems = async () => {
        try {
            const items = await fetchMenuItems();
            setMenuItems(items);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching MenuItems:', error);
            setError('Failed to load menu items.');
            setLoading(false);
        }
    };


    
    const handleAddOrUpdateItem = (newItem) => {
        if (currentItem) {
            // Update existing item
            updateMenuItem(newItem.id, newItem)
                .then(response => {
                    // Map through menuItems and replace the updated item
                    setMenuItems(menuItems.map(item => 
                        item.id === response.id ? response : item
                    ));
                    setCurrentItem(null); // Reset current item after update
                    setNotification({ message: `${newItem.name} updated successfully.`, variant: 'success' });
                })
                .catch(error => {
                    console.error('Error updating item:', error);
                });
        } else {
            // Add new item
            createMenuItem(newItem)
                .then(response => {
                    setMenuItems([...menuItems, response]); // Append the new item
                    setNotification({ message: `${newItem.name} added successfully.`, variant: 'success' });
                })
                
                .catch(error => {
                    console.error('Error adding item:', error);
                    setError(`Failed to create menuitem.`);
                    setNotification({ message: `${Object.values(error)} `, variant: 'danger' });
                });               
        }
    };
    
    const handleEditItem = (item) => {
        setCurrentItem(item);
    };

    const handleDeleteItem = (id) => {
        deleteMenuItem(id)
            .then(() => {
                setMenuItems(menuItems.filter(item => item.id !== id));
                setNotification({ message: `Deleted successfully.`, variant: 'danger' });
                
            })
            .catch(error => {
                console.error('Error deleting item:', error);
            });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMenuItems = Array.isArray(menuItems) ? menuItems.filter(item =>
        item && item.name && item.category && (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) : [];

    return (
        <Container>
            <Row className="mb-4">
                <Col xs="auto">
                    <h1 className="main-heading">Manage Menu</h1>
                </Col>
            </Row>
            {loading && <p>Loading menu items...</p>}
            {error && <p className="text-danger">{error}</p>}
            <Notification
                message={notification.message}
                variant={notification.variant}
                onClose={() => setNotification({ message: '', variant: '' })}
            />
            
            <Row>
                <Col md={4}>
                    <h2 className="sub-heading mb-3">Add/Edit Item</h2>
                    <MenuItemForm
                        currentItem={currentItem}
                        onAddOrUpdateItem={handleAddOrUpdateItem}
                        menuItems={menuItems}
                    />
                </Col>
                <Col md={8}>
                    <h2 className="display-5 font-weight-semibold mb-3">Menu Items</h2>
                    <Form.Control
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mb-3"
                    />
                    {filteredMenuItems.length > 0 ? (
                        <MenuItemManager
                            menuItems={filteredMenuItems}
                            onEditItem={handleEditItem}
                            onDeleteItem={handleDeleteItem}
                        />
                    ) : (
                        <p>No menu items found. You can add a new menu item using the form on the left.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default MenuManagementPage;
