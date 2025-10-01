import {LocationStatus, SmartLocation, useSmartLocation} from '@hooks';
import React, {createContext, useContext} from 'react';

interface SmartLocationContextValue {
  location: SmartLocation | null;
  status: LocationStatus;
  refetch: () => void;
}

const SmartLocationContext = createContext<SmartLocationContextValue | null>(
  null,
);

/**
 * Hook to access smart location context.
 * Must be used inside a <SmartLocationProvider>
 */
export const useSmartLocationContext = (): SmartLocationContextValue => {
  const ctx = useContext(SmartLocationContext);
  if (!ctx) {
    throw new Error(
      'useSmartLocationContext must be used within SmartLocationProvider',
    );
  }
  return ctx;
};

interface SmartLocationProviderProps {
  children: React.ReactNode;
  fallbackCity?: string;
  staleTime?: number;
}

/**
 * Shared location context provider.
 * Do not pass onLocationChange here — use `useSmartLocation` directly in screens if needed.
 */
export const SmartLocationProvider: React.FC<SmartLocationProviderProps> = ({
  children,
  staleTime = 60000,
}) => {
  const {location, status, refetch} = useSmartLocation({
    watch: true,
    staleTime,
  });

  return (
    <SmartLocationContext.Provider value={{location, status, refetch}}>
      {children}
    </SmartLocationContext.Provider>
  );
};
