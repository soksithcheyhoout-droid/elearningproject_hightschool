import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data/elearning.db');

const sqlite = new Database(dbPath);

async function inspect() {
  const sqliteRows = sqlite.prepare('SELECT * FROM students').all();
  console.log('=== SQLITE STUDENTS ROWS ===');
  console.log(JSON.stringify(sqliteRows, null, 2));

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elearning_db'
    });
    const [mysqlRows] = await conn.query('SELECT * FROM students');
    console.log('=== MYSQL (elearning_db) STUDENTS ROWS ===');
    console.log(JSON.stringify(mysqlRows, null, 2));
    
    // Save inspection output to file for exact reading
    fs.writeFileSync(path.join(__dirname, 'db_inspection.json'), JSON.stringify({ sqlite: sqliteRows, mysql: mysqlRows }, null, 2));
    await conn.end();
  } catch (e) {
    console.warn('MySQL inspection error:', e.message);
  }
}

inspect();
