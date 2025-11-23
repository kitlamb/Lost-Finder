
import React from 'react';

interface SortIconProps {
  direction: 'ascending' | 'descending' | 'none';
}

export const SortIcon: React.FC<SortIconProps> = ({ direction }) => {
  if (direction === 'ascending') {
    return (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zM5.47 6.53a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0l3 3a.75.75 0 11-1.06 1.06L10 4.06 6.53 7.59a.75.75 0 01-1.06 0z" clipRule="evenodd" />
      </svg>
    );
  }
  if (direction === 'descending') {
    return (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.75a.75.75 0 011.5 0v10.5A.75.75 0 0110 17zM14.53 13.47a.75.75 0 010 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V5.75a.75.75 0 011.5 0v9.44l1.72-1.72a.75.75 0 011.06 0z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zM5.47 6.53a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0l3 3a.75.75 0 11-1.06 1.06L10 4.06 6.53 7.59a.75.75 0 01-1.06 0z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.75a.75.75 0 011.5 0v10.5A.75.75 0 0110 17zM14.53 13.47a.75.75 0 010 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V5.75a.75.75 0 011.5 0v9.44l1.72-1.72a.75.75 0 011.06 0z" clipRule="evenodd" />
    </svg>
  );
};
