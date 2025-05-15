import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs = ({ defaultValue, children, className = '' }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList = ({ children, className = '' }: TabsListProps) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger = ({ value, children, className = '' }: TabsTriggerProps) => {
  const tabs = useTabsContext();
  const isSelected = tabs.selectedTab === value;

  return (
    <button
      className={`px-6 py-4 text-sm font-medium ${
        isSelected
          ? 'border-b-2 border-teal-600 text-teal-600'
          : 'text-gray-500 hover:text-gray-700'
      } ${className}`}
      onClick={() => tabs.setSelectedTab(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent = ({ value, children, className = '' }: TabsContentProps) => {
  const tabs = useTabsContext();
  
  if (tabs.selectedTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
};

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
}