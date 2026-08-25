// Real-Time Turn-Based Multiplayer Room Synchronization Controller for Academic 1v1 Arena
// Features: Shared Questions Pool, First to 6 Correct Wins, Overtime/Tie-Breaker, Rematch Sync, Admin Kick & Real-Time Invite Approvals

const activeRooms = new Map();
const pendingInvites = new Map(); // inviteId -> { id, fromStudent, toStudentId, roomCode, subject, gameTitle, status, timestamp }

// Helper: Clean up expired rooms older than 3 hours
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of activeRooms.entries()) {
    if (now - room.lastActive > 3 * 60 * 60 * 1000) {
      activeRooms.delete(code);
    }
  }
  for (const [id, inv] of pendingInvites.entries()) {
    if (now - inv.timestamp > 10 * 60 * 1000) {
      pendingInvites.delete(id);
    }
  }
}, 15 * 60 * 1000);

export const createOrGetRoom = (req, res) => {
  try {
    const { roomCode, gameId, subject, hostStudent, questions } = req.body;
    if (!roomCode || !hostStudent) {
      return res.status(400).json({ error: 'Room code and host student are required' });
    }

    let room = activeRooms.get(roomCode);
    if (!room) {
      room = {
        roomCode,
        gameId: gameId || 'sci-m-01',
        subject: subject || 'គណិតវិទ្យា',
        host: hostStudent,
        challenger: null,
        challengerReady: false,
        kickedStudentId: null,
        questions: Array.isArray(questions) ? questions : [],
        status: 'waiting', // 'waiting' | 'ready' | 'countdown' | 'battle' | 'results'
        activeTurn: 'host', // 'host' | 'challenger'
        currentQIndex: 0,
        turnStatus: 'playing', // 'playing' | 'turn_ended'
        turnResult: null,
        hostScore: 0,
        challengerScore: 0,
        hostCorrectCount: 0,
        challengerCorrectCount: 0,
        isOvertime: false,
        hostRematch: false,
        challengerRematch: false,
        createdAt: Date.now(),
        lastActive: Date.now()
      };
      activeRooms.set(roomCode, room);
    } else {
      // Keep host updated with latest profile data!
      if (hostStudent) {
        room.host = hostStudent;
      }
      if ((!room.questions || room.questions.length === 0) && Array.isArray(questions) && questions.length > 0) {
        room.questions = questions;
      }
      room.lastActive = Date.now();
    }

    return res.json({ success: true, room });
  } catch (err) {
    console.error('[Create Room Error]:', err);
    return res.status(500).json({ error: 'Failed to create room' });
  }
};

export const joinRoom = (req, res) => {
  try {
    const { roomCode, student } = req.body;
    if (!roomCode || !student) {
      return res.status(400).json({ error: 'Room code and student are required' });
    }

    const room = activeRooms.get(roomCode);
    if (!room) {
      return res.status(404).json({ error: 'រកមិនឃើញបន្ទប់ប្រកួតនេះទេ (Room not found)' });
    }

    // Reset kicked and challenger-left flags upon valid join/re-entry
    room.kickedStudentId = null;
    room.challengerLeft = false;
    room.challenger = student;
    room.challengerReady = false;
    room.status = 'waiting_ready';
    room.lastActive = Date.now();

    return res.json({ success: true, room });
  } catch (err) {
    console.error('[Join Room Error]:', err);
    return res.status(500).json({ error: 'Failed to join room' });
  }
};

export const getRoom = (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = activeRooms.get(roomCode);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    room.lastActive = Date.now();
    return res.json({ success: true, room });
  } catch (err) {
    console.error('[Get Room Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch room' });
  }
};

