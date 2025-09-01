import React from 'react';

// Simplified Interactive Context (no fancy features)
interface InteractiveContextType {
  // Removed all fancy interactive features
}

// Basic provider for future extensibility
const InteractiveContext = React.createContext<InteractiveContextType | null>(null);

// Simplified Interactive Provider Component
interface InteractiveProviderProps {
  children: React.ReactNode;
  currentPage?: string;
}

export const InteractiveProvider: React.FC<InteractiveProviderProps> = ({ 
  children, 
  currentPage = '/' 
}) => {
  // Basic provider with no fancy features
  const contextValue: InteractiveContextType = {
    // No fancy interactive features
  };

  return (
    <InteractiveContext.Provider value={contextValue}>
      {children}
    </InteractiveContext.Provider>
  );
};

// Removed all fancy components - QuickAccessToolbar, FloatingActionMenu, etc.

export default {
  InteractiveProvider
};