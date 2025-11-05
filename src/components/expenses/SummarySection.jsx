import React from 'react';

const SummarySection = ({ totalExpenditures, topVendors }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Expenditures</h5>
            <p className="card-text">${totalExpenditures.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Top Vendors</h5>
            <ul className="list-group">
              {topVendors.map((vendor, index) => (
                <li key={index} className="list-group-item">{vendor}: ${Math.random() * 1000}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Category Breakdown</h5>
            <div style="height: 150px; background-color: #f8f9fa;">Chart Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
