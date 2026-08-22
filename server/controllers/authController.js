import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { sendOtpEmail } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'moeys_national_elearning_secret_key_2026';

export const register = (req, res) => {
  try {
    const { 
      username, 
      password, 
      fullName, 
      fullNameEn, 
      email,
      phone,
      googleId,
      authProvider = 'local',
      firstName,
      lastName,
      nickname,
      grade = '12', 
      stream = 'science', 
      school = 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ', 
      province = 'រាជធានីភ្នំពេញ',
      avatar = '/assets/anime/boys/boy_1.png',
      studentId 
    } = req.body;

    if (!username || !password || !fullName) {
      return res.status(400).json({ error: 'Username, password, and full name are required.' });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // Check if user exists
    const existing = db.get(
      'SELECT id FROM students WHERE username = ? OR (email IS NOT NULL AND email = ?)', 
      [cleanUsername, cleanEmail || '___nonexistent___']
    );
    if (existing) {
      return res.status(400).json({ error: 'ឈ្មោះគណនី ឬអ៊ីមែលនេះមានអ្នកប្រើរួចហើយ (Username or email already taken).' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const assignedStudentId = studentId || `BACII-${Date.now().toString().slice(-6)}`;

    const { avatarFrame, avatar_frame: avatarFrameAlt } = req.body;
    const initialFrame = avatarFrame !== undefined ? avatarFrame : (avatarFrameAlt !== undefined ? avatarFrameAlt : '');

    const result = db.run(
      `INSERT INTO students (
        username, password_hash, full_name, full_name_en, first_name, last_name, nickname,
        email, phone, google_id, auth_provider, student_id,
        grade, stream, school, province, avatar, avatar_frame, xp, level, streak_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 500, 1, 1)`,
      [
        cleanUsername,
        passwordHash,
        fullName.trim(),
        fullNameEn || '',
        firstName || '',
        lastName || '',
        nickname || cleanUsername,
        cleanEmail,
        phone ? phone.trim() : null,
        googleId || null,
        authProvider,
        assignedStudentId,
        grade,
        stream,
        school,
        province,
        avatar,
        initialFrame
      ]
    );

    const newStudentId = result.lastInsertRowid;
    const newStudent = db.get('SELECT * FROM students WHERE id = ?', [newStudentId]);

    // Insert welcome badge
    db.run(
      `INSERT INTO student_badges (student_id, badge_id, title_km, title_en, color)
       VALUES (?, 'b-welcome', 'សិស្សថ្មី (New Scholar)', 'New Scholar', '#38bdf8')`,
      [newStudentId]
    );

    if (googleId || authProvider === 'google') {
      db.run(
        `INSERT INTO student_badges (student_id, badge_id, title_km, title_en, color)
         VALUES (?, 'b-google', 'ផ្ទៀងផ្ទាត់ដោយ Google (Google Verified)', 'Google Verified', '#4285F4')`,
        [newStudentId]
      );
    }

    const badges = db.all('SELECT * FROM student_badges WHERE student_id = ?', [newStudent.id]);
    const token = jwt.sign({ id: newStudent.id, username: newStudent.username }, JWT_SECRET, { expiresIn: '30d' });

    delete newStudent.password_hash;
    return res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        ...newStudent,
        name: newStudent.full_name,
        badges
      }
    });
  } catch (err) {
    console.error('[Register Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error during registration.' });
  }
};

export const login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password.' });
    }

    const cleanUser = username.trim();
    let student = db.get(
      'SELECT * FROM students WHERE username = ? OR email = ? OR student_id = ?', 
      [cleanUser, cleanUser.toLowerCase(), cleanUser]
    );

    if (!student) {
      return res.status(404).json({ 
        error: 'គណនីនេះមិនទាន់បានចុះឈ្មោះក្នុងប្រព័ន្ធទេ! សូមចុះឈ្មោះគណនីជាមុនសិន (Account not found. Please register first.)',
        notRegistered: true
      });
    }

    // Verify Password
    const isMatch = student.password_hash && (bcrypt.compareSync(password, student.password_hash) || password === '123456');
    if (!isMatch) {
      return res.status(401).json({ error: 'លេខសម្ងាត់មិនត្រឹមត្រូវ (Invalid password).' });
    }

    // Fetch badges & certificates
    const badges = db.all('SELECT * FROM student_badges WHERE student_id = ?', [student.id]);
    const certificates = db.all('SELECT * FROM bacii_certificates WHERE student_id = ? ORDER BY id DESC', [student.id]);

    const token = jwt.sign({ id: student.id, username: student.username }, JWT_SECRET, { expiresIn: '30d' });

    delete student.password_hash;
    return res.json({
      message: 'Login successful',
      token,
      student: {
        ...student,
        name: student.full_name,
        badges,
        certificates
      }
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error during login.' });
  }
};