export const updateRoomStatus = (req, res) => {
  try {
    const { roomCode } = req.params;
    const { status, currentQIndex, hostScore, challengerScore, challengerReady, activeTurn, questions } = req.body;
    const room = activeRooms.get(roomCode);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (status) room.status = status;
    if (activeTurn) room.activeTurn = activeTurn;
    if (Array.isArray(questions) && questions.length > 0) room.questions = questions;
    if (typeof challengerReady === 'boolean') {
      room.challengerReady = challengerReady;
      if (challengerReady) {
        room.status = 'ready';
      } else {
        room.status = 'waiting_ready';
      }
    }
    if (typeof currentQIndex === 'number') room.currentQIndex = currentQIndex;
    if (typeof hostScore === 'number') room.hostScore = hostScore;
    if (typeof challengerScore === 'number') room.challengerScore = challengerScore;
    room.lastActive = Date.now();

    return res.json({ success: true, room });
  } catch (err) {
    console.error('[Update Room Error]:', err);
    return res.status(500).json({ error: 'Failed to update room' });
  }
};

// Admin/Host Kicks Challenger
export const kickChallenger = (req, res) => {
  try {
    const { roomCode } = req.params;
    const { challengerId } = req.body;
    const room = activeRooms.get(roomCode);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.kickedStudentId = challengerId || (room.challenger ? room.challenger.id : null);
    room.challenger = null;
    room.challengerReady = false;
    room.challengerLeft = true;
    room.status = 'waiting';
    room.lastActive = Date.now();

    // Purge all old invites for this room so the invite-status poller
    // doesn't see stale 'accepted' invites and auto-close the invite modal
    for (const [id, inv] of pendingInvites.entries()) {
      if (inv.roomCode === roomCode) {
        pendingInvites.delete(id);
      }
    }

    // Auto-clear challengerLeft after 2 seconds so host poller stops reacting
    setTimeout(() => {
      if (room.challengerLeft && !room.challenger) {
        room.challengerLeft = false;
      }
    }, 2000);

    return res.json({ success: true, room });
  } catch (err) {
    console.error('[Kick Challenger Error]:', err);
    return res.status(500).json({ error: 'Failed to kick challenger' });
  }
};

// Send Match Invitation to another student
export const sendInvite = (req, res) => {
  try {
    const { fromStudent, toStudentId, roomCode, subject, gameTitle } = req.body;
    if (!fromStudent || !toStudentId || !roomCode) {
      return res.status(400).json({ error: 'fromStudent, toStudentId, roomCode are required' });
    }

    const sId = Number(toStudentId);

    // If student was previously kicked in this room, unblock them now that a new invite is sent
    const room = activeRooms.get(roomCode);
    if (room) {
      // Always clear kick and left flags on new invite so room is fully reset
      room.kickedStudentId = null;
      room.challengerLeft = false;
      room.challenger = null;
      room.challengerReady = false;
      room.status = 'waiting';
      room.lastActive = Date.now();
    }

    // Remove any previous invite for this student in this room so re-invite succeeds
    for (const [id, inv] of pendingInvites.entries()) {
      if (inv.toStudentId === sId && inv.roomCode === roomCode) {
        pendingInvites.delete(id);
      }
    }

    const inviteId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const invite = {
      id: inviteId,
      fromStudent,
      toStudentId: sId,
      roomCode,
      subject: subject || 'គណិតវិទ្យា',
      gameTitle: gameTitle || '1v1 Academic Arena',
      status: 'pending', // 'pending' | 'accepted' | 'declined'
      timestamp: Date.now()
    };

    pendingInvites.set(inviteId, invite);
    return res.json({ success: true, inviteId, invite });
  } catch (err) {
    console.error('[Send Invite Error]:', err);
    return res.status(500).json({ error: 'Failed to send invite' });
  }
};

// Fetch Pending Invitations for a Student
export const getStudentInvites = (req, res) => {
  try {
    const { studentId } = req.params;
    const sId = Number(studentId);
    const now = Date.now();
    const invites = [];

    for (const [id, inv] of pendingInvites.entries()) {
      if (inv.toStudentId === sId && inv.status === 'pending' && now - inv.timestamp < 3 * 60 * 1000) {
        invites.push(inv);
      }
    }

    return res.json({ success: true, invites });
  } catch (err) {
    console.error('[Get Student Invites Error]:', err);
    return res.status(500).json({ error: 'Failed to get invites' });
  }
};

