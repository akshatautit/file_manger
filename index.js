import { createFile, readFile, deleteFile, listFiles } from './src/fileManager.js';
import { getSystemInfo } from './src/systemInfo.js';
import { parseURL } from './src/urlParser.js';

// 1. Show system info
getSystemInfo();

// 2. File operations
await createFile('test.txt', 'hello akshata');
await listFiles();
await readFile('test.txt');
await deleteFile('test.txt');
await listFiles(); // confirm it's gone

// 3. URL parsing
parseURL('https://paypoint.com/search?name=akshata&city=mumbai');