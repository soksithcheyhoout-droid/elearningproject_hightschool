import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// Helper to compute dynamic levels, titles and badges from total XP
export const computeLevelData = (xp) => {
  const safeXP = typeof xp === 'number' && !isNaN(xp) && xp >= 0 ? xp : 2915;
  // 500 XP per level
  const level = Math.max(1, Math.floor(safeXP / 500) + 1);
  const currentBaseXP = (level - 1) * 500;
  const nextTargetXP = level * 500;
  const progressInLevel = Math.max(0, safeXP - currentBaseXP);
  const xpNeeded = Math.max(0, nextTargetXP - safeXP);
  const progressPct = Math.min(100, Math.max(0, Math.round((progressInLevel / 500) * 100)));

  let rankTitleKm = "អ្នកសិក្សាដំបូង (Novice Scholar)";
  let rankTitleEn = "Novice Scholar";
  let rankColor = "text-blue-600 bg-blue-50 border-blue-200";

  if (level >= 25) {
    rankTitleKm = "កំពូលអ្នកប្រាជ្ញបាក់ឌុប (Grandmaster of BacII)";
    rankTitleEn = "Grandmaster of BacII";
    rankColor = "text-amber-900 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 border-amber-400";
  } else if (level >= 15) {
    rankTitleKm = "បណ្ឌិតកិត្តិយសថ្នាក់ជាតិ (National Honor Laureate)";
    rankTitleEn = "National Honor Laureate";
    rankColor = "text-purple-900 bg-purple-100 border-purple-300";
  } else if (level >= 10) {
    rankTitleKm = "សិស្សឆ្នើមថ្នាក់ជាតិ (National Gold Scholar)";
    rankTitleEn = "National Gold Scholar";
    rankColor = "text-amber-800 bg-amber-100 border-amber-300";
  } else if (level >= 5) {
    rankTitleKm = "បណ្ឌិតវ័យក្មេង (Young Scholar)";
    rankTitleEn = "Young Scholar";
    rankColor = "text-blue-800 bg-blue-100 border-blue-300";
  } else if (level >= 2) {
    rankTitleKm = "អ្នកស្រាវជ្រាវសកម្ម (Active Researcher)";
    rankTitleEn = "Active Researcher";
    rankColor = "text-emerald-800 bg-emerald-100 border-emerald-300";
  }

  return {
    level,
    currentBaseXP,
    nextTargetXP,
    progressInLevel,
    xpNeeded,
    progressPct,
    rankTitleKm,
    rankTitleEn,
    rankColor
  };
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('khmer_elearn_auth');
    const savedStudent = localStorage.getItem('khmer_elearn_student');
    return savedAuth === 'true' && !!savedStudent;
  });

  const [student, setStudent] = useState(() => {
    const savedAuth = localStorage.getItem('khmer_elearn_auth');
    const saved = localStorage.getItem('khmer_elearn_student');
    if (savedAuth === 'true' && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.id || parsed.username || parsed.email)) {
          const parsedXP = typeof parsed.xp === 'number' && !isNaN(parsed.xp) ? parsed.xp : 500;
          const lvlData = computeLevelData(parsedXP);
          
          const avatar = parsed.avatar || "/assets/anime/boys/boy_1.png";
          const avatarFrame = parsed.avatarFrame || parsed.avatar_frame || "";

          return {
            ...parsed,
            avatar,
            avatarFrame,
            avatar_frame: avatarFrame,
            xp: parsedXP,
            level: lvlData.level,
            rankTitleKm: lvlData.rankTitleKm,
            rankTitleEn: lvlData.rankTitleEn
          };
        }
      } catch (e) {
        // Fallback
      }
    }
    return null;
  });

  const [selectedGrade, setSelectedGrade] = useState("12");
  const [selectedStream, setSelectedStream] = useState("all");
  const [levelUpToast, setLevelUpToast] = useState(null);

  useEffect(() => {
    try {
      if (student) {
        localStorage.setItem('khmer_elearn_student', JSON.stringify(student));
        if (student?.username) {
          localStorage.setItem(`profile_${student.username}`, JSON.stringify(student));
        }
        const allProfiles = JSON.parse(localStorage.getItem('khmer_elearn_all_profiles') || '{}');
        const key = String(student?.id || student?.username || 'me');
        allProfiles[key] = student;
        if (student?.username) allProfiles[student.username] = student;
        if (student?.email) allProfiles[student.email] = student;
        localStorage.setItem('khmer_elearn_all_profiles', JSON.stringify(allProfiles));
      } else {
        localStorage.removeItem('khmer_elearn_student');
      }
    } catch (e) {}
  }, [student]);

  // Listen for real-time profile & frame updates + account deletion across browser tabs
  useEffect(() => {
    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('khmer_elearn_profile_sync');
      bc.onmessage = (e) => {
        if (!e.data) return;

        // Account Deleted by Admin
        if (e.data.type === 'ACCOUNT_DELETED') {
          const deletedId = String(e.data.studentId || '');
          const myId = String(student?.id || '');
          if (deletedId && deletedId === myId) {
            setIsAuthenticated(false);
            setStudent(null);
            localStorage.removeItem('khmer_elearn_auth');
            localStorage.removeItem('khmer_elearn_student');
            return;
          }
        }

        if (e.data.type === 'PROFILE_UPDATED' && e.data.updatedFields) {
          const uId = String(e.data.studentId || '');
          const myId = String(student?.id || '');
          const myUname = (student?.username || '').toLowerCase();
          const targetUname = (e.data.updatedFields.username || '').toLowerCase();

          if ((uId && uId === myId) || (targetUname && targetUname === myUname)) {
            setStudent(prev => prev ? ({
              ...prev,
              ...e.data.updatedFields
            }) : null);
          }
        }
      };
    }
    return () => {
      if (bc) bc.close();
    };
  }, [student?.id, student?.username]);

  // Synchronize student with backend DB on mount & verify account validity
  useEffect(() => {
    const syncWithServer = async () => {
      if (!isAuthenticated || !student) return;

      try {
        const res = await api.getRegisteredStudents();
        if (res && Array.isArray(res.students)) {
          const currentId = student?.id;
          const currentUsername = (student?.username || student?.nickname || '').toLowerCase();
          const currentEmail = (student?.email || '').toLowerCase();

          const matched = res.students.find(s => 
            (currentId && Number(s.id) === Number(currentId)) ||
            (currentEmail && s.email?.toLowerCase() === currentEmail) ||
            (currentUsername && s.username?.toLowerCase() === currentUsername)
          );

          // If account is no longer in DB (deleted by admin), log out!
          if (!matched) {
            setIsAuthenticated(false);
            setStudent(null);
            localStorage.removeItem('khmer_elearn_auth');
            localStorage.removeItem('khmer_elearn_student');
            return;
          }

          const xp = typeof matched.xp === 'number' ? matched.xp : 500;
          const lvlData = computeLevelData(xp);

          setStudent(prev => ({
            ...prev,
            ...matched,
            id: matched.id,
            username: matched.username,
            name: matched.full_name || prev?.name,
            fullName: matched.full_name || prev?.fullName,
            email: matched.email || prev?.email,
            school: matched.school || prev?.school,
            grade: matched.grade || prev?.grade || '12',
            stream: matched.stream || prev?.stream || 'science',
            xp: xp,
            level: matched.level || lvlData.level,
            rankTitleKm: matched.rank_title_km || lvlData.rankTitleKm,
            rankTitleEn: matched.rank_title_en || lvlData.rankTitleEn,
            streakDays: matched.streak_days || prev?.streakDays || 1,
            avatar: api.formatAvatarUrl(matched.avatar) || prev?.avatar,
            avatarFrame: matched.avatar_frame || matched.avatarFrame || prev?.avatarFrame
          }));
        }
      } catch (e) {
        console.warn('Backend DB sync error:', e);
      }
    };

    syncWithServer();
  }, [isAuthenticated]);

  const login = (studentData) => {
    if (studentData) {
      setStudent(prev => ({
        ...prev,
        ...studentData,
        avatar: api.formatAvatarUrl(studentData.avatar) || prev?.avatar || "/assets/anime/boys/boy_1.png"
      }));
      localStorage.setItem('khmer_elearn_student', JSON.stringify(studentData));
    }
    setIsAuthenticated(true);
    localStorage.setItem('khmer_elearn_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStudent(null);
    localStorage.removeItem('khmer_elearn_auth');
    localStorage.removeItem('khmer_elearn_student');
  };

  const addXP = (amount) => {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) && amount > 0 ? amount : 0;
    if (safeAmount <= 0) return;

    setStudent(prev => {
      const oldXP = typeof prev?.xp === 'number' && !isNaN(prev.xp) ? prev.xp : 2915;
      const oldLvl = computeLevelData(oldXP).level;
      const newXP = oldXP + safeAmount;
      const newLvlData = computeLevelData(newXP);

      if (newLvlData.level > oldLvl) {
        setLevelUpToast({
          oldLevel: oldLvl,
          newLevel: newLvlData.level,
          rankTitleKm: newLvlData.rankTitleKm
        });
      }

      return {
        ...prev,
        xp: newXP,
        level: newLvlData.level,
        rankTitleKm: newLvlData.rankTitleKm,
        rankTitleEn: newLvlData.rankTitleEn
      };
    });
  };

  const markLessonComplete = (lessonId) => {
    setStudent(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const newLessons = [...prev.completedLessons, lessonId];
      const oldXP = typeof prev?.xp === 'number' && !isNaN(prev.xp) ? prev.xp : 2915;
      const oldLvl = computeLevelData(oldXP).level;
      const newXP = oldXP + 50;
      const newLvlData = computeLevelData(newXP);

      if (newLvlData.level > oldLvl) {
        setLevelUpToast({
          oldLevel: oldLvl,
          newLevel: newLvlData.level,
          rankTitleKm: newLvlData.rankTitleKm
        });
      }

      return {
        ...prev,
        completedLessons: newLessons,
        xp: newXP,
        level: newLvlData.level,
        rankTitleKm: newLvlData.rankTitleKm,
        rankTitleEn: newLvlData.rankTitleEn
      };
    });
  };

  const recordQuizScore = (quizId, score, total) => {
    setStudent(prev => {
      const xpEarned = Math.round((score / total) * 100);
      const oldXP = typeof prev?.xp === 'number' && !isNaN(prev.xp) ? prev.xp : 2915;
      const oldLvl = computeLevelData(oldXP).level;
      const newXP = oldXP + xpEarned;
      const newLvlData = computeLevelData(newXP);

      if (newLvlData.level > oldLvl) {
        setLevelUpToast({
          oldLevel: oldLvl,
          newLevel: newLvlData.level,
          rankTitleKm: newLvlData.rankTitleKm
        });
      }

      return {
        ...prev,
        xp: newXP,
        level: newLvlData.level,
        rankTitleKm: newLvlData.rankTitleKm,
        rankTitleEn: newLvlData.rankTitleEn,
        quizScores: {
          ...prev.quizScores,
          [quizId]: { score, total, date: new Date().toISOString().split('T')[0] }
        }
      };
    });
  };

  const uploadCustomProfilePicture = async (file) => {
    try {
      const res = await api.uploadProfilePicture(student?.id || student?.name, file);
      if (res.avatarUrl) {
        const fullUrl = api.formatAvatarUrl(res.avatarUrl);
        setStudent(prev => ({
          ...prev,
          avatar: fullUrl
        }));
        
        // Also persist to database via updateProfile so it doesn't revert
        const sid = student?.id || student?.username;
        if (sid) {
          api.updateProfile(sid, { avatar: fullUrl }).catch(() => {});
        }
        
        // Broadcast to other tabs
        try {
          const bc = new BroadcastChannel('khmer_elearn_profile_sync');
          bc.postMessage({ type: 'avatar_updated', avatar: fullUrl });
          bc.close();
        } catch (e) {}
        
        return fullUrl;
      }
    } catch (err) {
      console.error('[Upload Custom PF Error]:', err);
      // Local fallback using FileReader if server is unreachable
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setStudent(prev => ({
            ...prev,
            avatar: reader.result
          }));
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const updateAvatar = (avatarUrl) => {
    setStudent(prev => {
      const updated = {
        ...prev,
        avatar: avatarUrl
      };
      if (prev?.username) {
        try {
          localStorage.setItem(`profile_${prev.username}`, JSON.stringify(updated));
        } catch (e) {}
        api.updateProfile(prev.id || prev.username, { avatar: avatarUrl }).catch(() => {});
      }
      return updated;
    });
  };

  const updateAvatarFrame = (frameUrl) => {
    setStudent(prev => {
      const updated = {
        ...prev,
        avatarFrame: frameUrl,
        avatar_frame: frameUrl
      };
      if (prev?.username) {
        try {
          localStorage.setItem(`profile_${prev.username}`, JSON.stringify(updated));
        } catch (e) {}
        api.updateProfile(prev.id || prev.username, { avatarFrame: frameUrl }).catch(() => {});
      }
      return updated;
    });
  };

  const updateProfile = (updatedData) => {
    setStudent(prev => {
      const updated = {
        ...prev,
        ...updatedData
      };
      if (prev?.username) {
        try {
          localStorage.setItem(`profile_${prev.username}`, JSON.stringify(updated));
        } catch (e) {}
        api.updateProfile(prev.id || prev.username, updatedData).catch(() => {});
      }
      return updated;
    });
  };

  const unlockBadge = (badgeObj) => {
    setStudent(prev => {
      if (prev.badges.some(b => b.id === badgeObj.id)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeObj]
      };
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      student,
      selectedGrade,
      setSelectedGrade,
      selectedStream,
      setSelectedStream,
      addXP,
      markLessonComplete,
      recordQuizScore,
      updateAvatar,
      uploadCustomProfilePicture,
      updateAvatarFrame,
      updateProfile,
      unlockBadge,
      levelUpToast,
      setLevelUpToast,
      computeLevelData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
