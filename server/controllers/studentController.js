import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { db } from '../config/db.js';

// Setup Multer Storage for Custom Student Profile Pictures (PF)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads/avatars');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, `student-pf-${uniqueSuffix}${ext}`);
  }
});

// File filter (Images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Update Profile Data
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fullNameEn, school, grade, stream, avatarFrame, avatar_frame, avatar } = req.body;
    const frame = avatarFrame !== undefined ? avatarFrame : (avatar_frame !== undefined ? avatar_frame : null);

    // Save directly to SQLite Database
    db.run(
      `UPDATE students SET 
        full_name = COALESCE(?, full_name),
        full_name_en = COALESCE(?, full_name_en),
        school = COALESCE(?, school),
        grade = COALESCE(?, grade),
        stream = COALESCE(?, stream),
        avatar = COALESCE(?, avatar),
        avatar_frame = COALESCE(?, avatar_frame),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ? OR username = ?`,
      [name || null, fullNameEn || null, school || null, grade || null, stream || null, avatar || null, frame, id, id]
    );

    const updated = db.get('SELECT * FROM students WHERE id = ? OR username = ?', [id, id]);
    if (!updated) return res.status(404).json({ error: 'Student not found.' });

    delete updated.password_hash;
    return res.json({
      message: 'Profile updated successfully',
      student: {
        ...updated,
        name: updated.full_name,
        avatarFrame: updated.avatar_frame
      }
    });
  } catch (err) {
    console.error('[Update Profile Error]:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
};

// Upload Custom Student Profile Picture (PF)
export const uploadAvatar = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const { studentId } = req.body;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    if (studentId) {
      db.run(
        `UPDATE students SET avatar = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? 
            OR LOWER(username) = LOWER(?) 
            OR LOWER(full_name) = LOWER(?)
            OR LOWER(full_name_en) = LOWER(?)
            OR id = (SELECT id FROM students WHERE LOWER(full_name) LIKE '%' || LOWER(?) || '%' LIMIT 1)`,
        [avatarUrl, studentId, studentId, studentId, studentId, studentId]
      );
    }

    return res.json({
      message: 'Profile picture uploaded successfully',
      avatarUrl
    });
  } catch (err) {
    console.error('[Avatar Upload Error]:', err);
    return res.status(500).json({ error: 'Failed to upload profile picture.' });
  }
};

// Add XP & Level Up Handler
export const addXP = (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const safeAmount = Number(amount) || 0;

    const student = db.get('SELECT * FROM students WHERE id = ? OR username = ?', [id, id]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const newXP = student.xp + safeAmount;
    const newLevel = Math.max(1, Math.floor(newXP / 500) + 1);

    db.run(
      `UPDATE students SET xp = ?, level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [newXP, newLevel, student.id]
    );

    return res.json({
      xp: newXP,
      level: newLevel
    });
  } catch (err) {
    console.error('[Add XP Error]:', err);
    return res.status(500).json({ error: 'Failed to add XP.' });
  }
};

// Get Global Leaderboard
export const getLeaderboard = (req, res) => {
  try {
    const topStudents = db.all(
      `SELECT id, username, full_name, school, grade, stream, avatar, avatar_frame, xp, level, streak_days 
       FROM students 
       ORDER BY xp DESC 
       LIMIT 50`
    );

    return res.json({ leaderboard: topStudents || [] });
  } catch (err) {
    console.error('[Leaderboard Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
};

// Get All Real Registered Students from Database for Invites & Matchmaking
export const getRegisteredStudents = async (req, res) => {
  try {
    const students = db.all(
      `SELECT id, username, full_name, full_name_en, first_name, last_name, email, school, province, grade, stream, avatar, avatar_frame, xp, level, streak_days, created_at 
       FROM students 
       ORDER BY id ASC`
    ) || [];

    // Map avatar_frame to avatarFrame for frontend consistency
    const mapped = students.map(s => ({
      ...s,
      avatarFrame: s.avatar_frame || s.avatarFrame || ''
    }));

    return res.json({ students: mapped });
  } catch (err) {
    console.error('[Get Students Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch registered students.' });
  }
};

