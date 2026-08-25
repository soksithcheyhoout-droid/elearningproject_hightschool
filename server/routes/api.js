import express from 'express';
import { register, login, getMe, googleLogin, sendOtp, verifyOtp, completeOtpProfile } from '../controllers/authController.js';
import { 
  updateProfile, 
  uploadAvatar, 
  upload, 
  addXP, 
  getLeaderboard,
  getRegisteredStudents 
} from '../controllers/studentController.js';
import { saveCertificate, getStudentCertificates } from '../controllers/certificateController.js';
import { recordQuizResult } from '../controllers/quizController.js';
import { 
  createOrGetRoom, 
  joinRoom, 
  getRoom, 
  updateRoomStatus, 
  leaveRoom,
  submitTurnAnswer,
  nextTurn,
  requestRematch,
  kickChallenger,
  sendInvite,
  getStudentInvites,
  respondInvite,
  getRoomInviteStatus
} from '../controllers/arenaRoomController.js';

const router = express.Router();

// 0. Health Check Endpoint (Ultra-fast keep-alive for UptimeRobot / Ping)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    system: 'MoTDAR National E-Learning API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 1. Authentication Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/google-login', googleLogin);
router.post('/auth/send-otp', sendOtp);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/complete-otp-profile', completeOtpProfile);
router.get('/auth/me', getMe);

// 2. Student Profile & Custom PF (Avatar) Upload
router.get('/students', getRegisteredStudents);
router.put('/students/profile/:id', updateProfile);
router.post('/students/upload-avatar', upload.single('avatar'), uploadAvatar);
router.post('/students/:id/xp', addXP);
router.get('/leaderboard', getLeaderboard);

// 3. Bac II Certificates
router.post('/certificates/save', saveCertificate);
router.get('/certificates/student/:studentId', getStudentCertificates);

// 4. Quiz & Exam Scoring
router.post('/quizzes/record', recordQuizResult);

// 5. Real-Time Arena Multiplayer Rooms (Turn-Based Engine)
router.post('/arena/room/create', createOrGetRoom);
router.post('/arena/room/join', joinRoom);
router.get('/arena/room/:roomCode', getRoom);
router.put('/arena/room/:roomCode', updateRoomStatus);
router.post('/arena/room/:roomCode/kick', kickChallenger);
router.post('/arena/room/:roomCode/submit-turn', submitTurnAnswer);
router.post('/arena/room/:roomCode/next-turn', nextTurn);
router.post('/arena/room/:roomCode/rematch', requestRematch);
router.post('/arena/room/:roomCode/leave', leaveRoom);
router.get('/arena/invitations/:studentId', getStudentInvites);
router.post('/arena/invite/send', sendInvite);
router.post('/arena/invite/respond', respondInvite);
router.get('/arena/invite/status/:roomCode', getRoomInviteStatus);

import {
  getChannelMessages,
  getChatOverview,
  sendChannelMessage,
  toggleReaction,
  clearChannel,
  deleteMessage,
  uploadChatMedia,
  uploadChatMediaMulter
} from '../controllers/chatController.js';

import {
  adminLogin,
  getAdminStats,
  getAllStudents as getAdminStudents,
  updateStudent as updateAdminStudent,
  deleteStudent as deleteAdminStudent,
  getAllChatMessages as getAdminMessages,
  broadcastAnnouncement,
  getAllExams,
  createExam,
  deleteExam,
  getAllCertificates
} from '../controllers/adminController.js';

// 6. Real-Time Match Invitations
router.post('/arena/invite', sendInvite);
router.get('/arena/invitations/:studentId', getStudentInvites);
router.post('/arena/invite/:inviteId/respond', respondInvite);
router.get('/arena/invite/status/:roomCode', getRoomInviteStatus);

// 7. Real-Time National Chat Channels & DMs (Live Database)
router.get('/chat/overview', getChatOverview);
router.get('/chat/messages', getChannelMessages);
router.post('/chat/messages', sendChannelMessage);
router.post('/chat/upload', uploadChatMediaMulter.single('file'), uploadChatMedia);
router.post('/chat/messages/:id/react', toggleReaction);
router.delete('/chat/messages/:id', deleteMessage);
router.delete('/chat/messages', clearChannel);

// 8. Super Admin Management & Control Center
router.post('/admin/login', adminLogin);
router.get('/admin/stats', getAdminStats);
router.get('/admin/students', getAdminStudents);
router.put('/admin/students/:id', updateAdminStudent);
router.delete('/admin/students/:id', deleteAdminStudent);
router.get('/admin/messages', getAdminMessages);
router.delete('/admin/messages/:id', deleteMessage);
router.post('/admin/announcement', broadcastAnnouncement);

// 9. Exams & Bac II Management (Public + Admin)
router.get('/admin/exams', getAllExams);
router.post('/admin/exams', createExam);
import { generateBakongKhqr, checkBakongStatus } from '../controllers/bakongController.js';
import { generateAbaQr, checkAbaPayment } from '../controllers/abaPaywayController.js';
import { synthesizeSpeech, getVoiceProfiles } from '../controllers/ttsController.js';
import { handleAIChat } from '../controllers/aiTutorController.js';

// 10. Bakong KHQR Payment & Bypass Gateway (Merchant: hut_soksitchey1@aclb)
router.post('/bakong/generate-khqr', generateBakongKhqr);
router.get('/bakong/check/:md5', checkBakongStatus);

// 10.1 ABA Bank PayWay KHQR Payment Gateway (Direct ABA Merchant Integration)
router.post('/aba/generate-qr', generateAbaQr);
router.post('/aba/check-payment', checkAbaPayment);

// 11. Ultra-Realistic Neural Human Voice Engine (Microsoft Edge Neural TTS: Piseth & Sreymom)
router.get('/tts/voices', getVoiceProfiles);
router.get('/tts', synthesizeSpeech);
router.post('/tts', synthesizeSpeech);

// 12. MoTDAR AI Tutor & Deep Khmer Academic Comprehension Engine
router.post('/ai/chat', handleAIChat);
router.get('/ai/chat', handleAIChat);

import { getQuestionBankStats, getQuestionsFromPool } from '../controllers/questionBankController.js';

// 13. Master 12,000 National Examination Question Pool (6,000 Science + 6,000 Social)
router.get('/questions/stats', getQuestionBankStats);
router.get('/questions/master-pool', getQuestionsFromPool);

export default router;

