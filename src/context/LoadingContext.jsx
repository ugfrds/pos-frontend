import React, { createContext, useCallback, useState } from 'react';

export const LoadingContext = createContext({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const startLoading = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  const value = {
    isLoading: count > 0,
    startLoading,
    stopLoading,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;
