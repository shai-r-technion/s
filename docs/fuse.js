import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.js';
import indexJson from './fuseIndex.js';
import { searchList } from './search.js';
export function createFuse() {
    const index = Fuse.parseIndex(indexJson);
    const fuseOptions = {
        includeMatches: true,
        minMatchCharLength: 2,
        keys: ['number', 'name', 'syllabus'],
    };
    globalThis.list = searchList;
    return new Fuse(searchList, fuseOptions, index);
}
