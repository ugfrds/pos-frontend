import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { getDebtorsOverview } from "../../../api";

const DebtorsSidebar = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const data = await getDebtorsOverview();
        setOverview(data);
      } catch (err) {
        setError("Failed to fetch debtors overview.");
        console.error("Error fetching debtors overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <Card className="h-100 p-3 d-flex align-items-center justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-100 p-3">
        <Alert variant="danger">{error}</Alert>
      </Card>
    );
  }

  // Check if overview data is empty or all values are zero/null
  const hasData = overview && 
                  (overview.totalUnpaid > 0 || 
                   overview.totalOverdue > 0 || 
                   overview.numberOfDebtors > 0);

  return (
    <Card className="h-100 p-3">
      <Card.Body>
        <Card.Title>Debtors Summary</Card.Title>
        <Card.Text>
          {hasData ? (
            <>
              <p><strong>Total Unpaid:</strong> ${overview.totalUnpaid?.toFixed(2) || '0.00'}</p>
              <p><strong>Total Overdue:</strong> ${overview.totalOverdue?.toFixed(2) || '0.00'}</p>
              <p><strong>Number of Debtors:</strong> {overview.numberOfDebtors}</p>
            </>
          ) : (
            <p>No debtors data available for the selected period.</p>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DebtorsSidebar;
