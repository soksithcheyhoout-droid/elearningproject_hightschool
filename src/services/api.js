// ==========================================================
// MOEYS DIGITAL LEARNING PORTAL - CLIENT API SERVICE
// Connects to Integrated High-Performance Backend at /api
// ==========================================================

const API_BASE = '/api';
const UPLOADS_BASE = '';

// High-Performance In-Memory SWR Cache for sub-millisecond tab switching
const apiCache = new Map();

export const clearApiCache = (key) => {
  if (key) apiCache.delete(key);
  else apiCache.clear();
};

// Instant Non-Blocking Health Probe (Wakes up Render free-tier dyno immediately)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    fetch(`${API_BASE}/health`, { cache: 'no-store' }).catch(() => {});
  }, 100);
}

export const api = {
  // Format avatar URL
  formatAvatarUrl: (avatarPath) => {
    if (!avatarPath) return '/assets/anime/boys/boy_2.png';
    if (avatarPath.startsWith('http://localhost:5000/uploads')) {
      return avatarPath.replace('http://localhost:5000', '');
    }
    return avatarPath;
  },

  // 1. Authentication
  login: async (credentials) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) {
        const error = new Error(data.error || 'Login failed');
        error.data = data;
        throw error;
      }
      return data;
    } catch (err) {
      console.warn('[API Login Warning]:', err.message);
      throw err;
    }
  },

  googleLogin: async (googlePayload) => {
    try {
      const res = await fetch(`${API_BASE}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googlePayload)
      });
      const data = await res.json();
      if (!res.ok) {
        const error = new Error(data.error || 'Google login failed');
        error.data = data;
        throw error;
      }
      return data;
    } catch (err) {
      console.warn('[API Google Login Warning]:', err.message);
      throw err;
    }
  },

  sendOtp: async ({ target, type = 'email', purpose = 'login' }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, type, purpose })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      return data;
    } catch (err) {
      console.warn('[API Send OTP Warning]:', err.message);
      throw err;
    }
  },

  verifyOtp: async ({ target, otpCode }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, otpCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');
      return data;
    } catch (err) {
      console.warn('[API Verify OTP Warning]:', err.message);
      throw err;
    }
  },

  completeOtpProfile: async (profilePayload) => {
    try {
      const res = await fetch(`${API_BASE}/auth/complete-otp-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profile setup failed');
      return data;
    } catch (err) {
      console.warn('[API Complete OTP Profile Warning]:', err.message);
      throw err;
    }
  },

  register: async (studentData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } catch (err) {
      console.warn('[API Register Warning]:', err.message);
      throw err;
    }
  },

  // 2. Custom Student Profile Picture (PF) Upload
  uploadProfilePicture: async (studentId, file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      if (studentId) formData.append('studentId', studentId);

      const res = await fetch(`${API_BASE}/students/upload-avatar`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Avatar upload failed');
      return data;
    } catch (err) {
      console.error('[Upload PF Error]:', err);
      throw err;
    }
  },

  // 3. Update Profile (Live Sync across all clients & backend)
  updateProfile: async (studentId, updatedFields) => {
    // 1. Update shared live client cache
    try {
      const allProfiles = JSON.parse(localStorage.getItem('khmer_elearn_all_profiles') || '{}');
      const sId = studentId ? String(studentId) : null;
      const sUname = updatedFields.username ? updatedFields.username.toLowerCase() : null;
      const sEmail = updatedFields.email ? updatedFields.email.toLowerCase() : null;

      // Find existing profile
      let existing = null;
      for (const [k, v] of Object.entries(allProfiles)) {
        if (
          (sId && (k === sId || (v && String(v.id) === sId))) ||
          (sUname && (k === sUname || (v && v.username && v.username.toLowerCase() === sUname))) ||
          (sEmail && (k === sEmail || (v && v.email && v.email.toLowerCase() === sEmail)))
        ) {
          existing = v;
          break;
        }
      }

      const merged = {
        ...(existing || {}),
        ...updatedFields,
        avatarFrame: updatedFields.avatarFrame !== undefined ? updatedFields.avatarFrame : (updatedFields.avatar_frame !== undefined ? updatedFields.avatar_frame : (existing?.avatarFrame || '')),
        avatar_frame: updatedFields.avatar_frame !== undefined ? updatedFields.avatar_frame : (updatedFields.avatarFrame !== undefined ? updatedFields.avatarFrame : (existing?.avatar_frame || '')),
        updatedAt: Date.now()
      };

      if (studentId) allProfiles[String(studentId)] = merged;
      if (merged.id) allProfiles[String(merged.id)] = merged;
      if (merged.username) {
        allProfiles[merged.username] = merged;
        try {
          localStorage.setItem(`profile_${merged.username}`, JSON.stringify(merged));
        } catch (e) {}
      }
      if (merged.email) allProfiles[merged.email] = merged;

      localStorage.setItem('khmer_elearn_all_profiles', JSON.stringify(allProfiles));

      // Broadcast live event across browser tabs / windows
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('khmer_elearn_profile_sync');
        bc.postMessage({ type: 'PROFILE_UPDATED', studentId, updatedFields: merged });
      }
    } catch (e) {}

    // 2. Persist to Backend Database
    try {
      const res = await fetch(`${API_BASE}/students/profile/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profile update failed');
      return data;
    } catch (err) {
      return { success: true, student: updatedFields };
    }
  },

  // 4. Bac II Certificates
  saveCertificate: async (certificateData) => {
    try {
      const res = await fetch(`${API_BASE}/certificates/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData)
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Certificate Save Warning]:', err.message);
      return null;
    }
  },

  // 5. Quiz Records
  recordQuiz: async (quizResult) => {
    try {
      const res = await fetch(`${API_BASE}/quizzes/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizResult)
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Quiz Record Warning]:', err.message);
      return null;
    }
  },

  // 6. Leaderboard & Registered Students
  getLeaderboard: async () => {
    const cacheKey = 'leaderboard_cache';
    const cached = apiCache.get(cacheKey);
    const now = Date.now();
    if (cached && (now - cached.ts < 10000)) {
      return cached.data;
    }

    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        apiCache.set(cacheKey, { data, ts: now });
        return data;
      }
      return cached?.data || { leaderboard: [] };
    } catch (err) {
      if (cached?.data) return cached.data;
      console.warn('[API Leaderboard Warning]:', err.message);
      return { leaderboard: [] };
    }
  },

  getRegisteredStudents: async () => {
    // Helper: collect and unify student profiles across localStorage
    const collectLocalProfiles = () => {
      const studentMap = {};

      const mergeIntoMap = (obj) => {
        if (!obj || (!obj.id && !obj.username && !obj.email && !obj.name)) return;
        const idKey = obj.id ? String(obj.id) : null;
        const unameKey = obj.username ? obj.username.toLowerCase() : null;
        const emailKey = obj.email ? obj.email.toLowerCase() : null;

        let targetKey = null;
        for (const [k, existing] of Object.entries(studentMap)) {
          if (
            (idKey && existing.id && String(existing.id) === idKey) ||
            (unameKey && existing.username && existing.username.toLowerCase() === unameKey) ||
            (emailKey && existing.email && existing.email.toLowerCase() === emailKey)
          ) {
            targetKey = k;
            break;
          }
        }

        if (!targetKey) {
          targetKey = idKey || unameKey || emailKey;
          studentMap[targetKey] = { ...obj };
        } else {
          studentMap[targetKey] = {
            ...studentMap[targetKey],
            ...obj,
            avatar: obj.avatar || studentMap[targetKey].avatar,
            avatarFrame: obj.avatarFrame !== undefined && obj.avatarFrame !== '' 
              ? obj.avatarFrame 
              : (obj.avatar_frame !== undefined && obj.avatar_frame !== '' ? obj.avatar_frame : (studentMap[targetKey].avatarFrame || '')),
            avatar_frame: obj.avatar_frame !== undefined && obj.avatar_frame !== '' 
              ? obj.avatar_frame 
              : (obj.avatarFrame !== undefined && obj.avatarFrame !== '' ? obj.avatarFrame : (studentMap[targetKey].avatar_frame || ''))
          };
        }
      };

      try {
        // 1. Current active student on this tab
        const active = JSON.parse(localStorage.getItem('khmer_elearn_student') || 'null');
        if (active) mergeIntoMap(active);

        // 2. All cached profile updates
        const allP = JSON.parse(localStorage.getItem('khmer_elearn_all_profiles') || '{}');
        for (const v of Object.values(allP)) {
          if (v) mergeIntoMap(v);
        }

        // 3. Per-user profile keys (profile_<username>)
        for (let i = 0; i < localStorage.length; i++) {
          const lsKey = localStorage.key(i);
          if (lsKey && lsKey.startsWith('profile_')) {
            try {
              const p = JSON.parse(localStorage.getItem(lsKey));
              if (p) mergeIntoMap(p);
            } catch (e) {}
          }
        }
      } catch (e) {}

      return studentMap;
    };

    // Helper: normalize a student record so avatar_frame & avatarFrame are consistent
    const normalize = (s) => {
      const frame = s.avatarFrame !== undefined && s.avatarFrame !== null && s.avatarFrame !== ''
        ? s.avatarFrame 
        : (s.avatar_frame !== undefined && s.avatar_frame !== null ? s.avatar_frame : '');
      const avatar = s.avatar || '/assets/anime/boys/boy_1.png';

      return {
        ...s,
        avatarFrame: frame,
        avatar_frame: frame,
        full_name: s.full_name || s.fullName || s.name || s.username || '',
        avatar: api.formatAvatarUrl(avatar)
      };
    };

    // 0. Check in-memory cache
    const cacheKey = 'students_cache';
    const cached = apiCache.get(cacheKey);
    const now = Date.now();
    if (cached && (now - cached.ts < 8000)) {
      return cached.data;
    }

    // 1. Fetch from backend server (Database is THE ONLY source of truth)
    try {
      const res = await fetch(`${API_BASE}/students`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.students) && data.students.length > 0) {
          const students = data.students.map(s => normalize(s));
          const result = { students };
          apiCache.set(cacheKey, { data: result, ts: now });
          return result;
        }
      }
    } catch (err) {}

    // 2. Fallback ONLY if server is completely unreachable
    const localProfiles = collectLocalProfiles();
    const uniqueStudents = Object.values(localProfiles).map(p => normalize(p));

    if (uniqueStudents.length > 0) {
      return { students: uniqueStudents };
    }

    return { students: [] };
  },

  // 7. Arena Real-Time Multiplayer Rooms
  createArenaRoom: async (roomCode, gameId, subject, hostStudent, questions, grade = '12', stream = 'science') => {
    const roomState = {
      roomCode,
      gameId,
      subject,
      grade,
      stream,
      host: hostStudent,
      challenger: null,
      challengerReady: false,
      status: 'waiting',
      activeTurn: 'host',
      questions,
      hostScore: 0,
      challengerScore: 0,
      hostCorrectCount: 0,
      challengerCorrectCount: 0,
      createdAt: Date.now()
    };
    try {
      localStorage.setItem(`arena_room_${roomCode}`, JSON.stringify(roomState));
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/arena/room/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, gameId, subject, hostStudent, questions, grade, stream })
      });
      return await res.json();
    } catch (err) {
      return { success: true, room: roomState };
    }
  },

  joinArenaRoom: async (roomCode, student) => {
    try {
      const saved = localStorage.getItem(`arena_room_${roomCode}`);
      if (saved) {
        const room = JSON.parse(saved);
        room.challenger = student;
        room.status = 'ready';
        localStorage.setItem(`arena_room_${roomCode}`, JSON.stringify(room));
      }
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/arena/room/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, student })
      });
      return await res.json();
    } catch (err) {
      try {
        const saved = localStorage.getItem(`arena_room_${roomCode}`);
        return { success: true, room: saved ? JSON.parse(saved) : null };
      } catch (e) {
        return null;
      }
    }
  },

  getArenaRoom: async (roomCode) => {
    try {
      const res = await fetch(`${API_BASE}/arena/room/${roomCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.room) return data;
      }
    } catch (err) {}

    try {
      const saved = localStorage.getItem(`arena_room_${roomCode}`);
      if (saved) {
        return { success: true, room: JSON.parse(saved) };
      }
    } catch (e) {}

    return null;
  },

  updateArenaRoom: async (roomCode, updates) => {
    try {
      const saved = localStorage.getItem(`arena_room_${roomCode}`);
      if (saved) {
        const room = { ...JSON.parse(saved), ...updates };
        localStorage.setItem(`arena_room_${roomCode}`, JSON.stringify(room));
      }
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/arena/room/${roomCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  submitTurnAnswer: async (roomCode, isHost, selectedIdx, isCorrect, scoreEarned, isTimeout = false) => {
    try {
      const saved = localStorage.getItem(`arena_room_${roomCode}`);
      if (saved) {
        const room = JSON.parse(saved);
        if (isHost) {
          room.hostScore = (room.hostScore || 0) + scoreEarned;
          if (isCorrect) room.hostCorrectCount = (room.hostCorrectCount || 0) + 1;
        } else {
          room.challengerScore = (room.challengerScore || 0) + scoreEarned;
          if (isCorrect) room.challengerCorrectCount = (room.challengerCorrectCount || 0) + 1;
        }
        localStorage.setItem(`arena_room_${roomCode}`, JSON.stringify(room));
      }
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/arena/room/${roomCode}/submit-turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHost, selectedIdx, isCorrect, scoreEarned, isTimeout })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  nextTurn: async (roomCode, expectedQIndex = null, extraQuestions = []) => {
    try {
      let qIndex = expectedQIndex;
      let extras = extraQuestions;
      if (Array.isArray(expectedQIndex)) {
        extras = expectedQIndex;
        qIndex = null;
      }
      const res = await fetch(`${API_BASE}/arena/room/${roomCode}/next-turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expectedQIndex: qIndex, extraQuestions: extras })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  requestArenaRematch: async (roomCode, isHost, newQuestions = []) => {
    try {
      const res = await fetch(`${API_BASE}/arena/room/${roomCode}/rematch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHost, newQuestions })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  kickChallenger: async (roomCode, challengerId) => {
    try {
      const res = await fetch(`${API_BASE}/arena/room/${roomCode}/kick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengerId })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  sendMatchInvite: async (fromStudent, toStudentId, roomCode, subject, gameTitle) => {
    const inviteId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const inviteObj = {
      id: inviteId,
      fromStudent,
      toStudentId: String(toStudentId),
      roomCode,
      subject,
      gameTitle,
      status: 'pending',
      timestamp: Date.now()
    };

    // Instant multi-tab synchronization via localStorage & BroadcastChannel
    try {
      const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
      const clean = active.filter(i => Date.now() - i.timestamp < 25000);
      clean.push(inviteObj);
      localStorage.setItem('khmer_elearn_invites', JSON.stringify(clean));

      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('khmer_elearn_arena_channel');
        bc.postMessage({ type: 'NEW_INVITE', invite: inviteObj });
      }
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/arena/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromStudent, toStudentId, roomCode, subject, gameTitle })
      });
      return await res.json();
    } catch (err) {
      return { success: true, inviteId };
    }
  },

  cancelMatchInvite: async (roomCode, toStudentId) => {
    try {
      const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
      const cleaned = active.filter(i => !(i.roomCode === roomCode && (!toStudentId || String(i.toStudentId) === String(toStudentId))));
      localStorage.setItem('khmer_elearn_invites', JSON.stringify(cleaned));

      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('khmer_elearn_arena_channel');
        bc.postMessage({ type: 'CANCEL_INVITE', roomCode, toStudentId });
      }
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/arena/invite/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, toStudentId })
      });
      return await res.json();
    } catch (err) {
      return { success: true };
    }
  },

  getStudentInvites: async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/arena/invitations/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.invites)) {
          // Keep local storage in sync with authoritative server state
          try {
            const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
            const activeServerIds = new Set(data.invites.map(i => i.id));
            const synced = active.filter(i => activeServerIds.has(i.id));
            localStorage.setItem('khmer_elearn_invites', JSON.stringify(synced));
          } catch (e) {}
          return data;
        }
      }
    } catch (err) {}

    // Fallback only if offline / server disconnected
    let localInvites = [];
    try {
      const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
      localInvites = active.filter(i => 
        (String(i.toStudentId) === String(studentId) || (i.toUsername && i.toUsername === studentId)) && 
        i.status === 'pending' && 
        Date.now() - i.timestamp < 25000
      );
    } catch (e) {}

    return { invites: localInvites };
  },

  respondMatchInvite: async (inviteId, student, accept) => {
    try {
      const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
      const updated = active.map(i => {
        if (i.id === inviteId) {
          return { ...i, status: accept ? 'accepted' : 'declined', challenger: student };
        }
        return i;
      });
      localStorage.setItem('khmer_elearn_invites', JSON.stringify(updated));

      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('khmer_elearn_arena_channel');
        bc.postMessage({ type: 'INVITE_RESPONSE', inviteId, accept, student });
      }
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/arena/invite/${inviteId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student, accept })
      });
      const data = await res.json();
      if (!res.ok || data.error || data.canceled) {
        return { success: false, canceled: true, error: data?.error || 'ការអញ្ជើញត្រូវបានបោះបង់ហើយ' };
      }
      return data;
    } catch (err) {
      return { success: false, error: 'Network connection failed' };
    }
  },

  getRoomInviteStatus: async (roomCode) => {
    let localInvites = [];
    try {
      const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
      localInvites = active.filter(i => i.roomCode === roomCode);
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/arena/invite/status/${roomCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.invites)) {
          return data;
        }
      }
    } catch (err) {}

    return { invites: localInvites };
  },

  leaveArenaRoom: async (roomCode, studentId, username) => {
    try {
      const res = await fetch(`${API_BASE}/arena/room/${roomCode}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, username })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // 7. Real-Time Chat System (Database Driven)
  getChatOverview: async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/overview`);
      if (!res.ok) return { latestByChannel: {} };
      return await res.json();
    } catch (err) {
      return { latestByChannel: {} };
    }
  },

  getChatMessages: async (channel = 'global') => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages?channel=${encodeURIComponent(channel)}`);
      if (!res.ok) return { messages: [] };
      return await res.json();
    } catch (err) {
      return { messages: [] };
    }
  },

  sendChatMessage: async (messagePayload) => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload)
      });
      return await res.json();
    } catch (err) {
      console.error('[Send Chat Error]:', err);
      return null;
    }
  },

  uploadChatMedia: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/chat/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Media upload failed');
      return data;
    } catch (err) {
      console.error('[Upload Chat Media Error]:', err);
      throw err;
    }
  },

  toggleChatReaction: async (messageId, emoji, studentId) => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages/${messageId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, studentId })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  deleteChatMessage: async (messageId, studentId, username) => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, username })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  clearChatChannel: async (channel = 'global') => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages?channel=${encodeURIComponent(channel)}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // 8. Admin Control Center API
  adminLogin: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (err) {
      return { error: 'Network error during admin login' };
    }
  },

  getAdminStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  getAdminStudents: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/students`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  updateAdminStudent: async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  deleteAdminStudent: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/students/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  getAdminMessages: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/messages`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  broadcastAdminAnnouncement: async (announcementText, adminName) => {
    try {
      const res = await fetch(`${API_BASE}/admin/announcement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementText, adminName })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  getAdminExams: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/exams`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  createAdminExam: async (examData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  deleteAdminExam: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/exams/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  getAdminCertificates: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/certificates`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  formatAvatarUrl: (url) => {
    if (!url) return '/assets/anime/boys/boy_1.png';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE.replace('/api', '')}${url}`;
    return url;
  },

  formatMediaUrl: (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE.replace('/api', '')}${url}`;
    return url;
  },

  // 14. Master 12,000 National Examination Question Pool
  getQuestionBankStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/questions/stats`);
      return await res.json();
    } catch (err) {
      console.warn('[API Question Stats Warning]:', err.message);
      return null;
    }
  },

  getQuestionsFromPool: async ({ stream = 'science', subjectKey = '', grade = '12', limit = 20, random = true } = {}) => {
    try {
      const params = new URLSearchParams({
        stream,
        ...(subjectKey ? { subjectKey } : {}),
        ...(grade ? { grade } : {}),
        limit: String(limit),
        random: String(random)
      });
      const res = await fetch(`${API_BASE}/questions/master-pool?${params.toString()}`);
      return await res.json();
    } catch (err) {
      console.warn('[API Question Pool Warning]:', err.message);
      return null;
    }
  }
};

export default api;
