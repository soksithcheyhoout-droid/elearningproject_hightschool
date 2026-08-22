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

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  for (const f of files) {
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
    console.log(`Copied ${f} -> public/uploads/avatars/${f}`);
  }
}
console.log('✅ All uploaded avatar images copied to public/uploads/avatars/');
