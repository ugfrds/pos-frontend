// SalesChart.js
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getSalesOverTime } from '../api';

Chart.register(...registerables);

const SalesChart = () => {
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const period = 'daily';

    const fetchSalesData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const salesData = await getSalesOverTime(period);
            const labels = salesData.map(item => item.date);
            const data = salesData.map(item => item.totalSales);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Sales Over Time',
                        data,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }
                ]
            });
        } catch (err) {
            console.error('Error fetching sales data:', err);
            setError('Failed to load sales data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesData();

        // Set up interval to fetch data every 60 minutes (3600000 milliseconds)
        const intervalId = setInterval(fetchSalesData, 300000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ height: '300px' }}>
            {isLoading ? (
                <p>Loading sales data...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <Line data={chartData} />
            )}
        </div>
    );
};

export default SalesChart;
