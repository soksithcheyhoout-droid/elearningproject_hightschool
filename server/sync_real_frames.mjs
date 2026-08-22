import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data/elearning.db');

const sqlite = new Database(dbPath);

async function sync() {
  console.log('🔄 Updating SQLite student frames...');
  // Update riki.dev
  sqlite.prepare(`
    UPDATE students 
    SET avatar_frame = '/assets/frames/autumn_crown.webp'
    WHERE username = 'riki.dev' OR email = 'soksithcheyhoout@gmail.com'
  `).run();

  // Update Hout Sok sithchey
  sqlite.prepare(`
    UPDATE students 
    SET avatar_frame = '/assets/frames/11_gyoko_pink.png',
        avatar = '/uploads/avatars/student-pf-1786900313001-208036926.jpg'
    WHERE username = 'hout.sok.sithchey' OR email = 'houtsoksithchey@gmail.com'
  `).run();

  console.log('✅ SQLite updated successfully.');

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elearning_db'
    });

    await conn.query(`
      UPDATE students 
      SET avatar_frame = '/assets/frames/autumn_crown.webp'
      WHERE username = 'riki.dev' OR email = 'soksithcheyhoout@gmail.com'
    `);

    await conn.query(`
      UPDATE students 
      SET avatar_frame = '/assets/frames/11_gyoko_pink.png',
          avatar = '/uploads/avatars/student-pf-1786900313001-208036926.jpg'
      WHERE username = 'hout.sok.sithchey' OR email = 'houtsoksithchey@gmail.com'
    `);

    console.log('✅ MySQL (elearning_db) updated successfully.');
    await conn.end();
  } catch (e) {
    console.warn('MySQL update notice:', e.message);
  }
}

sync();
