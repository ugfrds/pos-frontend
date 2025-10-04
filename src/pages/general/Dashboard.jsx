// src/pages/Dashboard.js

import Header from '../../components/Dashboard/Header';
import Sidebar from '../../components/Dashboard/Sidebar';
import NavBar from '../../components/Dashboard/Navbar';
import Footer from '../../components/Footer';
import MenuPage from './MenuPage';

const Dashboard = () => {
   
    return (
        <div>
            <Header  />
            <NavBar /> 
            <div style={styles.container}>
                <Sidebar />
                <main style={styles.mainContent}>
                     <MenuPage />
                     <div className="mt-auto bg-dark text-white py-3 text-center">
                       <Footer />
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

export default Dashboard;