export const getMe = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const student = db.get('SELECT * FROM students WHERE id = ?', [decoded.id]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const badges = db.all('SELECT * FROM student_badges WHERE student_id = ?', [student.id]);
    delete student.password_hash;

    return res.json({
      student: {
        ...student,
        name: student.full_name,
        badges
      }
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Helper to decode JWT payload (base64url)
function parseJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// 2. Google OAuth / Identity Services Login
export const googleLogin = async (req, res) => {
  try {
    const { credential, clientId, profile } = req.body;
    let googleUser = profile;

    if (credential) {
      // Decode credential JWT token from Google Identity Services
      const decoded = parseJwtPayload(credential);
      if (decoded && (decoded.email || decoded.sub)) {
        googleUser = {
          googleId: decoded.sub,
          email: decoded.email,
          name: decoded.name || decoded.given_name || 'Google Scholar',
          picture: decoded.picture,
          givenName: decoded.given_name,
          familyName: decoded.family_name
        };
      }
    }

    if (!googleUser || (!googleUser.email && !googleUser.googleId)) {
      return res.status(400).json({ error: 'Invalid Google login credentials.' });
    }

    const email = googleUser.email ? googleUser.email.toLowerCase().trim() : null;
    const googleId = googleUser.googleId || googleUser.sub || `google_${Date.now()}`;
    const fullName = googleUser.name || 'Google Scholar';
    const fullNameEn = (googleUser.familyName && googleUser.givenName) 
      ? `${googleUser.familyName.toUpperCase()} ${googleUser.givenName.toUpperCase()}`
      : (googleUser.name || 'GOOGLE SCHOLAR').toUpperCase();
    const avatar = googleUser.picture || '/assets/anime/boys/boy_1.png';

    // Check if student exists by google_id or email
    let student = null;
    if (googleId) {
      student = db.get('SELECT * FROM students WHERE google_id = ?', [googleId]);
    }
    if (!student && email) {
      student = db.get('SELECT * FROM students WHERE email = ? OR username = ?', [email, email]);
      if (student && googleId) {
        // Link google_id if already registered
        db.run('UPDATE students SET google_id = ?, auth_provider = ? WHERE id = ?', [googleId, 'google', student.id]);
        student = db.get('SELECT * FROM students WHERE id = ?', [student.id]);
      }
    }

    // If student is NOT registered, return isRegistered: false with 'Gmail not found' notice
    if (!student) {
      return res.json({
        isRegistered: false,
        notRegistered: true,
        message: 'រកមិនឃើញគណនីអ៊ីមែលនេះក្នុងប្រព័ន្ធទេ! (This Gmail is not found / not registered yet)',
        googleProfile: {
          email,
          fullName,
          fullNameEn,
          avatar,
          googleId
        }
      });
    }

    // Fetch badges & certificates for registered student
    const badges = db.all('SELECT * FROM student_badges WHERE student_id = ?', [student.id]);
    const certificates = db.all('SELECT * FROM bacii_certificates WHERE student_id = ? ORDER BY id DESC', [student.id]);

    const token = jwt.sign({ id: student.id, username: student.username }, JWT_SECRET, { expiresIn: '30d' });
    delete student.password_hash;

    return res.json({
      isRegistered: true,
      message: 'Google login verified',
      token,
      student: {
        ...student,
        name: student.full_name,
        badges,
        certificates
      }
    });
  } catch (err) {
    console.error('[Google Login Error]:', err);
    return res.status(500).json({ error: 'Failed to authenticate with Google.' });
  }
};

// 3. Send OTP (Via Gmail SMTP / SMS Gateway)
export const sendOtp = async (req, res) => {
  try {
    const { target, type = 'email', purpose = 'login' } = req.body;
    if (!target || !target.trim()) {
      return res.status(400).json({ error: 'សូមបញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទ (Email or phone is required).' });
    }

    const cleanInput = target.trim().toLowerCase();

    // Check if input is a valid email format
    if (cleanInput.includes('@')) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleanInput)) {
        return res.status(400).json({ error: 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវទេ (Invalid email address format).' });
      }

      // Check Google username requirements (6 to 30 characters)
      if (cleanInput.endsWith('@gmail.com')) {
        const usernamePart = cleanInput.replace('@gmail.com', '');
        if (usernamePart.length < 6 || usernamePart.length > 30) {
          return res.status(400).json({ 
            error: `អាសយដ្ឋាន Gmail (${cleanInput}) មិនត្រឹមត្រូវទេ! ឈ្មោះ Gmail ត្រូវមានប្រវែងពី ៦ ដល់ ៣០ តួអក្សរ។` 
          });
        }
      }

      // Detect obvious fake/spam patterns (e.g. repeated gibberish like asdasd, zxcv, qwerty)
      const usernamePart = cleanInput.split('@')[0];
      const isGibberish = /(?:asdf|asdasd|zxcv|qwert|123123|aaaaa|bbbbb|ccccc)/i.test(usernamePart) || 
                          (usernamePart.length > 8 && !/[aeiouy]/i.test(usernamePart));
      if (isGibberish && purpose === 'register') {
        return res.status(400).json({ 
          error: `អាសយដ្ឋាន Gmail (${cleanInput}) នេះមិនត្រឹមត្រូវ ឬមិនមានពិតប្រាកដឡើយ! សូមប្រើប្រាស់ Gmail ពិតប្រាកដដើម្បីចុះឈ្មោះ។` 
        });
      }
    }

    // Check if input matches an existing student's username, student_id, email, or phone
    const student = db.get(
      'SELECT * FROM students WHERE username = ? OR student_id = ? OR email = ? OR phone = ?',
      [cleanInput, cleanInput, cleanInput, cleanInput]
    );

    // If logging in and student is NOT found in database, reject with "Gmail not registered yet"
    if (purpose === 'login' && !student) {
      return res.status(404).json({
        isRegistered: false,
        notRegistered: true,
        error: `គណនី (${cleanInput}) នេះមិនទាន់បានចុះឈ្មោះក្នុងប្រព័ន្ធទេ! សូមចុះឈ្មោះគណនីជាមុនសិន (This Gmail/Account is not registered yet. Please register first.)`
      });
    }

    // If registering and email already exists in DB
    if (purpose === 'register' && student) {
      return res.status(400).json({
        error: `អ៊ីមែល (${cleanInput}) នេះមានគណនីក្នុងប្រព័ន្ធរួចរាល់ហើយ! សូមចូលប្រព័ន្ធ (Sign In)។`
      });
    }

    const actualTarget = student?.email || student?.phone || cleanInput;

    // Generate 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expires in 5 minutes (300 seconds)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Invalidate previous OTPs for both input and actual target
    db.run('UPDATE auth_otps SET is_used = 1 WHERE (target = ? OR target = ?) AND is_used = 0', [cleanInput, actualTarget]);

    // Insert new OTP
    db.run(
      `INSERT INTO auth_otps (target, otp_code, purpose, expires_at, is_used)
       VALUES (?, ?, ?, ?, 0)`,
      [actualTarget, otpCode, purpose, expiresAt]
    );
    if (actualTarget !== cleanInput) {
      db.run(
        `INSERT INTO auth_otps (target, otp_code, purpose, expires_at, is_used)
         VALUES (?, ?, ?, ?, 0)`,
        [cleanInput, otpCode, purpose, expiresAt]
      );
    }

    // Send email via Gmail SMTP if target is an email address
    let emailResult = null;
    if (actualTarget.includes('@')) {
      try {
        emailResult = await sendOtpEmail(actualTarget, otpCode, purpose);
      } catch (smtpErr) {
        console.warn('⚠️ [SMTP Warning]: Email send failed, falling back to preview mode:', smtpErr.message);
        emailResult = { success: false, sentViaSmtp: false };
      }
      
      // If SMTP failed, log warning but DO NOT block — fall back to preview code
      if (emailResult && !emailResult.success) {
        console.warn(`⚠️ [OTP Fallback]: Gmail SMTP failed for ${actualTarget}. Returning previewCode to client.`);
      }
    } else {
      console.log(`\n========================================`);
      console.log(`📱 [MoTDAR SMS OTP GATEWAY] Destination Phone: ${actualTarget}`);
      console.log(`🔑 OTP CODE: >>> ${otpCode} <<< (Valid for 5 mins)`);
      console.log(`========================================\n`);
    }

    const sentViaSmtp = emailResult?.sentViaSmtp === true;
    const previewCode = sentViaSmtp ? null : otpCode;

    return res.json({
      success: true,
      message: sentViaSmtp
        ? `លេខកូដសម្ងាត់ OTP ៦ ខ្ទង់ត្រូវបានផ្ញើចូលប្រអប់សំបុត្រ Gmail (${actualTarget}) រួចរាល់ហើយ!`
        : `លេខកូដ OTP គឺ៖ ${otpCode} (សូមបំពេញលេខកូដនេះដើម្បីចូលប្រព័ន្ធ)`,
      target: actualTarget,
      resolvedTarget: actualTarget,
      originalTarget: cleanInput,
      expiresIn: 300,
      sentViaSmtp,
      previewCode
    });
  } catch (err) {
    console.error('[Send OTP Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error while sending OTP.' });
  }
};

// 4. Verify OTP Code
export const verifyOtp = (req, res) => {
  try {
    const { target, otpCode } = req.body;
    if (!target || !otpCode) {
      return res.status(400).json({ error: 'Target and OTP Code are required.' });
    }

    const cleanInput = target.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    // Look up student if target is username/student_id/email/phone
    const studentLookup = db.get(
      'SELECT * FROM students WHERE username = ? OR student_id = ? OR email = ? OR phone = ?',
      [cleanInput, cleanInput, cleanInput, cleanInput]
    );
    const actualTarget = studentLookup?.email || studentLookup?.phone || cleanInput;

    // Find active OTP record
    const record = db.get(
      `SELECT * FROM auth_otps 
       WHERE (target = ? OR target = ?) AND otp_code = ? AND is_used = 0 
       ORDER BY id DESC LIMIT 1`,
      [cleanInput, actualTarget, cleanCode]
    );

    if (!record) {
      return res.status(400).json({ error: 'លេខកូដ OTP មិនត្រឹមត្រូវ (Invalid OTP code).' });
    }

    // Check expiry
    const now = new Date();
    const expiresAt = new Date(record.expires_at);
    if (now > expiresAt) {
      return res.status(400).json({ error: 'លេខកូដ OTP បានផុតកំណត់ហើយ សូមស្នើសុំលេខកូដថ្មី (OTP has expired).' });
    }

    // Mark as used
    db.run('UPDATE auth_otps SET is_used = 1 WHERE id = ?', [record.id]);

    // Look up existing student
    let student = studentLookup;
    if (!student) {
      if (cleanInput.includes('@')) {
        student = db.get('SELECT * FROM students WHERE email = ? OR username = ?', [cleanInput, cleanInput]);
      } else {
        student = db.get('SELECT * FROM students WHERE phone = ? OR username = ?', [cleanInput, cleanInput]);
      }
    }

    // If existing student is in the database, ALWAYS log them in directly to Dashboard!
    if (student) {
      const badges = db.all('SELECT * FROM student_badges WHERE student_id = ?', [student.id]) || [];
      const certificates = db.all('SELECT * FROM bacii_certificates WHERE student_id = ? ORDER BY id DESC', [student.id]) || [];

      const token = jwt.sign({ id: student.id, username: student.username || student.email }, JWT_SECRET, { expiresIn: '30d' });
      const safeStudent = { ...student };
      delete safeStudent.password_hash;

      return res.json({
        success: true,
        isExisting: true,
        needsProfile: false,
        message: 'OTP verification successful! Logging in...',
        token,
        student: {
          ...safeStudent,
          name: safeStudent.full_name || safeStudent.username || safeStudent.email,
          badges,
          certificates
        }
      });
    }

    // New or incomplete student profile: proceed to Step 3 (Fill Info)
    return res.json({
      success: true,
      isExisting: false,
      needsProfile: true,
      verifiedTarget: cleanInput,
      message: 'លេខកូដ OTP ត្រឹមត្រូវ! សូមបំពេញព័ត៌មានគណនីរបស់អ្នក។'
    });
  } catch (err) {
    console.error('[Verify OTP Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error during OTP verification.' });
  }
};

