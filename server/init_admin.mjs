import sqliteDb from './config/db.js';
import mysql from 'mysql2/promise';

async function initAdmin() {
  console.log('🛡️ Initializing Admin Table & Credentials...');

  // 1. SQLite Table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      role VARCHAR(50) DEFAULT 'superadmin',
      avatar TEXT DEFAULT '/assets/anime/boys/boy_1.png',
      avatar_frame TEXT DEFAULT '/assets/frames/11_gyoko_pink.png',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqliteDb.run(`
    INSERT OR REPLACE INTO admins (id, username, email, password_hash, full_name, role, avatar, avatar_frame)
    VALUES (1, 'admin', 'soksithcheyhoout@gmail.com', 'admin123', 'Hout Sok Sithchey (Super Admin)', 'superadmin', '/assets/anime/boys/boy_1.png', '/assets/frames/11_gyoko_pink.png')
  `);

  sqliteDb.run(`
    INSERT OR REPLACE INTO admins (id, username, email, password_hash, full_name, role, avatar, avatar_frame)
    VALUES (2, 'motdar_admin', 'admin@motdar.gov.kh', 'admin123', 'MoTDAR Ministry Administrator', 'superadmin', '/assets/anime/boys/boy_2.png', '/assets/frames/11_gyoko_pink.png')
  `);

  // 2. MySQL Table (phpMyAdmin: elearning_db)
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elearning_db'
    });

    await conn.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        role VARCHAR(50) DEFAULT 'superadmin',
        avatar TEXT,
        avatar_frame TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await conn.query(`
      INSERT INTO admins (id, username, email, password_hash, full_name, role, avatar, avatar_frame)
      VALUES (1, 'admin', 'soksithcheyhoout@gmail.com', 'admin123', 'Hout Sok Sithchey (Super Admin)', 'superadmin', '/assets/anime/boys/boy_1.png', '/assets/frames/11_gyoko_pink.png')
      ON DUPLICATE KEY UPDATE email=VALUES(email), password_hash=VALUES(password_hash), full_name=VALUES(full_name);
    `);

    await conn.query(`
      INSERT INTO admins (id, username, email, password_hash, full_name, role, avatar, avatar_frame)
      VALUES (2, 'motdar_admin', 'admin@motdar.gov.kh', 'admin123', 'MoTDAR Ministry Administrator', 'superadmin', '/assets/anime/boys/boy_2.png', '/assets/frames/11_gyoko_pink.png')
      ON DUPLICATE KEY UPDATE email=VALUES(email), password_hash=VALUES(password_hash), full_name=VALUES(full_name);
    `);

    const [rows] = await conn.query('SELECT id, username, email, full_name, role FROM admins');
    console.log('✅ Admin accounts active in MySQL & SQLite:');
    console.log(JSON.stringify(rows, null, 2));

    await conn.end();
  } catch (e) {
    console.error('MySQL notice:', e.message);
  }
}

initAdmin();
