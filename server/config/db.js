import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbFilePath = path.join(dataDir, 'elearning_db.json');

// Default initial state with authentic registered students
const defaultDbState = {
  students: [
    {
      id: 1,
      username: 'riki.dev',
      password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // 123456
      full_name: 'riki.dev',
      full_name_en: 'RIKI DEV',
      first_name: 'riki',
      last_name: 'dev',
      nickname: 'riki.dev',
      student_id: 'BACII-000001',
      email: 'soksithcheyhoout@gmail.com',
      phone: '08566901800',
      google_id: null,
      auth_provider: 'google',
      grade: '12',
      stream: 'science',
      school: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
      province: 'រាជធានីភ្នំពេញ',
      avatar: '/assets/anime/boys/boy_1.png',
      avatar_frame: '/assets/frames/autumn_crown.webp',
      xp: 3568,
      level: 8,
      rank_title_km: 'អ្នកប្រាជ្ញថ្នាក់ជាតិ (National Scholar)',
      rank_title_en: 'National Scholar',
      streak_days: 14,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      username: 'hout.sok.sithchey',
      password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // 123456
      full_name: 'Hout Sok sithchey',
      full_name_en: 'HOUT SOK SITHECHEY',
      first_name: 'Soksithchey',
      last_name: 'Hout',
      nickname: 'Hout Sok sithchey',
      student_id: 'BACII-000002',
      email: 'houtsoksithchey@gmail.com',
      phone: '08566901800',
      google_id: null,
      auth_provider: 'google',
      grade: '12',
      stream: 'science',
      school: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
      province: 'រាជធានីភ្នំពេញ',
      avatar: '/uploads/avatars/student-pf-1786900313001-208036926.jpg',
      avatar_frame: '/assets/frames/11_gyoko_pink.png',
      xp: 500,
      level: 2,
      rank_title_km: 'អ្នកសិក្សាដំបូង (Novice Scholar)',
      rank_title_en: 'Novice Scholar',
      streak_days: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  auth_otps: [],
  bacii_certificates: [],
  quiz_results: [],
  student_badges: [
    {
      id: 1,
      student_id: 1,
      badge_id: 'b-welcome',
      title_km: 'សិស្សថ្មី (New Scholar)',
      title_en: 'New Scholar',
      color: '#38bdf8',
      unlocked_at: new Date().toISOString()
    },
    {
      id: 2,
      student_id: 2,
      badge_id: 'b-welcome',
      title_km: 'សិស្សថ្មី (New Scholar)',
      title_en: 'New Scholar',
      color: '#38bdf8',
      unlocked_at: new Date().toISOString()
    }
  ],
  arena_matches: [],
  messages: [],
  exams: []
};

// In-Memory state loaded from JSON
let inMemoryData = defaultDbState;

function loadDatabase() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      inMemoryData = { ...defaultDbState, ...parsed };
      if (!Array.isArray(inMemoryData.exams)) inMemoryData.exams = [];
    } else {
      saveDatabase();
    }
  } catch (e) {
    inMemoryData = defaultDbState;
    saveDatabase();
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(inMemoryData, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save database file:', e);
  }
}

loadDatabase();

