import { useState, useEffect, useMemo } from 'react';
import SearchBar from '../../components/Dashboard/Searchbar';
import MenuCategory from '../../components/Dashboard/MenuCategory';
import MenuItemList from '../../components/menumanager/MenuitemList';
import '../../components/styles/MenuPage.css';
import { fetchMenuItems } from '../../api'; // Import the API call from the centralized API file
import { getCachedData } from '../../utils/Cache';

const MenuPage = () => {
    const itemsPerPage = 8;
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);   
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To manage error state


    // Fetch menu items from the backend or cache
    useEffect(() => {
        const getMenuItems = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCachedData('menuItems', fetchMenuItems); // Fetch menu items using cache
                setMenuItems(data);
                console.log("Fetched menu items:", data); // Debug log
            } catch (error) {
                setError('Failed to fetch menu items');
            } finally {
                setLoading(false);
            }
        };

        getMenuItems();
    }, []);

    const popularItems = useMemo(() => {
        const filtered = menuItems.filter(item => item.is_popular);
        console.log("Popular items:", filtered); // Debug log
        return filtered;
    }, [menuItems]);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
        return popularItems.length > 0 ? ['Popular', ...uniqueCategories] : uniqueCategories;
    }, [menuItems, popularItems]);

    // Filtered items based on category and search term
    const filteredItems = useMemo(() => {
        let filtered = menuItems;

        if (selectedCategory === 'Popular') {
            filtered = popularItems;
        } else if (selectedCategory) {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return filtered;
    }, [selectedCategory, searchTerm, menuItems]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // Slice items for the current page
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, filteredItems, itemsPerPage]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSearchTerm(''); // Clear search term when a category is selected
        setCurrentPage(1); // Reset to the first page
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        setCurrentPage(1); // Reset to the first page
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSelectedCategory(null);
        setCurrentPage(1); // Reset to the first page
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div style={styles.container}>
                <main style={styles.mainContent}>
                    <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
                    <MenuCategory
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />
                    <MenuItemList menuItems={currentItems} />

                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                        <button
                            className="pagination-button"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages).keys()].map(pageNumber => (
                            <button
                                key={pageNumber}
                                className={`pagination-button ${pageNumber + 1 === currentPage ? 'active' : ''}`}
                                onClick={() => handlePageChange(pageNumber + 1)}
                            >
                                {pageNumber + 1}
                            </button>
                        ))}
                        <button
                            className="pagination-button"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
    },
    mainContent: {
        flex: 1,
        padding: '20px',
    },
};

export default MenuPage;
