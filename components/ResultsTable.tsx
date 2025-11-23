import React from 'react';
import type { ArchiveItem, SortConfig } from '../types';
import { SortIcon } from './icons/SortIcon';

interface ResultsTableProps {
  items: ArchiveItem[];
  isLoading: boolean;
  searched: boolean;
  sortConfig: SortConfig;
  onSort: (key: keyof ArchiveItem) => void;
}

const TableHeader: React.FC<{
  columnKey: keyof ArchiveItem;
  title: string;
  sortConfig: SortConfig;
  onSort: (key: keyof ArchiveItem) => void;
  className?: string;
  tooltip?: string;
}> = ({ columnKey, title, sortConfig, onSort, className, tooltip }) => {
  const isSorted = sortConfig.key === columnKey;
  return (
    <th
      scope="col"
      className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer ${className}`}
      onClick={() => onSort(columnKey)}
      title={tooltip}
    >
      <div className="group inline-flex items-center">
        {title}
        <span className={`ml-2 flex-none rounded ${isSorted ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-400 invisible group-hover:visible'}`}>
          <SortIcon direction={isSorted ? sortConfig.direction : 'none'} />
        </span>
      </div>
    </th>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ items, isLoading, searched, sortConfig, onSort }) => {
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Searching the archives...</p>
      </div>
    );
  }

  if (searched && items.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Ghosts Found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search criteria to uncover more hidden items.</p>
      </div>
    );
  }

  if (!searched) {
     return (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Begin Your Exploration</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Use the form above to search for neglected items in the Internet Archive.</p>
        </div>
     );
  }

  const maxDownloads = Math.max(...items.map(item => item.downloads || 0), 1);

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Title</th>
                  <TableHeader columnKey="year" title="Year" sortConfig={sortConfig} onSort={onSort} />
                  <TableHeader columnKey="publicdate" title="Uploaded" sortConfig={sortConfig} onSort={onSort} />
                   <TableHeader 
                    columnKey="lostnessIndex" 
                    title="Lostness Index" 
                    sortConfig={sortConfig} 
                    onSort={onSort} 
                    tooltip="Score based on missing metadata and low downloads. Higher is 'more lost'."
                  />
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Creator</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Language</th>
                  <TableHeader columnKey="downloads" title="Downloads" sortConfig={sortConfig} onSort={onSort} />
                  <TableHeader columnKey="pages" title="Pages" sortConfig={sortConfig} onSort={onSort} />
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Collection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800/50">
                {items.map((item) => (
                  <tr key={item.identifier}>
                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:w-auto sm:max-w-xs sm:pl-6">
                      <a href={`https://archive.org/details/${item.identifier}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 truncate block hover:underline">
                        {item.title || 'No Title'}
                      </a>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.year || 'N/A'}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.publicdate ? item.publicdate.split('T')[0] : 'N/A'}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono text-center">{item.lostnessIndex?.toFixed(0) ?? 'N/A'}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{Array.isArray(item.creator) ? item.creator.join(', ') : item.creator || 'N/A'}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{item.language || 'N/A'}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                         <span>{item.downloads ?? 0}</span>
                         <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div className="bg-primary-400 h-2 rounded-full" style={{ width: `${((item.downloads || 0) / maxDownloads) * 100}%` }}></div>
                         </div>
                       </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.pages || 'N/A'}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{Array.isArray(item.collection) ? item.collection.join(', ') : item.collection || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};