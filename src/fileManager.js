import fs from 'fs/promises';
import path from 'path';
import { logEvent } from './eventLogger.js';

const FILES_DIR = path.join(process.cwd(), 'src', 'files');

// ---------- CREATE ----------
export async function createFile(filename, content) {
  const filePath = path.join(FILES_DIR, filename);
  await fs.writeFile(filePath, content);
  logEvent('FILE_CREATED', filename);
  console.log(`File created: ${filename}`);
}

// ---------- READ ----------
export async function readFile(filename) {
  const filePath = path.join(FILES_DIR, filename);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    logEvent('FILE_READ', filename);
    console.log(`Content of ${filename}:`, content);
    return content;
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`File not found: ${filename}`);
    } else {
      console.log(`Error reading ${filename}:`, err.message);
    }
    return null;
  }
}

// ---------- DELETE ----------
export async function deleteFile(filename) {
  const filePath = path.join(FILES_DIR, filename);
  try {
    await fs.unlink(filePath);
    logEvent('FILE_DELETED', filename);
    console.log(`File deleted: ${filename}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Cannot delete — file not found: ${filename}`);
    } else {
      console.log(`Error deleting ${filename}:`, err.message);
    }
  }
}

// ---------- LIST (bonus helper) ----------
export async function listFiles() {
  try {
    const files = await fs.readdir(FILES_DIR);
    console.log('Files currently stored:', files);
    return files;
  } catch (err) {
    console.log('Error listing files:', err.message);
    return [];
  }
}