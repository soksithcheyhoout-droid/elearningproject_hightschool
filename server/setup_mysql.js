import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function initMySQL() {
  console.log('🔄 Connecting to MySQL/MariaDB at 127.0.0.1:3306...');
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  console.log('📦 Creating database `elearning_db` if not exists...');
  await conn.query('CREATE DATABASE IF NOT EXISTS elearning_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  await conn.query('USE elearning_db;');

  const schema = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      full_name VARCHAR(150) NOT NULL,
      full_name_en VARCHAR(150),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      nickname VARCHAR(100),
      student_id VARCHAR(50) UNIQUE,
      email VARCHAR(150),
      phone VARCHAR(50),
      google_id VARCHAR(150) UNIQUE,
      auth_provider VARCHAR(50) DEFAULT 'local',
      grade VARCHAR(20) DEFAULT '12',
      stream VARCHAR(30) DEFAULT 'science',
      school VARCHAR(200) DEFAULT 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
      province VARCHAR(100) DEFAULT 'រាជធានីភ្នំពេញ',
      avatar TEXT,
      avatar_frame TEXT,
      xp INT DEFAULT 500,
      level INT DEFAULT 1,
      rank_title_km VARCHAR(150) DEFAULT 'អ្នកសិក្សាដំបូង (Novice Scholar)',
      rank_title_en VARCHAR(150) DEFAULT 'Novice Scholar',
      streak_days INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS auth_otps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      target VARCHAR(150) NOT NULL,
      otp_code VARCHAR(10) NOT NULL,
      purpose VARCHAR(50) DEFAULT 'login',
      expires_at TIMESTAMP NOT NULL,
      is_used BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bacii_certificates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      certificate_no VARCHAR(100) UNIQUE NOT NULL,
      stream VARCHAR(50) NOT NULL,
      overall_grade VARCHAR(10) NOT NULL,
      overall_text_km VARCHAR(100),
      total_score DECIMAL(6, 2) NOT NULL,
      max_possible INT DEFAULT 525,
      percentage INT NOT NULL,
      subject_scores_json TEXT,
      issued_date DATE,
      qr_verify_hash VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quiz_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      quiz_id VARCHAR(100) NOT NULL,
      quiz_title VARCHAR(200),
      score INT NOT NULL,
      total INT NOT NULL,
      xp_earned INT DEFAULT 100,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS student_badges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      badge_id VARCHAR(100) NOT NULL,
      title_km VARCHAR(150) NOT NULL,
      title_en VARCHAR(150) NOT NULL,
      icon VARCHAR(50) DEFAULT 'Award',
      color VARCHAR(50) DEFAULT '#fbbf24',
      unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS arena_matches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player1_id INT NOT NULL,
      player2_id INT,
      subject VARCHAR(50) DEFAULT 'math',
      winner_id INT,
      p1_score INT DEFAULT 0,
      p2_score INT DEFAULT 0,
      xp_reward INT DEFAULT 500,
      played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player1_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      receiver_id INT,
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES students(id) ON DELETE CASCADE
    );
  `;

  await conn.query(schema);

  // Insert default demo student if empty
  const [rows] = await conn.query('SELECT COUNT(*) as count FROM students');
  if (rows[0].count === 0) {
    console.log('🌱 Inserting default demo student...');
    await conn.query(`
      INSERT INTO students (
        username, full_name, full_name_en, student_id, email, grade, stream, school, province, xp, level
      ) VALUES (
        'student_demo', 'សុខ ពិសិដ្ឋ', 'Sok Piseth', 'STD-2026-001', 'sok.piseth@moeys.gov.kh', '12', 'science', 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ', 'រាជធានីភ្នំពេញ', 1250, 3
      )
    `);
  }

  const [tables] = await conn.query('SHOW TABLES;');
  console.log('✅ MySQL Database `elearning_db` initialized successfully in phpMyAdmin!');
  console.log('📋 Tables created:', tables.map(t => Object.values(t)[0]));

  await conn.end();
}

initMySQL().catch((err) => {
  console.error('❌ Error initializing MySQL:', err);
});
