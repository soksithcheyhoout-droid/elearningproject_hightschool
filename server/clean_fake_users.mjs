import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data/elearning.db');

const sqlite = new Database(dbPath);

const fakeUsernames = [
  'sothea.chem',
  'bopha.reach',
  'vireak.chhun',
  'dany.meas',
  'sovann.ly',
  'kanha.seng'
];

async function clean() {
  console.log('Cleaning fake users from SQLite...');
  for (const u of fakeUsernames) {
    sqlite.prepare('DELETE FROM students WHERE username = ?').run(u);
  }

  const realSqlite = sqlite.prepare('SELECT id, username, full_name, email FROM students').all();
  console.log('✅ Real SQLite students remaining:', realSqlite);

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elearning_db'
    });

    for (const u of fakeUsernames) {
      await conn.query('DELETE FROM students WHERE username = ?', [u]);
    }

    const [realMySql] = await conn.query('SELECT id, username, full_name, email FROM students');
    console.log('✅ Real MySQL (elearning_db) students remaining:', realMySql);

    await conn.end();
  } catch (e) {
    console.warn('MySQL clean warning:', e.message);
  }
}

clean();
