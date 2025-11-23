export interface SearchOptions {
  startYear: number;
  endYear: number;
  maxDownloads: number;
  collections: string;
  missingSubject: boolean;
  missingCreator: boolean;
  missingLanguage: boolean;
  isShort: boolean;
  query: string;
}

export interface ArchiveItem {
  identifier: string;
  title: string;
  year?: string;
  creator?: string | string[];
  language?: string;
  downloads?: number;
  pages?: number;
  collection?: string | string[];
  publicdate?: string;
  subject?: string | string[];
  lostnessIndex?: number;
}

export interface ArchiveAPIResponse {
  response: {
    numFound: number;
    start: number;
    docs: ArchiveItem[];
  };
}

export interface SortConfig {
  key: keyof ArchiveItem | null;
  direction: 'ascending' | 'descending';
}