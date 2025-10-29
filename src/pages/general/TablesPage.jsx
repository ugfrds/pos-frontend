import { useContext } from 'react';
import TableCard from '../../components/menumanager/TableCard';
import NavBar from '../../components/Dashboard/Navbar';
import Footer from '../../components/Footer';
import { OrderContext } from '../../context/OrderContext'; 

const TablesPage = () => {
    // Access the active orders from the context
    const { activeOrders } = useContext(OrderContext);
    
    // List of tables   
    const tables = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        name: `Table ${index + 1}`,
    }));

    // Merge tables with active orders to provide each TableCard with the correct number of active orders
    const tablesWithOrders = tables.map(table => {
        const order = activeOrders.find(order => Number(order.tableNumber) === table.id);
        
        return {
            ...table,
            activeOrderCount: order ? order.activeOrderCount : 0,
        };
    });
    
    
    

    // Sort tables so that those with no active orders are displayed first
    const sortedTables = tablesWithOrders.sort((a, b) => a.activeOrderCount - b.activeOrderCount);

    return (
        <div style={styles.pageContainer}>
            <NavBar />
            <div className="d-flex flex-column min-vh-100">
                <div className="container my-4">
                    <div className="row">
                        {sortedTables.map(table => (
                            <div key={table.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <TableCard 
                                    tableName={table.name}
                                    tableNumber={table.id}
                                    activeOrders={table.activeOrderCount} 
                                />
                                
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto bg-dark text-white py-3 text-center">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        backgroundColor: '#f1f3f5', // Slightly off-white background for the page
        padding: '20px',
        minHeight: '100vh',
    }
};

export default TablesPage;
