// SalesChart.js
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { 
  Card, 
  Form, 
  Row, 
  Col, 
  Alert, 
  Spinner,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import {
  BsArrowClockwise as BsRefresh,
  BsGraphUpArrow as BsTrendingUp,
  BsCalendar,
  BsDownload,
  BsCashCoin,
  BsGraphUpArrow as BsGraphUp,
  BsLightningCharge
} from 'react-icons/bs';import { getSalesOverTime } from '../api';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = () => {
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [refreshCount, setRefreshCount] = useState(0);
  const [stats, setStats] = useState({
    totalSales: 0,
    growth: 0,
    averageOrder: 0
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Sales: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const fetchSalesData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const salesData = await getSalesOverTime(period);
      const labels = salesData.map(item => {
        if (period === 'daily') {
          return new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        } else if (period === 'weekly') {
          return `Week ${item.week}`;
        } else {
          return new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          });
        }
      });
      
      const data = salesData.map(item => item.totalSales);

      // Calculate stats
      const total = data.reduce((sum, value) => sum + value, 0);
      const average = data.length > 0 ? total / data.length : 0;
      const growth = data.length > 1 ? 
        ((data[data.length - 1] - data[data.length - 2]) / data[data.length - 2] * 100) : 0;

      setStats({
        totalSales: total,
        growth: growth,
        averageOrder: average
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Sales',
            data,
            fill: true,
            backgroundColor: 'rgba(74, 144, 226, 0.1)',
            borderColor: 'rgba(74, 144, 226, 1)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(74, 144, 226, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: 'rgba(74, 144, 226, 1)',
            pointHoverBorderColor: '#ffffff',
            tension: 0.4
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

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
    fetchSalesData();
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting sales data...');
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  useEffect(() => {
    fetchSalesData();

    // Set up interval to fetch data every 5 minutes
    const intervalId = setInterval(fetchSalesData, 300000);

    return () => clearInterval(intervalId);
  }, [period]);

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white border-0 pb-0">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                <BsTrendingUp size={20} className="text-primary" />
              </div>
              <div>
                <h5 className="mb-1">Sales Overview</h5>
                <p className="text-muted mb-0">Real-time sales performance</p>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <BsRefresh className={`me-1 ${isLoading ? 'spinning' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleExport}
              >
                <BsDownload className="me-1" />
                Export
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        {/* Stats Overview */}
        {!isLoading && !error && (
          <Row className="mb-4">
            <Col md={4}>
              <div className="border rounded p-3 text-center">
                <BsCashCoin size={24} className="text-success mb-2" />
                <h4 className="text-success mb-1">
                  ${stats.totalSales.toLocaleString()}
                </h4>
                <small className="text-muted">Total Sales</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="border rounded p-3 text-center">
                <BsGraphUp size={24} className={
                  stats.growth >= 0 ? "text-success" : "text-danger"
                } />
                <h4 className={
                  stats.growth >= 0 ? "text-success" : "text-danger"
                }>
                  {stats.growth >= 0 ? '+' : ''}{stats.growth.toFixed(1)}%
                </h4>
                <small className="text-muted">Growth Rate</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="border rounded p-3 text-center">
                <BsLightningCharge size={24} className="text-warning mb-2" />
                <h4 className="text-warning mb-1">
                  ${stats.averageOrder.toLocaleString()}
                </h4>
                <small className="text-muted">Average Order</small>
              </div>
            </Col>
          </Row>
        )}

        {/* Period Selector */}
        <div className="mb-3">
          <ButtonGroup size="sm" className="w-100">
            <Button
              variant={period === 'daily' ? 'primary' : 'outline-primary'}
              onClick={() => handlePeriodChange('daily')}
            >
              <BsCalendar className="me-1" />
              Daily
            </Button>
            <Button
              variant={period === 'weekly' ? 'primary' : 'outline-primary'}
              onClick={() => handlePeriodChange('weekly')}
            >
              <BsCalendar className="me-1" />
              Weekly
            </Button>
            <Button
              variant={period === 'monthly' ? 'primary' : 'outline-primary'}
              onClick={() => handlePeriodChange('monthly')}
            >
              <BsCalendar className="me-1" />
              Monthly
            </Button>
          </ButtonGroup>
        </div>

        {/* Chart Area */}
        <div style={{ height: '300px', position: 'relative' }}>
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading sales data...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              <BsCashCoin size={24} className="mb-2" />
              <h6>Unable to Load Data</h6>
              <p className="mb-2">{error}</p>
              <Button variant="outline-danger" size="sm" onClick={fetchSalesData}>
                <BsRefresh className="me-1" />
                Retry
              </Button>
            </Alert>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>

        {/* Last Updated */}
        {!isLoading && !error && (
          <div className="mt-3 text-center">
            <small className="text-muted">
              Last updated: {new Date().toLocaleTimeString()} • 
              Auto-refresh in 5 minutes
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SalesChart;