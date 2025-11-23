
import React, { useState } from 'react';
import type { SearchOptions } from '../types';

interface SearchFormProps {
  onSearch: (options: SearchOptions) => void;
  onExport: () => void;
  isSearching: boolean;
  hasResults: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onExport, isSearching, hasResults }) => {
  const [options, setOptions] = useState<SearchOptions>({
    startYear: 1800,
    endYear: 1920,
    maxDownloads: 50,
    collections: 'americana',
    missingSubject: true,
    missingCreator: true,
    missingLanguage: false,
    isShort: true,
    query: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : parseInt(value, 10)) : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(options);
  };
  
  const handleSerendipity = () => {
    const randomStartYear = Math.floor(Math.random() * (1950 - 1700 + 1)) + 1700;
    const randomOptions: SearchOptions = {
        startYear: randomStartYear,
        endYear: randomStartYear + (Math.floor(Math.random() * 50) + 10),
        maxDownloads: Math.floor(Math.random() * 100) + 5,
        collections: ['americana', 'toronto', 'gutenberg', 'biodiversity'][Math.floor(Math.random() * 4)],
        missingSubject: Math.random() > 0.3,
        missingCreator: Math.random() > 0.4,
        missingLanguage: Math.random() > 0.8,
        isShort: Math.random() > 0.5,
        query: ['pamphlet', 'report', 'letter', 'journal', 'treatise'][Math.floor(Math.random() * 5)]
    };
    setOptions(randomOptions);
    onSearch(randomOptions);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Year Range */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year Range</label>
            <div className="flex items-center space-x-2 mt-1">
              <input type="number" name="startYear" value={options.startYear} onChange={handleChange} className="w-full form-input" placeholder="e.g. 1800"/>
              <span className="text-gray-500 dark:text-gray-400">-</span>
              <input type="number" name="endYear" value={options.endYear} onChange={handleChange} className="w-full form-input" placeholder="e.g. 1920"/>
            </div>
          </div>

          {/* Max Downloads */}
          <div>
            <label htmlFor="maxDownloads" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Downloads</label>
            <input type="number" name="maxDownloads" id="maxDownloads" value={options.maxDownloads} onChange={handleChange} className="mt-1 w-full form-input"/>
          </div>

          {/* Collections */}
          <div>
            <label htmlFor="collections" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Collections (comma-separated)</label>
            <input type="text" name="collections" id="collections" value={options.collections} onChange={handleChange} className="mt-1 w-full form-input" placeholder="e.g. americana, toronto"/>
          </div>

          {/* Free Text Query */}
          <div className="md:col-span-2 lg:col-span-4">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Optional Query</label>
            <input type="text" name="query" id="query" value={options.query} onChange={handleChange} className="mt-1 w-full form-input" placeholder="e.g. pamphlet OR report"/>
          </div>

          {/* Options */}
          <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metadata Anomalies</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['missingSubject', 'missingCreator', 'missingLanguage', 'isShort'].map((key, i) => (
                <div key={key} className="flex items-center">
                  <input id={key} name={key} type="checkbox" checked={options[key as keyof typeof options] as boolean} onChange={handleChange} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"/>
                  <label htmlFor={key} className="ml-2 block text-sm text-gray-900 dark:text-gray-200 capitalize">
                    {key === 'isShort' ? 'Short Docs (≤30 pgs)' : key.replace(/([A-Z])/g, ' $1')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button type="button" onClick={handleSerendipity} disabled={isSearching} className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-primary-900/50 dark:text-primary-200 dark:hover:bg-primary-900">
                Serendipity Search
            </button>
            <button type="button" onClick={onExport} disabled={!hasResults || isSearching} className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                Export CSV
            </button>
            <button type="submit" disabled={isSearching} className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
              {isSearching ? 'Searching...' : 'Search Archive.org'}
            </button>
        </div>
      </form>
      <style>{`
        .form-input {
          @apply block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500;
        }
      `}</style>
    </div>
  );
};
