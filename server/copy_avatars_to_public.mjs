import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'uploads/avatars');
const destDir = path.join(__dirname, '../public/uploads/avatars');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${file} -> public/uploads/avatars/${file}`);
}
console.log('✅ All uploaded avatars successfully mirrored to public/uploads/avatars!');
