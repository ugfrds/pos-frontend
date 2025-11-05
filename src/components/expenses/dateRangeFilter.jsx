import React from 'react';

const DateRangeFilter = ({ onDateChange, onSearchChange }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-3">
        <input type="date" className="form-control" onChange={(e) => onDateChange({ ...dateRange, start: e.target.value })} placeholder="Start Date" />
      </div>
      <div className="col-md-3">
        <input type="date" className="form-control" onChange={(e) => onDateChange({ ...dateRange, end: e.target.value })} placeholder="End Date" />
      </div>
      <div className="col-md-6">
        <input type="text" className="form-control" onChange={(e) => onSearchChange(e.target.value)} placeholder="Search Expenditures" />
      </div>
    </div>
  );
};

export default DateRangeFilter;
