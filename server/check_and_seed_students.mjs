import mysql from 'mysql2/promise';
import { db } from './config/db.js';

const nationalStudents = [
  {
    username: 'engthaykunsateya',
    full_name: 'អេង ថៃគុនសត្យា',
    full_name_en: 'Eng Thaykunsateya',
    email: 'engthaykunsateya@gmail.com',
    password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    grade: '12',
    stream: 'science',
    school: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
    province: 'រាជធានីភ្នំពេញ',
    avatar: '/assets/anime/boys/boy_1.png',
    avatar_frame: '/assets/frames/11_gyoko_pink.png',
    xp: 3200,
    level: 7,
    rank_title_km: 'អ្នកប្រាជ្ញថ្នាក់ជាតិ (National Scholar)',
    streak_days: 10
  },
  {
    username: 'sothea.chem',
    full_name: 'គឹម សុធា',
    full_name_en: 'Kim Sothea',
    email: 'kimsothea.scholar@gmail.com',
    password_hash: '$2b$10$abcdefghijklmnopqrstuv',
    grade: '12',
    stream: 'science',
    school: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
    province: 'រាជធានីភ្នំពេញ',
    avatar: '/assets/anime/boys/boy_2.png',
    avatar_frame: '/assets/frames/11_gyoko_pink.png',
    xp: 4250,
    level: 9,
    rank_title_km: 'អ្នកប្រាជ្ញគណិតវិទ្យា (Math Scholar)',
    streak_days: 18
  },
  {
    username: 'bopha.reach',
    full_name: 'រាជ បុប្ផា',
    full_name_en: 'Reach Bopha',
    email: 'reach.bopha.edu@gmail.com',
    password_hash: '$2b$10$abcdefghijklmnopqrstuv',
    grade: '12',
    stream: 'science',
    school: 'វិទ្យាល័យ បាក់ទូក',
    province: 'រាជធានីភ្នំពេញ',
    avatar: '/assets/anime/girls/girl_1.png',
    avatar_frame: '/assets/frames/11_gyoko_pink.png',
    xp: 3890,
    level: 8,
    rank_title_km: 'ជើងឯករូបវិទ្យា (Physics Champion)',
    streak_days: 12
  },
  {
    username: 'vireak.chhun',
    full_name: 'ឈុន វីរៈ',
    full_name_en: 'Chhun Vireak',
    email: 'vireak.stem.kh@gmail.com',
    password_hash: '$2b$10$abcdefghijklmnopqrstuv',
    grade: '12',
    stream: 'science',
    school: 'វិទ្យាល័យ ព្រះយុគន្ធរ',
    province: 'រាជធានីភ្នំពេញ',
    avatar: '/assets/anime/boys/boy_3.png',
    avatar_frame: '/assets/frames/11_gyoko_pink.png',
    xp: 5120,
    level: 11,
    rank_title_km: 'កំពូលអ្នកស្រាវជ្រាវ (Master Researcher)',
    streak_days: 25
  },
  {
    username: 'dany.meas',
    full_name: 'មាស ដានី',
    full_name_en: 'Meas Dany',
    email: 'measdany.bacii@gmail.com',
    password_hash: '$2b$10$abcdefghijklmnopqrstuv',
    grade: '12',
    stream: 'science',
    school: 'វិទ្យាល័យ ហ៊ុនសែន ភ្នំពេញថ្មី',
    province: 'រាជធានីភ្នំពេញ',
    avatar: '/assets/anime/girls/girl_2.png',
    avatar_frame: '/assets/frames/11_gyoko_pink.png',
    xp: 3410,
    level: 7,
    rank_title_km: 'សិស្សឆ្នើមគីមីវិទ្យា (Chemistry Elite)',
    streak_days: 9
  },
  {
    username: 'sovann.ly',
    full_name: 'លី សុវណ្ណ',
    full_name_en: 'Ly Sovann',
    email: 'lysovann.cambodia@gmail.com',
    password_hash: '$2b$10$abcdefghijklmnopqrstuv',
    grade: '12',
    stream: 'social',
    school: 'វិទ្យាល័យ ហ៊ុនសែន តាខ្មៅ',
    province: 'ខេត្តកណ្តាល',
    avatar: '/assets/anime/boys/boy_4.png',
    avatar_frame: '/assets/frames/11_gyoko_pink.png',
    xp: 2980,
    level: 6,
    rank_title_km: 'សិស្សពូកែអក្សរសាស្ត្រ (Literature Star)',
    streak_days: 14
  },
  {
    username: 'kanha.seng',
    full_name: 'សេង កញ្ញា',
    full_name_en: 'Seng Kanha',
    email: 'kanha.seng.kh@gmail.com',
    password_hash: '$2b$10$abcdefghijklmnopqrstuv',
    grade: '12',
    stream: 'science',
    school: 'វិទ្យាល័យ សម្តេចតេជោ ហ៊ុន សែន សួង',
    province: 'ខេត្តត្បូងឃ្មុំ',
    avatar: '/assets/anime/girls/girl_3.png',
    avatar_frame: '/assets/frames/11_gyoko_pink.png',
    xp: 4600,
    level: 10,
    rank_title_km: 'សិស្សឆ្នើមបាក់ឌុបនិទ្ទេស A (Bac II Grade A)',
    streak_days: 21
  }
];

async function run() {
  console.log('Seeding national student peers into SQLite & MySQL...');

  // 1. Seed into SQLite
  for (const s of nationalStudents) {
    const existing = db.get('SELECT id FROM students WHERE username = ? OR email = ?', [s.username, s.email]);
    if (!existing) {
      db.run(
        `INSERT INTO students (username, full_name, full_name_en, email, grade, stream, school, province, avatar, avatar_frame, xp, level, rank_title_km, streak_days)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.username, s.full_name, s.full_name_en, s.email, s.grade, s.stream, s.school, s.province, s.avatar, s.avatar_frame, s.xp, s.level, s.rank_title_km, s.streak_days]
      );
    }
  }

  const allSqlite = db.all('SELECT id, username, full_name, email, school, xp FROM students');
  console.log('✅ SQLite total students:', allSqlite.length);

  // 2. Seed into MySQL
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elearning_db'
    });

    for (const s of nationalStudents) {
      const [rows] = await conn.query('SELECT id FROM students WHERE username = ? OR email = ?', [s.username, s.email]);
      if (rows.length === 0) {
        await conn.query(
          `INSERT INTO students (username, full_name, full_name_en, email, grade, stream, school, province, avatar, avatar_frame, xp, level, rank_title_km, streak_days)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [s.username, s.full_name, s.full_name_en, s.email, s.grade, s.stream, s.school, s.province, s.avatar, s.avatar_frame, s.xp, s.level, s.rank_title_km, s.streak_days]
        );
      }
    }

    const [allMySql] = await conn.query('SELECT id, username, full_name, email, school, xp FROM students');
    console.log('✅ MySQL (elearning_db) total students:', allMySql.length);
    console.log(JSON.stringify(allMySql, null, 2));

    await conn.end();
  } catch (e) {
    console.log('MySQL notice:', e.message);
  }
}

run();
