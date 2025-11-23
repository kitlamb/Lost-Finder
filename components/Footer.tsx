
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Please respect API rate limits. Data provided by{' '}
          <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
            Internet Archive
          </a>
          .
        </p>
        <p className="mt-1">
          Cite original collections and respect copyright.
        </p>
      </div>
    </footer>
  );
};
