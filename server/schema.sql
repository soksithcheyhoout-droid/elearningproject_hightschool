-- ==========================================================
-- NATIONAL HIGH SCHOOL DIGITAL LEARNING PORTAL - DATABASE SCHEMA
-- Ministry of Talent Development & Advanced Research (MoEYS)
-- Supports MySQL / MariaDB / SQLite
-- ==========================================================

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    avatar TEXT DEFAULT '/assets/anime/boys/boy_1.png',
    avatar_frame TEXT DEFAULT '/assets/frames/ki_energy.png',
    xp INTEGER DEFAULT 500,
    level INTEGER DEFAULT 1,
    rank_title_km VARCHAR(150) DEFAULT 'អ្នកសិក្សាដំបូង (Novice Scholar)',
    rank_title_en VARCHAR(150) DEFAULT 'Novice Scholar',
    streak_days INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target VARCHAR(150) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) DEFAULT 'login',
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bacii_certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    certificate_no VARCHAR(100) UNIQUE NOT NULL,
    stream VARCHAR(50) NOT NULL,
    overall_grade VARCHAR(10) NOT NULL,
    overall_text_km VARCHAR(100),
    total_score DECIMAL(6, 2) NOT NULL,
    max_possible INTEGER DEFAULT 525,
    percentage INTEGER NOT NULL,
    subject_scores_json TEXT,
    issued_date DATE,
    qr_verify_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    quiz_id VARCHAR(100) NOT NULL,
    quiz_title VARCHAR(200),
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    xp_earned INTEGER DEFAULT 100,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    badge_id VARCHAR(100) NOT NULL,
    title_km VARCHAR(150) NOT NULL,
    title_en VARCHAR(150) NOT NULL,
    icon VARCHAR(50) DEFAULT 'Award',
    color VARCHAR(50) DEFAULT '#fbbf24',
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arena_matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER,
    subject VARCHAR(50) DEFAULT 'math',
    winner_id INTEGER,
    p1_score INTEGER DEFAULT 0,
    p2_score INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 500,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES students(id) ON DELETE CASCADE
);
