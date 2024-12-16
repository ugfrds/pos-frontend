import React, { useEffect, useState } from 'react';
import { Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const CACHE_KEY = 'currencies';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const CurrencySetting = ({ currency, onCurrencyChange }) => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrencies = async () => {
            const cachedData = localStorage.getItem(CACHE_KEY);
            const cacheTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);
            const currentTime = new Date().getTime();

            if (cachedData && cacheTimestamp && (currentTime - cacheTimestamp < CACHE_EXPIRY)) {
                // Use cached data if it is not expired
                setCurrencies(JSON.parse(cachedData));
                setLoading(false);
            } else {
                // Fetch from API if no cache or cache is expired
                try {
                    const response = await axios.get('https://openexchangerates.org/api/currencies.json', {
                        params: {
                            app_id: 'YOUR_APP_ID', // Replace with your Open Exchange Rates API key
                        },
                    });
                    const data = response.data;
                    setCurrencies(data);
                    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                    localStorage.setItem(`${CACHE_KEY}_timestamp`, currentTime.toString());
                    setLoading(false);
                } catch (error) {
                    setError('Failed to fetch currencies.');
                    setLoading(false);
                }
            }
        };

        fetchCurrencies();
    }, []);

    if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Form.Group>
            <Form.Label className='fw-bold'>Currency</Form.Label>
            <Form.Control as="select" value={currency} onChange={(e) => onCurrencyChange(e.target.value)}>
                {Object.keys(currencies).map((currencyCode) => (
                    <option key={currencyCode} value={currencyCode}>
                        {currencyCode} - {currencies[currencyCode]}
                    </option>
                ))}
            </Form.Control>
        </Form.Group>
    );
};

export default CurrencySetting;
