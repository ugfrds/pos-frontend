import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { 
  Card, 
  Row, 
  Col, 
  Button,
  ButtonGroup,
  Spinner,
  Alert
} from 'react-bootstrap';
import {
  BsGraphUpArrow as BsGraphUp,
  BsBarChart,
  BsArrowClockwise
} from 'react-icons/bs';
import { getSalesOverTime } from '../api';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
// If you still want the chart to optionally override the main period (say for deeper drilldowns),
// you can make the prop optional:

// const SalesChart = ({ period: externalPeriod, onGrowthCalculated }) => {
//   const [internalPeriod, setInternalPeriod] = useState(externalPeriod || 'daily');
//   const period = externalPeriod ?? internalPeriod;
//   ...
// }


// Then if the parent passes a period, it takes control — otherwise, the chart manages its own buttons.
const SalesChart = ({ onGrowthCalculated }) => {
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [chartType, setChartType] = useState('bar');

  const fetchSalesData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const salesData = await getSalesOverTime(period);

      const labels = salesData.map(item => {
        if (period === 'daily') {
          return new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else if (period === 'monthly') {
          return `Week ${item.week ?? '?'}`;
        } else {
          return new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
      });

      const data = salesData.map(item => item.totalSales);
      const growth = data.length > 1 
        ? ((data[data.length - 1] - data[data.length - 2]) / data[data.length - 2]) * 100 
        : 0;

      if (onGrowthCalculated) onGrowthCalculated(growth);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Sales',
            data,
            backgroundColor: 'rgba(74,144,226,0.3)',
            borderColor: 'rgba(74,144,226,1)',
            fill: true,
            borderWidth: 2,
            tension: 0.3
          }
        ]
      });
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError('Failed to load sales data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [period]);

  const ChartComponent = chartType === 'bar' ? Bar : Line;

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <Row className="mb-3 align-items-center justify-content-between">
          <Col md="auto">
            <h5 className="mb-0 d-flex align-items-center">
              {chartType === 'bar' ? <BsBarChart className="me-2" /> : <BsGraphUp className="me-2" />}
              Sales Over Time
            </h5>
          </Col>
          <Col md="auto">
            <ButtonGroup size="sm">
              <Button
                variant={chartType === 'bar' ? 'primary' : 'outline-primary'}
                onClick={() => setChartType('bar')}
              >
                Bar
              </Button>
              <Button
                variant={chartType === 'line' ? 'primary' : 'outline-primary'}
                onClick={() => setChartType('line')}
              >
                Curve
              </Button>
            </ButtonGroup>
          </Col>
        </Row>

        <div className="mb-3 text-center">
          <ButtonGroup size="sm">
            {['daily', 'monthly', 'annual'].map((p) => (
              <Button
                key={p}
                variant={period === p ? 'primary' : 'outline-primary'}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <div style={{ height: '300px' }}>
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
              <Button size="sm" variant="outline-danger" className="ms-2" onClick={fetchSalesData}>
                <BsArrowClockwise /> Retry
              </Button>
            </Alert>
          ) : (
            <ChartComponent
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true },
                  x: { grid: { display: false } }
                }
              }}
            />
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SalesChart;