// Student Approves or Declines Invitation
export const respondInvite = (req, res) => {
  try {
    const { inviteId } = req.params;
    const { student, accept } = req.body;
    const invite = pendingInvites.get(inviteId);
    if (!invite) {
      return res.status(404).json({ error: 'Invitation expired or not found' });
    }

    invite.status = accept ? 'accepted' : 'declined';
    invite.respondedAt = Date.now();

    if (accept && student) {
      const room = activeRooms.get(invite.roomCode);
      if (room) {
        room.challenger = student;
        room.challengerReady = false;
        room.challengerLeft = false;
        room.status = 'waiting_ready';
        room.lastActive = Date.now();
      }
    } else if (!accept) {
      // Auto-delete declined invite after 4.8 seconds
      setTimeout(() => {
        pendingInvites.delete(inviteId);
      }, 4800);
    }

    return res.json({ success: true, invite, roomCode: invite.roomCode });
  } catch (err) {
    console.error('[Respond Invite Error]:', err);
    return res.status(500).json({ error: 'Failed to respond to invite' });
  }
};

// Check Status of Outgoing Invites for a Room
export const getRoomInviteStatus = (req, res) => {
  try {
    const { roomCode } = req.params;
    const now = Date.now();
    const invites = [];
    for (const [id, inv] of pendingInvites.entries()) {
      if (inv.roomCode === roomCode) {
        if (inv.status === 'declined' && inv.respondedAt && now - inv.respondedAt >= 4800) {
          pendingInvites.delete(id);
          continue;
        }
        invites.push(inv);
      }
    }
    return res.json({ success: true, invites });
  } catch (err) {
    console.error('[Room Invite Status Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch invite status' });
  }
};

// Player submits answer for their active turn
export const submitTurnAnswer = (req, res) => {
  try {
    const { roomCode } = req.params;
    const { isHost, selectedIdx, isCorrect, scoreEarned, isTimeout } = req.body;
    const room = activeRooms.get(roomCode);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (isHost) {
      if (typeof scoreEarned === 'number') room.hostScore += scoreEarned;
      if (isCorrect) room.hostCorrectCount = (room.hostCorrectCount || 0) + 1;
    } else {
      if (typeof scoreEarned === 'number') room.challengerScore += scoreEarned;
      if (isCorrect) room.challengerCorrectCount = (room.challengerCorrectCount || 0) + 1;
    }

    // Check if anyone reached 6 correct answers
    const hasHostWon = (room.hostCorrectCount || 0) >= 6;
    const hasChallengerWon = (room.challengerCorrectCount || 0) >= 6;
    const now = Date.now();

    room.turnStatus = 'turn_ended';
    room.turnResult = {
      turnId: `turn_${now}_${Math.random().toString(36).substring(2, 7)}`,
      answeredBy: isHost ? 'host' : 'challenger',
      selectedIdx: typeof selectedIdx === 'number' ? selectedIdx : -1,
      isCorrect: !!isCorrect,
      scoreEarned: scoreEarned || 0,
      isTimeout: !!isTimeout,
      hostCorrectCount: room.hostCorrectCount,
      challengerCorrectCount: room.challengerCorrectCount,
      winnerDeclared: hasHostWon ? 'host' : hasChallengerWon ? 'challenger' : null,
      timestamp: now
    };

    room.lastActive = now;
    return res.json({ success: true, room });
  } catch (err) {
    console.error('[Submit Turn Answer Error]:', err);
    return res.status(500).json({ error: 'Failed to submit turn answer' });
  }
};

