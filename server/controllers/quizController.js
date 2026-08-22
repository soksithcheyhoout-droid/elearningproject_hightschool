import db from '../config/db.js';

// Record Quiz / Mock Test Result
export const recordQuizResult = (req, res) => {
  try {
    const { studentId, quizId, quizTitle, score, total, xpEarned = 100 } = req.body;

    if (!studentId || !quizId) {
      return res.status(400).json({ error: 'Student ID and Quiz ID are required.' });
    }

    const result = db.run(
      `INSERT INTO quiz_results (student_id, quiz_id, quiz_title, score, total, xp_earned)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [studentId, quizId, quizTitle || quizId, score, total, xpEarned]
    );

    // Increment student XP & update level
    const student = db.get('SELECT xp FROM students WHERE id = ?', [studentId]);
    if (student) {
      const newXP = student.xp + xpEarned;
      const newLevel = Math.max(1, Math.floor(newXP / 500) + 1);
      db.run('UPDATE students SET xp = ?, level = ? WHERE id = ?', [newXP, newLevel, studentId]);
    }

    return res.status(201).json({
      message: 'Quiz result recorded successfully',
      resultId: result.lastInsertRowid,
      xpEarned
    });
  } catch (err) {
    console.error('[Quiz Record Error]:', err);
    return res.status(500).json({ error: 'Failed to record quiz result.' });
  }
};
