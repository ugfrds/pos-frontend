import React, { useState , useContext } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { FormatCurrency } from '../../utils/index';
import { UserBusinessContext } from '../../context/UserBusinessContext';

const MenuItemManager = ({ menuItems, onEditItem, onDeleteItem }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { business } = useContext(UserBusinessContext);
    const currency = business.settings.currency;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(menuItems.length / itemsPerPage);

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr> 
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(item => (
                        <tr key={item.id}>
                        
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{FormatCurrency(item.price, currency)}</td>
                            <td>
                                <Button variant="warning" onClick={() => onEditItem(item)} className="me-2">
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => onDeleteItem(item.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center">
                {[...Array(totalPages).keys()].map(pageNumber => (
                    <Pagination.Item
                        key={pageNumber + 1}
                        active={pageNumber + 1 === currentPage}
                        onClick={() => handlePageChange(pageNumber + 1)}
                    >
                        {pageNumber + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </>
    );
};

export default MenuItemManager;