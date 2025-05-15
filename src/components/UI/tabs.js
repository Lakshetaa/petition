import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const TabsContext = createContext(undefined);

export const Tabs = ({ defaultValue, children, className = '' }) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const TabsTrigger = ({ value, children, className = '' }) => {
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

TabsTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const TabsContent = ({ value, children, className = '' }) => {
  const tabs = useTabsContext();
  
  if (tabs.selectedTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
};

TabsContent.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
}