// Switch turn & advance to next question (Idempotent for both Host & Challenger)
export const nextTurn = (req, res) => {
  try {
    const { roomCode } = req.params;
    const { expectedQIndex, extraQuestions } = req.body;
    const room = activeRooms.get(roomCode);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Idempotency: If this request is for an older turn index that already advanced, return immediately
    if (typeof expectedQIndex === 'number' && room.currentQIndex !== expectedQIndex) {
      return res.json({ success: true, room, alreadyAdvanced: true });
    }

    // Win condition: Player must reach 6 correct answers
    const hasHostWon = (room.hostCorrectCount || 0) >= 6;
    const hasChallengerWon = (room.challengerCorrectCount || 0) >= 6;

    if (hasHostWon || hasChallengerWon) {
      // Check if both reached 6 at the same time (Overtime)
      if (room.hostCorrectCount === 6 && room.challengerCorrectCount === 6) {
        room.isOvertime = true;
      } else {
        room.status = 'results';
        room.turnStatus = 'turn_ended';
        room.lastActive = Date.now();
        return res.json({ success: true, room });
      }
    }

    const nextQ = room.currentQIndex + 1;

    // If reached end of current questions pool, append extra questions and keep going!
    if (nextQ >= room.questions.length) {
      if (Array.isArray(extraQuestions) && extraQuestions.length > 0) {
        room.questions = [...room.questions, ...extraQuestions];
      }
    }

    room.currentQIndex = nextQ;
    room.activeTurn = room.activeTurn === 'host' ? 'challenger' : 'host';
    room.turnStatus = 'playing';
    room.turnResult = null;
    room.lastActive = Date.now();

    return res.json({ success: true, room });
  } catch (err) {
    console.error('[Next Turn Error]:', err);
    return res.status(500).json({ error: 'Failed to advance turn' });
  }
};

export const requestRematch = (req, res) => {
  try {
    const { roomCode } = req.params;
    const { isHost, newQuestions } = req.body;
    const room = activeRooms.get(roomCode);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (isHost) {
      room.hostRematch = true;
    } else {
      room.challengerRematch = true;
    }

    // If both agreed to rematch:
    if (room.hostRematch && room.challengerRematch) {
      room.status = 'countdown';
      room.hostScore = 0;
      room.challengerScore = 0;
      room.hostCorrectCount = 0;
      room.challengerCorrectCount = 0;
      room.currentQIndex = 0;
      room.activeTurn = 'host';
      room.turnStatus = 'playing';
      room.turnResult = null;
      room.isOvertime = false;
      room.hostRematch = false;
      room.challengerRematch = false;
      if (Array.isArray(newQuestions) && newQuestions.length > 0) {
        room.questions = newQuestions;
      }
    }

    room.lastActive = Date.now();
    return res.json({ success: true, room, bothReady: room.status === 'countdown' });
  } catch (err) {
    console.error('[Request Rematch Error]:', err);
    return res.status(500).json({ error: 'Failed to request rematch' });
  }
};

export const leaveRoom = (req, res) => {
  try {
    const { roomCode } = req.params;
    const { studentId, username } = req.body;
    const room = activeRooms.get(roomCode);
    if (!room) {
      return res.json({ success: true });
    }

    const isHostLeaving = room.host && (
      (studentId && String(room.host.id) === String(studentId)) ||
      (username && room.host.username === username)
    );

    const isChallengerLeaving = room.challenger && (
      (studentId && String(room.challenger.id) === String(studentId)) ||
      (username && room.challenger.username === username)
    );

    if (isHostLeaving) {
      room.status = 'host_left';
      room.hostLeft = true;
      room.host = null;
      room.hostRematch = false;
      room.challengerRematch = false;
      setTimeout(() => {
        activeRooms.delete(roomCode);
      }, 5000);
    } else if (isChallengerLeaving || !isHostLeaving) {
      room.challenger = null;
      room.challengerLeft = true;
      room.challengerReady = false;
      room.challengerScore = 0;
      room.challengerCorrectCount = 0;
      room.challengerRematch = false;
      room.hostRematch = false;
      if (room.status === 'battle' || room.status === 'countdown') {
        room.status = 'opponent_left';
      } else {
        room.status = 'waiting';
      }
    }

    room.lastActive = Date.now();
    return res.json({ success: true, room });
  } catch (err) {
    console.error('[Leave Room Error]:', err);
    return res.status(500).json({ error: 'Failed to leave room' });
  }
};
