import React, { createContext, useContext, useRef, useCallback } from 'react';

const SyncContext = createContext();

/**
 * Context for managing sync event handlers
 * Components can register handlers for specific sync events
 */
export const SyncContextProvider = ({ children }) => {
  const handlersRef = useRef({});

  const registerHandler = useCallback((eventType, handler) => {
    if (!handlersRef.current[eventType]) {
      handlersRef.current[eventType] = [];
    }
    handlersRef.current[eventType].push(handler);

    // Return unsubscribe function
    return () => {
      handlersRef.current[eventType] = handlersRef.current[eventType].filter(
        h => h !== handler
      );
    };
  }, []);

  const triggerHandlers = useCallback((eventType, data) => {
    const handlers = handlersRef.current[eventType] || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in sync handler for ${eventType}:`, error);
      }
    });
  }, []);

  return (
    <SyncContext.Provider value={{ registerHandler, triggerHandlers }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within SyncContextProvider');
  }
  return context;
};

