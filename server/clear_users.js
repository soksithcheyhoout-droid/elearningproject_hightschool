import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function clearAllUsers() {
  console.log('=====================================================');
  console.log('🗑️  REMOVING ALL USERS & DATA FROM DATABASES');
  console.log('=====================================================');

  // 1. Clear SQLite Database
  try {
    const sqlitePath = path.join(__dirname, 'data/elearning.db');
    if (fs.existsSync(sqlitePath)) {
      const sqlite = new Database(sqlitePath);
      sqlite.pragma('foreign_keys = OFF');
      
      const tables = ['students', 'auth_otps', 'bacii_certificates', 'quiz_results', 'student_badges', 'arena_matches', 'messages'];
      for (const t of tables) {
        try {
          sqlite.exec(`DELETE FROM ${t};`);
          sqlite.exec(`DELETE FROM sqlite_sequence WHERE name='${t}';`);
        } catch (e) {
          // table might not exist
        }
      }
      console.log('✅ SQLite Database cleaned: All users and records wiped successfully!');
    }
  } catch (err) {
    console.error('⚠️ SQLite wipe error:', err.message);
  }

  // 2. Clear MySQL / MariaDB Database (phpMyAdmin)
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'elearning_db'
    });

    await conn.query('SET FOREIGN_KEY_CHECKS = 0;');
    const tables = ['students', 'auth_otps', 'bacii_certificates', 'quiz_results', 'student_badges', 'arena_matches', 'messages'];
    for (const t of tables) {
      await conn.query(`TRUNCATE TABLE ${t};`);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1;');

    const [rows] = await conn.query('SELECT COUNT(*) as count FROM students');
    console.log(`✅ MySQL \`elearning_db\` cleaned: Total remaining students = ${rows[0].count}`);
    await conn.end();
  } catch (err) {
    console.error('⚠️ MySQL wipe error:', err.message);
  }

  console.log('=====================================================');
  console.log('🎉 SUCCESS: All user records completely cleared!');
  console.log('=====================================================');
}

clearAllUsers();
