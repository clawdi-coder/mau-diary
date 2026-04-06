import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../assets');
const targetDir = path.join(__dirname, '../public/assets');

// Remove symlink or existing directory if it exists
try {
  const stat = fs.lstatSync(targetDir);
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(targetDir);
  } else if (stat.isDirectory()) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
} catch (e) {
  // Ignore error if it doesn't exist
}

// Copy source to target if assets folder exists
if (fs.existsSync(sourceDir)) {
  console.log(`Copying assets from ${sourceDir} to ${targetDir}...`);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log('Assets copied successfully.');
} else {
  console.log('No assets directory found, skipping asset copy.');
}
