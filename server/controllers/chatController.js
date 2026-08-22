import path from 'path';
import fs from 'fs';
import multer from 'multer';
import db from '../config/db.js';

// Setup Multer Storage for Chat Media (Images, Videos, Voice Audios)
const chatMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads/chat');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext) {
      if (file.mimetype.includes('webm')) ext = '.webm';
      else if (file.mimetype.includes('mp4')) ext = '.mp4';
      else if (file.mimetype.includes('audio')) ext = '.webm';
      else if (file.mimetype.includes('image')) ext = '.png';
      else ext = '.dat';
    }
    cb(null, `chat-media-${uniqueSuffix}${ext}`);
  }
});

export const uploadChatMediaMulter = multer({
  storage: chatMediaStorage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export const uploadChatMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media file provided' });
    }
    const relativeUrl = `/uploads/chat/${req.file.filename}`;
    let mediaType = 'image';
    if (req.file.mimetype.startsWith('video/')) mediaType = 'video';
    else if (req.file.mimetype.startsWith('audio/')) mediaType = 'audio';

    return res.json({
      success: true,
      url: relativeUrl,
      mediaType,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.error('Failed to upload chat media:', err);
    return res.status(500).json({ error: 'Failed to upload chat media' });
  }
};

// 1. Get messages for a channel
export const getChannelMessages = async (req, res) => {
  try {
    const channelId = req.query.channel || 'global';
    
    // Ensure table exists
    db.run(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id VARCHAR(50) DEFAULT 'global',
        sender_id INTEGER,
        sender_name VARCHAR(150),
        sender_username VARCHAR(100),
        sender_avatar TEXT,
        sender_frame TEXT,
        sender_school VARCHAR(200),
        sender_grade VARCHAR(50),
        sender_level INTEGER DEFAULT 1,
        sender_badge VARCHAR(100),
        content TEXT NOT NULL,
        reactions TEXT DEFAULT '{}',
        is_duel_challenge BOOLEAN DEFAULT 0,
        duel_room_code VARCHAR(20),
        media_type VARCHAR(20) DEFAULT 'text',
        media_url TEXT,
        media_duration VARCHAR(20),
        media_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const messages = db.all(
      'SELECT * FROM chat_messages WHERE channel_id = ? ORDER BY id ASC LIMIT 100',
      [channelId]
    );

    const parsed = messages.map(m => ({
      ...m,
      is_duel_challenge: Boolean(m.is_duel_challenge),
      reactions: typeof m.reactions === 'string' ? JSON.parse(m.reactions || '{}') : (m.reactions || {})
    }));

    return res.json({ success: true, channelId, messages: parsed });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// 2. Send message in a channel
export const sendChannelMessage = async (req, res) => {
  try {
    const {
      channelId = 'global',
      senderId,
      senderName,
      senderUsername,
      senderAvatar,
      senderFrame,
      senderSchool,
      senderGrade,
      senderLevel,
      senderBadge,
      content = '',
      isDuelChallenge,
      duelRoomCode,
      mediaType = 'text',
      mediaUrl = null,
      mediaDuration = null,
      mediaName = null
    } = req.body;

    if ((!content || !content.trim()) && !mediaUrl) {
      return res.status(400).json({ error: 'Message content or media cannot be empty' });
    }

    // Look up real student from DB to guarantee authentic avatar and frame
    let resolvedAvatar = senderAvatar;
    let resolvedFrame = senderFrame;
    let resolvedName = senderName;
    let resolvedUsername = senderUsername;
    let resolvedSchool = senderSchool;
    let resolvedGrade = senderGrade;
    let resolvedLevel = senderLevel;
    let resolvedBadge = senderBadge;

    if (senderId || senderUsername) {
      const studentRecord = db.get('SELECT * FROM students WHERE id = ? OR username = ?', [senderId || 0, senderUsername || '']);
      if (studentRecord) {
        resolvedAvatar = studentRecord.avatar || resolvedAvatar || '/assets/anime/boys/boy_1.png';
        resolvedFrame = studentRecord.avatar_frame || studentRecord.avatarFrame || resolvedFrame || '';
        resolvedName = studentRecord.full_name || studentRecord.name || studentRecord.username || resolvedName;
        resolvedUsername = studentRecord.username || resolvedUsername;
        resolvedSchool = studentRecord.school || resolvedSchool || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ';
        resolvedGrade = `ថ្នាក់ទី${studentRecord.grade || '12'} (${studentRecord.stream || 'វិទ្យាសាស្ត្រ'})`;
        resolvedLevel = studentRecord.level || resolvedLevel || 1;
        resolvedBadge = studentRecord.rank_title_km || resolvedBadge || 'សិស្សឆ្នើម (Scholar)';
      }
    }

    const result = db.run(
      `INSERT INTO chat_messages 
       (channel_id, sender_id, sender_name, sender_username, sender_avatar, sender_frame, sender_school, sender_grade, sender_level, sender_badge, content, reactions, is_duel_challenge, duel_room_code, media_type, media_url, media_duration, media_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        channelId,
        senderId || 1,
        resolvedName || 'Student',
        resolvedUsername || 'student',
        resolvedAvatar || '/assets/anime/boys/boy_1.png',
        resolvedFrame || '',
        resolvedSchool || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
        resolvedGrade || 'ថ្នាក់ទី12 (វិទ្យាសាស្ត្រ)',
        resolvedLevel || 1,
        resolvedBadge || 'សិស្សឆ្នើម (Scholar)',
        (content || '').trim(),
        JSON.stringify({}),
        isDuelChallenge ? 1 : 0,
        duelRoomCode || null,
        mediaType || 'text',
        mediaUrl || null,
        mediaDuration || null,
        mediaName || null
      ]
    );

    const insertedId = result.lastInsertRowid;
    const newMsg = db.get('SELECT * FROM chat_messages WHERE id = ?', [insertedId]);

    return res.status(201).json({
      success: true,
      message: {
        ...newMsg,
        reactions: {}
      }
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

// 3. Toggle reaction on message
export const toggleReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji, studentId } = req.body;
    const currentUserId = String(studentId || 1);

    const msg = db.get('SELECT * FROM chat_messages WHERE id = ?', [id]);
    if (!msg) {
      return res.status(404).json({ error: 'Message not found' });
    }

    let reactions = typeof msg.reactions === 'string' ? JSON.parse(msg.reactions || '{}') : (msg.reactions || {});
    
    if (!reactions[emoji]) {
      reactions[emoji] = [currentUserId];
    } else if (Array.isArray(reactions[emoji])) {
      const strIds = reactions[emoji].map(String);
      const idx = strIds.indexOf(currentUserId);
      if (idx > -1) {
        // Remove reaction when clicked again!
        reactions[emoji] = reactions[emoji].filter(uid => String(uid) !== currentUserId);
        if (reactions[emoji].length === 0) {
          delete reactions[emoji];
        }
      } else {
        reactions[emoji].push(currentUserId);
      }
    } else {
      // Legacy number count or boolean
      delete reactions[emoji];
    }

    db.run('UPDATE chat_messages SET reactions = ? WHERE id = ?', [JSON.stringify(reactions), id]);

    return res.json({ success: true, messageId: id, reactions });
  } catch (error) {
    console.error('Error toggling reaction:', error);
    return res.status(500).json({ error: 'Failed to toggle reaction' });
  }
};

// 4. Clear channel messages
export const clearChannel = async (req, res) => {
  try {
    const channelId = req.query.channel || 'global';
    db.run('DELETE FROM chat_messages WHERE channel_id = ?', [channelId]);
    return res.json({ success: true, message: `Cleared channel ${channelId}` });
  } catch (error) {
    console.error('Error clearing channel:', error);
    return res.status(500).json({ error: 'Failed to clear channel' });
  }
};

// 5. Delete individual message by ID
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, username } = req.body || {};

    const msg = db.get('SELECT * FROM chat_messages WHERE id = ?', [id]);
    if (!msg) {
      return res.status(404).json({ error: 'Message not found' });
    }

    db.run('DELETE FROM chat_messages WHERE id = ?', [id]);
    return res.json({ success: true, messageId: id, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
};
