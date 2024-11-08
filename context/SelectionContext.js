// File: context/SelectionContext.js
import { createContext, useContext, useState } from 'react';

const SelectionContext = createContext();

export function SelectionProvider({ children }) {
  const [selections, setSelections] = useState({
    coreFeatures: {},
    industryApplications: {},
    businessAreas: {},
    advancedTopics: {}
  });

  const toggleSelection = (category, item) => {
    setSelections(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category]?.[item]
      }
    }));
  };

  const exportToCSV = () => {
    const selectedItems = {
      'Core Features': Object.entries(selections.coreFeatures)
        .filter(([_, selected]) => selected)
        .map(([feature]) => feature),
      'Industry Applications': Object.entries(selections.industryApplications)
        .filter(([_, selected]) => selected)
        .map(([app]) => app),
      'Business Areas': Object.entries(selections.businessAreas)
        .filter(([_, selected]) => selected)
        .map(([area]) => area),
      'Advanced Topics': Object.entries(selections.advancedTopics)
        .filter(([_, selected]) => selected)
        .map(([topic]) => topic)
    };

    const csvContent = [
      ['Category', 'Selected Items'],
      ...Object.entries(selectedItems).flatMap(([category, items]) =>
        items.map(item => [category, item])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'selected_features.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SelectionContext.Provider value={{ selections, toggleSelection, exportToCSV }}>
      {children}
    </SelectionContext.Provider>
  );
}

export const useSelection = () => useContext(SelectionContext);