// Pure JS Database Engine
export const db = {
  get inMemoryData() { return inMemoryData; },
  saveDatabase,
  all: (sql, params = []) => {
    loadDatabase();
    const cleanSql = sql.trim().toLowerCase();

    // 1. SELECT * FROM students ...
    if (cleanSql.includes('from students')) {
      let list = [...inMemoryData.students];
      if (cleanSql.includes('where')) {
        if (cleanSql.includes('where')) {
          list = list.filter(s => {
            return params.some(p => {
              if (p === null || p === undefined) return false;
              const pStr = String(p).toLowerCase().trim();
              return (
                String(s.id).toLowerCase() === pStr ||
                (s.username && s.username.toLowerCase() === pStr) ||
                (s.email && s.email.toLowerCase() === pStr) ||
                (s.student_id && s.student_id.toLowerCase() === pStr) ||
                (s.phone && String(s.phone).toLowerCase() === pStr)
              );
            });
          });
        }
      }
      if (cleanSql.includes('order by xp desc')) {
        list.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      } else if (cleanSql.includes('order by id asc')) {
        list.sort((a, b) => (a.id || 0) - (b.id || 0));
      }
      if (cleanSql.includes('limit 50')) {
        list = list.slice(0, 50);
      }
      return list;
    }

    // 2. SELECT * FROM student_badges
    if (cleanSql.includes('from student_badges')) {
      const studentId = params[0];
      return inMemoryData.student_badges.filter(b => String(b.student_id) === String(studentId));
    }

    // 3. SELECT * FROM bacii_certificates
    if (cleanSql.includes('from bacii_certificates')) {
      const studentId = params[0];
      return inMemoryData.bacii_certificates.filter(c => String(c.student_id) === String(studentId));
    }

    // 4. SELECT * FROM quiz_results
    if (cleanSql.includes('from quiz_results')) {
      const studentId = params[0];
      return inMemoryData.quiz_results.filter(q => String(q.student_id) === String(studentId));
    }

    // 5. SELECT * FROM auth_otps
    if (cleanSql.includes('from auth_otps')) {
      let list = inMemoryData.auth_otps || [];
      if (cleanSql.includes('where')) {
        list = list.filter(o => {
          const isUnused = o.is_used === 0 || o.is_used === false;
          if (cleanSql.includes('is_used = 0') && !isUnused) return false;
          
          if (params.length >= 2) {
            const codeParam = String(params[params.length - 1]).trim();
            const targetParams = params.slice(0, params.length - 1).map(p => String(p).toLowerCase().trim());
            const codeMatch = String(o.otp_code).trim() === codeParam;
            const targetMatch = targetParams.includes(String(o.target).toLowerCase().trim());
            return codeMatch && targetMatch;
          }
          return params.some(p => String(o.target).toLowerCase() === String(p).toLowerCase());
        });
      }
      return list;
    }

    // 6. SELECT * FROM chat_messages OR messages
    if (cleanSql.includes('from chat_messages') || cleanSql.includes('from messages')) {
      if (!Array.isArray(inMemoryData.messages)) inMemoryData.messages = [];
      let list = [...inMemoryData.messages];
      if (cleanSql.includes('where channel_id = ?') || cleanSql.includes('where channel_id=')) {
        const channelId = params[0] || 'global';
        list = list.filter(m => String(m.channel_id) === String(channelId));
      } else if (cleanSql.includes('where id = ?')) {
        const msgId = Number(params[0]);
        list = list.filter(m => Number(m.id) === msgId);
      }
      if (cleanSql.includes('order by id asc')) {
        list.sort((a, b) => (a.id || 0) - (b.id || 0));
      }
      if (cleanSql.includes('limit 100')) {
        list = list.slice(-100);
      }
      return list;
    }

    return [];
  },

  get: (sql, params = []) => {
    const rows = db.all(sql, params);
    return rows.length > 0 ? rows[0] : null;
  },

  run: (sql, params = []) => {
    loadDatabase();
    const cleanSql = sql.trim().toLowerCase();

    // 0. INSERT INTO auth_otps
    if (cleanSql.startsWith('insert into auth_otps')) {
      if (!inMemoryData.auth_otps) inMemoryData.auth_otps = [];
      const newId = inMemoryData.auth_otps.length + 1;
      inMemoryData.auth_otps.push({
        id: newId,
        target: params[0],
        otp_code: params[1],
        purpose: params[2] || 'login',
        expires_at: params[3] || new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        is_used: 0,
        created_at: new Date().toISOString()
      });
      saveDatabase();
      return { lastInsertRowid: newId, changes: 1 };
    }

    // 0.1 UPDATE auth_otps SET is_used = 1
    if (cleanSql.startsWith('update auth_otps')) {
      if (!inMemoryData.auth_otps) inMemoryData.auth_otps = [];
      if (cleanSql.includes('where id = ?')) {
        const id = params[0];
        inMemoryData.auth_otps = inMemoryData.auth_otps.map(o => o.id === id ? { ...o, is_used: 1 } : o);
      } else {
        const targetList = params.map(p => String(p).toLowerCase().trim());
        inMemoryData.auth_otps = inMemoryData.auth_otps.map(o => targetList.includes(String(o.target).toLowerCase().trim()) ? { ...o, is_used: 1 } : o);
      }
      saveDatabase();
      return { changes: 1 };
    }

    // DELETE FROM students WHERE id = ?
    if (cleanSql.startsWith('delete from students')) {
      const targetId = Number(params[0]);
      inMemoryData.students = inMemoryData.students.filter(s => Number(s.id) !== targetId && String(s.id) !== String(params[0]));
      saveDatabase();
      return { changes: 1 };
    }

    // 1. UPDATE students SET ...
    if (cleanSql.startsWith('update students')) {
      const target = params[params.length - 1]; // id or username
      const target2 = params[params.length - 2] || target;

      let updatedRow = null;
      inMemoryData.students = inMemoryData.students.map(s => {
        if (
          String(s.id) === String(target) || 
          String(s.id) === String(target2) ||
          (s.username && (s.username.toLowerCase() === String(target).toLowerCase() || s.username.toLowerCase() === String(target2).toLowerCase())) ||
          (s.email && (s.email.toLowerCase() === String(target).toLowerCase() || s.email.toLowerCase() === String(target2).toLowerCase()))
        ) {
          // Check if updating avatar
          if (cleanSql.includes('avatar = ?') && !cleanSql.includes('full_name = coalesce')) {
            s.avatar = params[0] || s.avatar;
          } else if (cleanSql.includes('full_name = coalesce')) {
            // [name, fullNameEn, school, grade, stream, avatar, frame, id, id]
            if (params[0]) s.full_name = params[0];
            if (params[1]) s.full_name_en = params[1];
            if (params[2]) s.school = params[2];
            if (params[3]) s.grade = params[3];
            if (params[4]) s.stream = params[4];
            if (params[5]) s.avatar = params[5];
            if (params[6] !== undefined && params[6] !== null) s.avatar_frame = params[6];
          } else if (cleanSql.includes('xp = ?, level = ?')) {
            s.xp = params[0];
            s.level = params[1];
          }
          s.updated_at = new Date().toISOString();
          updatedRow = s;
        }
        return s;
      });

      saveDatabase();
      return { changes: updatedRow ? 1 : 0 };
    }

    // 2. INSERT INTO students
    if (cleanSql.startsWith('insert into students')) {
      const newId = inMemoryData.students.length > 0 ? Math.max(...inMemoryData.students.map(s => s.id || 0)) + 1 : 1;
      const newStudent = {
        id: newId,
        username: params[0],
        password_hash: params[1],
        full_name: params[2],
        full_name_en: params[3] || '',
        first_name: params[4] || '',
        last_name: params[5] || '',
        nickname: params[6] || params[0],
        email: params[7] || null,
        phone: params[8] || null,
        google_id: params[9] || null,
        auth_provider: params[10] || 'local',
        student_id: params[11] || `BACII-${Date.now().toString().slice(-6)}`,
        grade: params[12] || '12',
        stream: params[13] || 'science',
        school: params[14] || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
        province: params[15] || 'រាជធានីភ្នំពេញ',
        avatar: params[16] || '/assets/anime/boys/boy_1.png',
        avatar_frame: params[17] || '',
        xp: 500,
        level: 1,
        rank_title_km: 'អ្នកសិក្សាដំបូង (Novice Scholar)',
        rank_title_en: 'Novice Scholar',
        streak_days: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      inMemoryData.students.push(newStudent);
      saveDatabase();
      return { lastInsertRowid: newId, changes: 1 };
    }

    // 3. INSERT INTO bacii_certificates
    if (cleanSql.startsWith('insert into bacii_certificates')) {
      const newId = inMemoryData.bacii_certificates.length + 1;
      inMemoryData.bacii_certificates.push({
        id: newId,
        student_id: params[0],
        certificate_no: params[1],
        stream: params[2],
        overall_grade: params[3],
        overall_text_km: params[4],
        total_score: params[5],
        max_possible: params[6],
        percentage: params[7],
        subject_scores_json: params[8],
        issued_date: params[9],
        qr_verify_hash: params[10],
        created_at: new Date().toISOString()
      });
      saveDatabase();
      return { lastInsertRowid: newId, changes: 1 };
    }

    // 4. INSERT INTO student_badges
    if (cleanSql.startsWith('insert into student_badges')) {
      const newId = inMemoryData.student_badges.length + 1;
      inMemoryData.student_badges.push({
        id: newId,
        student_id: params[0],
        badge_id: params[1],
        title_km: params[2],
        title_en: params[3],
        color: params[4],
        unlocked_at: new Date().toISOString()
      });
      saveDatabase();
      return { lastInsertRowid: newId, changes: 1 };
    }

    // 5. INSERT INTO quiz_results
    if (cleanSql.startsWith('insert into quiz_results')) {
      const newId = inMemoryData.quiz_results.length + 1;
      inMemoryData.quiz_results.push({
        id: newId,
        student_id: params[0],
        quiz_id: params[1],
        quiz_title: params[2],
        score: params[3],
        total: params[4],
        xp_earned: params[5],
        completed_at: new Date().toISOString()
      });
      saveDatabase();
      return { lastInsertRowid: newId, changes: 1 };
    }

    // 6. INSERT INTO chat_messages OR messages
    if (cleanSql.startsWith('insert into chat_messages') || cleanSql.startsWith('insert into messages')) {
      if (!Array.isArray(inMemoryData.messages)) inMemoryData.messages = [];
      const newId = inMemoryData.messages.length > 0 ? Math.max(...inMemoryData.messages.map(m => m.id || 0)) + 1 : 1;
      const newMsg = {
        id: newId,
        channel_id: params[0] || 'global',
        sender_id: params[1] || 1,
        sender_name: params[2] || 'Student',
        sender_username: params[3] || 'student',
        sender_avatar: params[4] || '/assets/anime/boys/boy_1.png',
        sender_frame: params[5] || '/assets/frames/11_gyoko_pink.png',
        sender_school: params[6] || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
        sender_grade: params[7] || '12',
        sender_level: params[8] || 1,
        sender_badge: params[9] || 'សិស្សឆ្នើម (Scholar)',
        content: params[10] || '',
        reactions: typeof params[11] === 'string' ? params[11] : JSON.stringify(params[11] || {}),
        is_duel_challenge: params[12] ? 1 : 0,
        duel_room_code: params[13] || null,
        media_type: params[14] || 'text',
        media_url: params[15] || null,
        media_duration: params[16] || null,
        media_name: params[17] || null,
        created_at: new Date().toISOString()
      };
      inMemoryData.messages.push(newMsg);
      saveDatabase();
      return { lastInsertRowid: newId, changes: 1 };
    }

    // 7. UPDATE chat_messages (reactions)
    if (cleanSql.startsWith('update chat_messages') || cleanSql.startsWith('update messages')) {
      if (!Array.isArray(inMemoryData.messages)) inMemoryData.messages = [];
      const reactionsVal = params[0];
      const msgId = Number(params[1]);
      inMemoryData.messages = inMemoryData.messages.map(m => {
        if (Number(m.id) === msgId) {
          return { ...m, reactions: typeof reactionsVal === 'string' ? reactionsVal : JSON.stringify(reactionsVal) };
        }
        return m;
      });
      saveDatabase();
      return { changes: 1 };
    }

    // 8. DELETE FROM chat_messages OR messages
    if (cleanSql.startsWith('delete from chat_messages') || cleanSql.startsWith('delete from messages')) {
      if (!Array.isArray(inMemoryData.messages)) inMemoryData.messages = [];
      if (cleanSql.includes('where id = ?')) {
        const targetId = Number(params[0]);
        inMemoryData.messages = inMemoryData.messages.filter(m => Number(m.id) !== targetId);
      } else if (cleanSql.includes('where channel_id = ?')) {
        const channelId = params[0];
        inMemoryData.messages = inMemoryData.messages.filter(m => String(m.channel_id) !== String(channelId));
      }
      saveDatabase();
      return { changes: 1 };
    }

    saveDatabase();
    return { changes: 1 };
  },

  exec: () => {
    return true;
  }
};

console.log('✅ High-Performance Zero-Dependency JSON Database Initialized at:', dbFilePath);
export default db;
