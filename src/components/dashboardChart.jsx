
import { Line } from 'react-chartjs-2';

const SalesOverTimeChart = ({ data }) => {
    const chartData = {
        labels: data.map(entry => entry.date), 
        datasets: [{
            label: 'Sales',
            data: data.map(entry => entry.totalSales),
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
        }],
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
            },
        },
    };

    return (
        <Line data={chartData} options={chartOptions} />
    );
};

 export default SalesOverTimeChart;

