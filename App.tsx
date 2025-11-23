import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchForm } from './components/SearchForm';
import { ResultsTable } from './components/ResultsTable';
import { searchArchive } from './services/archiveService';
import type { ArchiveItem, SearchOptions, SortConfig } from './types';
import { useDarkMode } from './hooks/useDarkMode';

const calculateLostnessIndex = (item: ArchiveItem): number => {
  let score = 0;
  // Metadata completeness score (higher for more missing fields)
  if (!item.creator || (Array.isArray(item.creator) && item.creator.length === 0)) {
    score += 30;
  }
  if (!item.subject || (Array.isArray(item.subject) && item.subject.length === 0)) {
    score += 25;
  }
  if (!item.language) {
    score += 15;
  }
  // Rarity score (higher for fewer downloads)
  const downloads = item.downloads ?? 0;
  const downloadScore = Math.round(100 / (downloads + 1)); // Inverse relationship
  score += Math.min(30, downloadScore); // Cap download score contribution to 30

  return score;
};


function App() {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [results, setResults] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'lostnessIndex', direction: 'descending' });

  const handleSearch = useCallback(async (options: SearchOptions) => {
    setIsLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await searchArchive(options);
      const docsWithLostness = response.response.docs.map(item => ({
        ...item,
        lostnessIndex: calculateLostnessIndex(item),
      }));
      setResults(docsWithLostness);
    } catch (err) {
      setError('Failed to fetch results. Please check your query and the network connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sortedResults = useMemo(() => {
    let sortableItems = [...results];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof ArchiveItem] ?? 0;
        const bValue = b[sortConfig.key as keyof ArchiveItem] ?? 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [results, sortConfig]);
  
  const handleSort = (key: keyof ArchiveItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    // If sorting by a new column, default to descending for lostnessIndex, ascending for others
    if (sortConfig.key !== key) {
        direction = key === 'lostnessIndex' ? 'descending' : 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const handleExport = useCallback(() => {
    if (sortedResults.length === 0) return;
    const headers = ['Identifier', 'Title', 'Year', 'Date Uploaded', 'Creator', 'Language', 'Downloads', 'Pages', 'Collection', 'Lostness Index'];
    const csvRows = [headers.join(',')];

    for (const item of sortedResults) {
      const formatArray = (value: string | string[] | undefined) => 
        Array.isArray(value) ? value.join('; ') : value;

      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
      };
      
      const escapeCsv = (value: string | number | undefined | null) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const row = [
        escapeCsv(item.identifier),
        escapeCsv(item.title),
        escapeCsv(item.year),
        escapeCsv(formatDate(item.publicdate)),
        escapeCsv(formatArray(item.creator)),
        escapeCsv(item.language),
        escapeCsv(item.downloads),
        escapeCsv(item.pages),
        escapeCsv(formatArray(item.collection)),
        escapeCsv(item.lostnessIndex)
      ].join(',');
      csvRows.push(row);
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'lost-finder-results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [sortedResults]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <SearchForm onSearch={handleSearch} onExport={handleExport} isSearching={isLoading} hasResults={results.length > 0} />
          {error && <div className="mt-6 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}
          <div className="mt-8">
            <ResultsTable 
              items={sortedResults} 
              isLoading={isLoading} 
              searched={searched} 
              sortConfig={sortConfig} 
              onSort={handleSort}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;