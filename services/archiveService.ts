import type { SearchOptions, ArchiveAPIResponse } from '../types';

const API_BASE_URL = 'https://archive.org/advancedsearch.php';

export async function searchArchive(options: SearchOptions): Promise<ArchiveAPIResponse> {
  const queryParts: string[] = [];

  if (options.startYear && options.endYear) {
    queryParts.push(`year:[${options.startYear} TO ${options.endYear}]`);
  }

  queryParts.push(`downloads:[0 TO ${options.maxDownloads || 5000}]`);

  if (options.collections) {
    const collectionsList = options.collections
      .split(',')
      .map(c => c.trim())
      .filter(c => c)
      .map(c => `"${c}"`)
      .join(' OR ');
    if (collectionsList) {
      queryParts.push(`collection:(${collectionsList})`);
    }
  }

  if (options.missingSubject) queryParts.push('-subject:*');
  if (options.missingCreator) queryParts.push('-creator:*');
  if (options.missingLanguage) queryParts.push('-language:*');
  if (options.isShort) queryParts.push('pages:[1 TO 30]');
  if (options.query) queryParts.push(`(${options.query})`);
  
  queryParts.push('mediatype:(texts)');

  const q = queryParts.join(' AND ');

  const fields = ['identifier', 'title', 'year', 'creator', 'language', 'downloads', 'pages', 'collection', 'publicdate', 'subject'];
  const params = new URLSearchParams({
    q: q,
    output: 'json',
    rows: '100', // Fetch up to 100 results
    page: '1',
  });
  fields.forEach(field => params.append('fl[]', field));

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}