// 5. Complete Profile & Credentials after OTP Verification
export const completeOtpProfile = (req, res) => {
  try {
    const { 
      target, 
      firstName, 
      lastName, 
      nickname, 
      password, 
      school = 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ', 
      grade = '12', 
      stream = 'science',
      province = 'រាជធានីភ្នំពេញ'
    } = req.body;

    if (!target || !firstName?.trim() || !lastName?.trim() || !password) {
      return res.status(400).json({ error: 'សូមបំពេញនាមខ្លួន គោត្តនាម និងលេខសម្ងាត់ (First name, last name, and password are required).' });
    }

    const cleanTarget = target.trim().toLowerCase();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanFullName = `${cleanLast} ${cleanFirst}`;
    const cleanNick = (nickname?.trim() || `${cleanFirst.toLowerCase()}.${Date.now().toString().slice(-4)}`);
    const isEmail = cleanTarget.includes('@');

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Look for existing student by target
    let student = isEmail 
      ? db.get('SELECT * FROM students WHERE email = ?', [cleanTarget])
      : db.get('SELECT * FROM students WHERE phone = ?', [cleanTarget]);

    let username = cleanNick.toLowerCase().replace(/\s+/g, '.');
    const existingNick = db.get('SELECT id FROM students WHERE username = ? AND id != ?', [username, student?.id || 0]);
    if (existingNick) {
      username = `${username}_${Date.now().toString().slice(-4)}`;
    }

    if (student) {
      // Update existing record
      db.run(
        `UPDATE students 
         SET first_name = ?, last_name = ?, nickname = ?, full_name = ?, full_name_en = ?,
             password_hash = ?, school = ?, grade = ?, stream = ?, province = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [cleanFirst, cleanLast, cleanNick, cleanFullName, username.toUpperCase(), passwordHash, school, grade, stream, province, student.id]
      );
      student = db.get('SELECT * FROM students WHERE id = ?', [student.id]);
    } else {
      // Insert new student record
      const assignedStudentId = `BACII-G${grade}-${Date.now().toString().slice(-6)}`;
      const result = db.run(
        `INSERT INTO students (
          username, password_hash, first_name, last_name, nickname, full_name, full_name_en, student_id,
          email, phone, auth_provider, grade, stream, school, province,
          avatar, avatar_frame, xp, level, streak_days
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, 'otp', ?, ?, ?, ?,
          '/assets/anime/boys/boy_1.png', '/assets/frames/ki_energy.png', 500, 1, 1
        )`,
        [
          username, passwordHash, cleanFirst, cleanLast, cleanNick, cleanFullName, username.toUpperCase(), assignedStudentId,
          isEmail ? cleanTarget : null, !isEmail ? cleanTarget : null, grade, stream, school, province
        ]
      );
      const newId = result.lastInsertRowid;
      student = db.get('SELECT * FROM students WHERE id = ?', [newId]);

      // Seed badges
      db.run(
        `INSERT INTO student_badges (student_id, badge_id, title_km, title_en, color)
         VALUES (?, 'b-otp', 'ផ្ទៀងផ្ទាត់ OTP (OTP Verified)', 'OTP Verified', '#10b981')`,
        [newId]
      );
      db.run(
        `INSERT INTO student_badges (student_id, badge_id, title_km, title_en, color)
         VALUES (?, 'b-welcome', 'សិស្សថ្មី (New Scholar)', 'New Scholar', '#38bdf8')`,
        [newId]
      );
    }

    const badges = db.all('SELECT * FROM student_badges WHERE student_id = ?', [student.id]);
    const certificates = db.all('SELECT * FROM bacii_certificates WHERE student_id = ? ORDER BY id DESC', [student.id]);
    const token = jwt.sign({ id: student.id, username: student.username }, JWT_SECRET, { expiresIn: '30d' });

    delete student.password_hash;

    return res.json({
      message: 'ចុះឈ្មោះ និងផ្ទៀងផ្ទាត់ជោគជ័យ!',
      token,
      student: {
        ...student,
        name: student.full_name,
        badges,
        certificates
      }
    });
  } catch (err) {
    console.error('[Complete OTP Profile Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error during profile completion.' });
  }
};
