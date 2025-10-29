import React, { useContext } from 'react';
import { LoadingContext } from '../context/LoadingContext';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const GlobalLoader = () => {
  const { isLoading } = useContext(LoadingContext);

  if (!isLoading) return null;

  return (
    <div style={overlayStyle}>
      <div className="text-center text-white">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
