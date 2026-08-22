import db from '../config/db.js';

// Save Generated Bac II Certificate
export const saveCertificate = (req, res) => {
  try {
    const {
      studentId,
      certificateNo,
      stream,
      overallGrade,
      overallTextKm,
      totalScore,
      maxPossible = 525,
      percentage,
      subjectScoresJson,
      issuedDate
    } = req.body;

    if (!studentId || !certificateNo) {
      return res.status(400).json({ error: 'Student ID and Certificate Number are required.' });
    }

    const qrHash = `MOEYS-BACII-${certificateNo}-${Date.now()}`;

    const result = db.run(
      `INSERT INTO bacii_certificates (
        student_id, certificate_no, stream, overall_grade, overall_text_km,
        total_score, max_possible, percentage, subject_scores_json, issued_date, qr_verify_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), ?)`,
      [
        studentId,
        certificateNo,
        stream,
        overallGrade,
        overallTextKm || '',
        totalScore,
        maxPossible,
        percentage,
        typeof subjectScoresJson === 'object' ? JSON.stringify(subjectScoresJson) : subjectScoresJson,
        issuedDate,
        qrHash
      ]
    );

    return res.status(201).json({
      message: 'Certificate saved to database',
      certificateId: result.lastInsertRowid,
      qrHash
    });
  } catch (err) {
    console.error('[Save Certificate Error]:', err);
    return res.status(500).json({ error: 'Failed to save certificate record.' });
  }
};

// Get Certificates by Student ID
export const getStudentCertificates = (req, res) => {
  try {
    const { studentId } = req.params;
    const certs = db.all(
      'SELECT * FROM bacii_certificates WHERE student_id = ? ORDER BY id DESC',
      [studentId]
    );
    return res.json({ certificates: certs });
  } catch (err) {
    console.error('[Get Certificates Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve certificates.' });
  }
};
