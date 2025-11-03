import React, { createContext, useContext, useState, useEffect } from 'react';
import childrenService from '@/services/api/childrenService';

const ChildContext = createContext();

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};

export const ChildProvider = ({ children }) => {
  const [activeChild, setActiveChild] = useState(null);
  const [allChildren, setAllChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const children = await childrenService.getAll();
      setAllChildren(children);
      
      // Set first child as active if none selected
      if (children.length > 0 && !activeChild) {
        setActiveChild(children[0]);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchChild = (child) => {
    setActiveChild(child);
  };

  const refreshChildren = async () => {
    await loadChildren();
  };

  useEffect(() => {
    loadChildren();
  }, []);

  return (
    <ChildContext.Provider 
      value={{
        activeChild,
        allChildren,
        loading,
        switchChild,
        refreshChildren
      }}
    >
      {children}
    </ChildContext.Provider>
  );
};