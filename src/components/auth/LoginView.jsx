import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Lock, 
  User, 
  School, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  BookOpen, 
  CheckCircle2, 
  Globe, 
  Phone, 
  Mail, 
  HelpCircle, 
  FileCheck, 
  Sparkles, 
  Award, 
  UserPlus, 
  LogIn, 
  KeyRound, 
  RefreshCw, 
  Settings, 
  X, 
  Smartphone, 
  Check,
  ChevronRight,
  ExternalLink,
  Crown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import api from '../../services/api';

const ALL_GRADES = [
  { value: '12', labelKm: 'ថ្នាក់ទី១២ (Grade 12 - Bac II)', labelEn: 'Grade 12 (Bac II High School)' },
  { value: '11', labelKm: 'ថ្នាក់ទី១១ (Grade 11)', labelEn: 'Grade 11 (High School)' },
  { value: '10', labelKm: 'ថ្នាក់ទី១០ (Grade 10)', labelEn: 'Grade 10 (High School)' },
  { value: '9', labelKm: 'ថ្នាក់ទី៩ (Grade 9 - Bac I)', labelEn: 'Grade 9 (Junior High)' },
  { value: '8', labelKm: 'ថ្នាក់ទី៨ (Grade 8)', labelEn: 'Grade 8 (Junior High)' },
  { value: '7', labelKm: 'ថ្នាក់ទី៧ (Grade 7)', labelEn: 'Grade 7 (Junior High)' },
  { value: '6', labelKm: 'ថ្នាក់ទី៦ (Grade 6)', labelEn: 'Grade 6 (Primary School)' },
  { value: '5', labelKm: 'ថ្នាក់ទី៥ (Grade 5)', labelEn: 'Grade 5 (Primary School)' },
  { value: '4', labelKm: 'ថ្នាក់ទី៤ (Grade 4)', labelEn: 'Grade 4 (Primary School)' },
  { value: '3', labelKm: 'ថ្នាក់ទី៣ (Grade 3)', labelEn: 'Grade 3 (Primary School)' },
  { value: '2', labelKm: 'ថ្នាក់ទី២ (Grade 2)', labelEn: 'Grade 2 (Primary School)' },
  { value: '1', labelKm: 'ថ្នាក់ទី១ (Grade 1)', labelEn: 'Grade 1 (Primary School)' },
];

const DEFAULT_GOOGLE_CLIENT_ID = '398760173693-c21013b3ih3e8b2kk5kfnau9khbtj96j.apps.googleusercontent.com';

export default function LoginView() {
  const { lang, setLang } = useLanguage();
  const { login } = useAuth();

  // Navigation Tabs: 'login' (Sign In with 2-Step OTP) | 'register'
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Standard Login Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('12');
  const [selectedStream, setSelectedStream] = useState('science');

  // OTP Form State (3-Step Authentication)
  const [otpTarget, setOtpTarget] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Contact, 2: 6-Digit PIN, 3: Profile Info
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  // Step 3 Profile Info Fields (First name, Last name, Nickname, Password, School, Grade 1-12)
  const [otpLastName, setOtpLastName] = useState('');
  const [otpFirstName, setOtpFirstName] = useState('');
  const [otpNickname, setOtpNickname] = useState('');
  const [otpPassword, setOtpPassword] = useState('');
  const [otpConfirmPassword, setOtpConfirmPassword] = useState('');
  const [otpSchool, setOtpSchool] = useState('វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ');
  const [otpGrade, setOtpGrade] = useState('12');
  const [otpStream, setOtpStream] = useState('science');
  const [showOtpPassword, setShowOtpPassword] = useState(false);

  // Google OAuth API State
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleConfigModal, setShowGoogleConfigModal] = useState(false);
  const [googleClientId, setGoogleClientId] = useState(() => {
    return localStorage.getItem('khmer_google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  });

  // Register Form Fields
  const [regFullNameKm, setRegFullNameKm] = useState('');
  const [regFullNameEn, setRegFullNameEn] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regStudentID, setRegStudentID] = useState('');
  const [regSchoolName, setRegSchoolName] = useState('វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ');
  const [regGrade, setRegGrade] = useState('12');
  const [regStream, setRegStream] = useState('science');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('/assets/anime/boys/boy_1.png');
  const [pendingRegData, setPendingRegData] = useState(null);

  // Super Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('soksithcheyhoout@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMessage('សូមបញ្ចូល Email និង Password Admin');
      return;
    }
    setAdminLoading(true);
    setErrorMessage('');
    try {
      const res = await api.adminLogin(adminEmail.trim(), adminPassword.trim());
      if (res && res.success && res.admin) {
        localStorage.setItem('motdar_admin_session', JSON.stringify(res.admin));
        login({
          id: res.admin.id || 1,
          name: res.admin.fullName || 'Hout Sok Sithchey',
          fullName: res.admin.fullName || 'Hout Sok Sithchey',
          username: res.admin.username || 'admin',
          email: res.admin.email || 'soksithcheyhoout@gmail.com',
          avatar: res.admin.avatar || '/assets/anime/boys/boy_1.png',
          avatarFrame: res.admin.avatarFrame || '/assets/frames/11_gyoko_pink.png',
          xp: 99999,
          level: 99,
          grade: '12',
          stream: 'science',
          school: 'ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់ (MoTDAR)',
          role: 'superadmin',
          isAdmin: true
        });
      } else {
        setErrorMessage(res?.error || 'Email ឬ Password Admin មិនត្រឹមត្រូវទេ');
      }
    } catch (err) {
      setErrorMessage('មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Admin Server');
    } finally {
      setAdminLoading(false);
    }
  };

  // Countdown timer for OTP Resend
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Load Google Identity Services (GSI) script dynamically
  useEffect(() => {
    const existingScript = document.getElementById('google-gsi-client');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // 1. Password / Main Login Handler: Verifies DB Registration & Dispatches OTP to Email First
  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim()) {
      setErrorMessage(lang === 'km' ? 'សូមបញ្ចូលឈ្មោះគណនី ឬអ៊ីមែល!' : 'Please enter your username or email.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    playSound.click?.();

    try {
      // Send 6-digit OTP code to user's registered email/phone in database
      const otpRes = await api.sendOtp({ target: username.trim(), purpose: 'login' });
      if (otpRes.success) {
        playSound.click?.();
        const finalTarget = otpRes.resolvedTarget || otpRes.target || username.trim();
        setOtpTarget(finalTarget);
        setOtpStep(2);
        setActiveTab('login');
        setOtpTimer(60);
        
        if (otpRes.previewCode) {
          setOtpDigits(otpRes.previewCode.split(''));
          setSuccessMessage(
            lang === 'km'
              ? `✨ លេខកូដ OTP (សាកល្បង) គឺ៖ ${otpRes.previewCode} (បានបំពេញស្វ័យប្រវត្តិតាមរយៈ Demo Mode)`
              : `✨ Preview OTP Code: ${otpRes.previewCode} (Auto-filled via Demo Mode)`
          );
        } else {
          setOtpDigits(['', '', '', '', '', '']);
          setSuccessMessage(
            lang === 'km' 
              ? `លេខកូដសម្ងាត់ OTP ៦ ខ្ទង់ត្រូវបានផ្ញើចូលប្រអប់សំបុត្រ Gmail (${finalTarget}) រួចរាល់ហើយ! សូមពិនិត្យមើល Inbox/Spam។`
              : `6-Digit OTP code sent to ${finalTarget}! Please check your Gmail inbox.`
          );
        }
        setTimeout(() => {
          otpInputRefs[0]?.current?.focus();
        }, 200);
      }
    } catch (err) {
      console.warn('Backend send OTP error:', err);
      const target = username.trim();
      setOtpStep(1);
      if (target.includes('@')) {
        setRegEmail(target);
        setRegStudentID(target.split('@')[0]);
      } else {
        setRegStudentID(target);
      }
      setActiveTab('register');
      setErrorMessage(
        err.data?.error || (
          lang === 'km' 
            ? `គណនី (${target}) នេះមិនទាន់បានចុះឈ្មោះក្នុងប្រព័ន្ធទេ! សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីចុះឈ្មោះ។`
            : `Account (${target}) is not registered yet! Please complete your registration below.`
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Send OTP Handler: Automatically detects purpose (login vs register) and resends code
  const handleSendOtp = async (e, customTarget = null) => {
    e?.preventDefault?.();
    const targetToSend = (typeof customTarget === 'string' ? customTarget : (otpTarget || regEmail || username || '')).trim();
    if (!targetToSend) {
      setErrorMessage(lang === 'km' ? 'សូមបញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទរបស់ប្អូន!' : 'Please enter your email or phone number.');
      return;
    }

    const currentPurpose = (pendingRegData || activeTab === 'register') ? 'register' : 'login';

    setOtpSending(true);
    setErrorMessage('');
    setSuccessMessage('');
    playSound.click?.();

    try {
      const res = await api.sendOtp({ target: targetToSend, purpose: currentPurpose });
      if (res.success) {
        playSound.click?.();
        const finalTarget = res.resolvedTarget || res.target || targetToSend;
        setOtpTarget(finalTarget);
        setOtpStep(2);
        setActiveTab('login');
        setOtpTimer(60);
        if (res.previewCode) {
          setOtpDigits(res.previewCode.split(''));
          setSuccessMessage(
            lang === 'km'
              ? `✨ លេខកូដ OTP (សាកល្បង) គឺ៖ ${res.previewCode} (បានបំពេញស្វ័យប្រវត្តិតាមរយៈ Demo Mode)`
              : `✨ Preview OTP Code: ${res.previewCode} (Auto-filled via Demo Mode)`
          );
        } else {
          setOtpDigits(['', '', '', '', '', '']);
          setSuccessMessage(
            lang === 'km' 
              ? `លេខកូដសម្ងាត់ OTP ៦ ខ្ទង់ត្រូវបានផ្ញើឡើងវិញទៅកាន់ ${finalTarget} រួចរាល់ហើយ!` 
              : `New 6-Digit OTP code resent to ${finalTarget}!`
          );
        }
        setTimeout(() => {
          otpInputRefs[0]?.current?.focus();
        }, 200);
      }
    } catch (err) {
      console.warn('Send OTP error:', err);
      setErrorMessage(
        err.data?.error || (
          lang === 'km'
            ? `មិនអាចផ្ញើលេខកូដ OTP ទៅកាន់ (${targetToSend}) បានទេ!`
            : `Failed to send OTP code to (${targetToSend})!`
        )
      );
    } finally {
      setOtpSending(false);
    }
  };

  // Handle OTP Digit Input Box Changes & Paste
  const handleOtpDigitChange = (index, value) => {
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      cleanDigits.forEach((digit, i) => {
        if (i < 6) newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(cleanDigits.length, 5);
      otpInputRefs[nextIndex]?.current?.focus();
      return;
    }

    const cleanChar = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanChar;
    setOtpDigits(newDigits);

    if (cleanChar && index < 5) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  // Handle Backspace navigation across digit boxes
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };



  // 3. Verify OTP Code Handler: Verifies OTP with backend, then creates student in DB or logs in
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const code = otpDigits.join('').trim();
    if (code.length < 6) {
      setErrorMessage(lang === 'km' ? 'សូមបំពេញលេខកូដ OTP ទាំង ៦ ខ្ទង់!' : 'Please enter all 6 OTP digits.');
      return;
    }

    setOtpVerifying(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.verifyOtp({
        target: otpTarget.trim(),
        otpCode: code
      });

      // If completing new registration: only create student in DB after OTP is confirmed valid!
      if (pendingRegData) {
        const regRes = await api.register(pendingRegData);
        if (regRes && regRes.student) {
          setPendingRegData(null);
          login(regRes.student);
          return;
        }
      }

      if (res.isExisting && res.student) {
        login(res.student);
      } else {
        setOtpStep(3);
        setSuccessMessage(lang === 'km' ? 'លេខកូដ OTP ត្រឹមត្រូវ! សូមបំពេញព័ត៌មានគណនី និងកំណត់លេខសម្ងាត់។' : 'OTP verified! Please fill in your profile info and password.');
      }
    } catch (err) {
      console.warn('Backend verify OTP notice:', err);
      setErrorMessage(err.data?.error || (lang === 'km' ? 'លេខកូដ OTP មិនត្រឹមត្រូវ ឬផុតកំណត់' : 'Invalid or expired OTP code'));
    } finally {
      setOtpVerifying(false);
    }
  };

  // 4. Complete Profile & Credentials (Step 3 Submit)
  const handleCompleteOtpProfile = async (e) => {
    e?.preventDefault();
    if (!otpLastName.trim()) {
      setErrorMessage(lang === 'km' ? 'សូមបញ្ចូលគោត្តនាម (Last name)!' : 'Please enter your last name.');
      return;
    }
    if (!otpFirstName.trim()) {
      setErrorMessage(lang === 'km' ? 'សូមបញ្ចូលនាមខ្លួន (First name)!' : 'Please enter your first name.');
      return;
    }
    if (!otpPassword || otpPassword.length < 6) {
      setErrorMessage(lang === 'km' ? 'លេខសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ!' : 'Password must be at least 6 characters.');
      return;
    }
    if (otpPassword !== otpConfirmPassword) {
      setErrorMessage(lang === 'km' ? 'លេខសម្ងាត់ផ្ទៀងផ្ទាត់មិនដូចគ្នាទេ!' : 'Passwords do not match.');
      return;
    }

    setOtpSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.completeOtpProfile({
        target: otpTarget.trim(),
        firstName: otpFirstName.trim(),
        lastName: otpLastName.trim(),
        nickname: otpNickname.trim() || `${otpFirstName.trim().toLowerCase()}.${Date.now().toString().slice(-4)}`,
        password: otpPassword,
        school: otpSchool.trim() || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
        grade: otpGrade,
        stream: otpStream
      });

      if (res.student) {
        login(res.student);
      }
    } catch (err) {
      console.warn('Complete OTP profile fallback to session:', err);
      const cleanFirst = otpFirstName.trim();
      const cleanLast = otpLastName.trim();
      const fullName = `${cleanLast} ${cleanFirst}`;
      const lvlData = computeLevelData(500);
      login({
        name: fullName,
        fullName: fullName,
        fullNameEn: (otpNickname.trim() || `${cleanFirst}.${cleanLast}`).toUpperCase(),
        username: otpNickname.trim().toLowerCase() || `${cleanFirst.toLowerCase()}.${Date.now().toString().slice(-4)}`,
        studentId: `BACII-G${otpGrade}-${Date.now().toString().slice(-6)}`,
        email: otpTarget.includes('@') ? otpTarget.trim() : undefined,
        phone: !otpTarget.includes('@') ? otpTarget.trim() : undefined,
        grade: otpGrade,
        stream: otpStream,
        school: otpSchool.trim() || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
        avatar: '/assets/anime/boys/boy_1.png',
        avatarFrame: '/assets/frames/ki_energy.png',
        xp: 500,
        level: lvlData.level,
        rankTitleKm: lvlData.rankTitleKm,
        rankTitleEn: lvlData.rankTitleEn,
        streakDays: 1,
        completedLessons: [],
        quizScores: {},
        badges: [
          { id: 'b-otp', titleKm: 'ផ្ទៀងផ្ទាត់ OTP (OTP Verified)', titleEn: 'OTP Verified', color: '#10b981' },
          { id: 'b-welcome', titleKm: 'សិស្សថ្មី (New Scholar)', titleEn: 'New Scholar', color: '#38bdf8' }
        ]
      });
    } finally {
      setOtpSubmitting(false);
    }
  };

  // 4. Google Login API Execution: Verifies registration first
  const executeGoogleAuth = async (profileData, credential = null) => {
    setGoogleLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    playSound.click?.();

    try {
      const email = (profileData?.email || '').trim().toLowerCase();
      const name = profileData?.name || profileData?.given_name || email.split('@')[0];

      // 1. Check with Backend if Google Account is Registered
      const checkRes = await api.googleLogin({
        credential,
        profile: profileData
      });

      // CASE A: Account IS REGISTERED -> Dispatch OTP & require verification
      if (checkRes && checkRes.isRegistered && checkRes.student) {
        const targetEmail = checkRes.student.email || email;
        const otpRes = await api.sendOtp({
          target: targetEmail,
          purpose: 'login'
        });

        const finalTarget = otpRes.resolvedTarget || otpRes.target || targetEmail;
        setOtpTarget(finalTarget);
        setOtpStep(2);
        setActiveTab('login');
        setOtpTimer(60);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessMessage(
          lang === 'km' 
            ? `លេខកូដសម្ងាត់ OTP ៦ ខ្ទង់ត្រូវបានផ្ញើទៅកាន់ ${finalTarget} រួចរាល់ហើយ! សូមពិនិត្យប្រអប់សំបុត្រ Gmail របស់អ្នក។`
            : `6-Digit OTP code sent to ${finalTarget}! Please check your Gmail inbox to verify.`
        );
        setTimeout(() => {
          otpInputRefs[0]?.current?.focus();
        }, 200);
      } else {
        // CASE B: Account IS NOT REGISTERED -> Show "This Gmail not found" notice
        if (name) {
          setRegFullNameKm(name);
          setRegFullNameEn(name.toUpperCase());
        }
        if (email) {
          setRegEmail(email);
          setRegStudentID(email.split('@')[0]);
        }
        setOtpStep(1);
        setActiveTab('login');
        setErrorMessage(
          lang === 'km' 
            ? `រកមិនឃើញគណនីអ៊ីមែល (${email || 'Gmail'}) នេះទេ! គណនី Gmail នេះមិនទាន់បានចុះឈ្មោះក្នុងប្រព័ន្ធឡើយ។ (This Gmail is not registered yet)`
            : `This Gmail (${email || 'Gmail'}) was not found in the system! Please click "Register" to create a new account.`
        );
      }
    } catch (err) {
      console.warn('Google login check notice:', err);
      const email = profileData?.email || err.data?.googleProfile?.email || '';
      const name = profileData?.name || profileData?.given_name || email.split('@')[0] || '';
      
      if (name) {
        setRegFullNameKm(name);
        setRegFullNameEn(name.toUpperCase());
      }
      if (email) {
        setRegEmail(email);
        setRegStudentID(email.split('@')[0]);
      }
      setOtpStep(1);
      setActiveTab('login');
      setErrorMessage(
        lang === 'km' 
          ? `រកមិនឃើញគណនីអ៊ីមែល (${email || 'Gmail'}) នេះទេ! គណនី Gmail នេះមិនទាន់បានចុះឈ្មោះក្នុងប្រព័ន្ធឡើយ។ (This Gmail is not registered yet)`
          : `This Gmail (${email || 'Gmail'}) was not found in the system! Please click "Register" to create a new account.`
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // Click on "Continue with Google" button: Opens Native Google Identity Services OAuth 2.0 Popup
  const handleGoogleSignInClick = () => {
    playSound.click?.();
    setErrorMessage('');
    setSuccessMessage('');

    const clientId = (googleClientId || '').trim() || '398760173693-c21013b3ih3e8b2kk5kfnau9khbtj96j.apps.googleusercontent.com';

    if (window.google?.accounts?.oauth2) {
      try {
        setGoogleLoading(true);
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setGoogleLoading(false);
              if (tokenResponse.error !== 'popup_closed_by_user') {
                setErrorMessage(lang === 'km' ? 'ការផ្ទៀងផ្ទាត់ជាមួយ Google មិនជោគជ័យ' : 'Google authentication failed.');
              }
              return;
            }
            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const profile = await res.json();
                await executeGoogleAuth(profile);
              } catch (e) {
                console.error('Fetch Google user info error:', e);
              } finally {
                setGoogleLoading(false);
              }
            }
          },
          error_callback: (err) => {
            setGoogleLoading(false);
            console.warn('Google Token Client error_callback:', err);
            if (err?.type === 'popup_closed') return;
            setErrorMessage(lang === 'km' ? 'សូមអនុញ្ញាត Popup Window សម្រាប់ Google Sign-In' : 'Please allow popups for Google Sign-In.');
          }
        });

        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e) {
        setGoogleLoading(false);
        console.warn('Google OAuth token client exception:', e);
        setErrorMessage(lang === 'km' ? 'មានបញ្ហាក្នុងការបើកផ្ទាំង Google Sign-In' : 'Failed to open Google Sign-In popup.');
      }
    } else {
      setErrorMessage(
        lang === 'km' 
          ? 'កំពុងដំណើរការផ្ទុក Google API... សូមព្យាយាមម្ដងទៀតក្នុងពេលបន្តិចទៀត។' 
          : 'Loading Google Identity Services SDK, please try again in a moment.'
      );
    }
  };

  // Google OAuth for Register: Verifies authentic Google account and pre-fills real details
  const handleGoogleRegisterClick = () => {
    playSound.click?.();
    setErrorMessage('');
    setSuccessMessage('');
    setGoogleLoading(true);

    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId || DEFAULT_GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const profile = await userInfoRes.json();
                if (profile && profile.email) {
                  const verifiedEmail = profile.email.toLowerCase();
                  setRegEmail(verifiedEmail);
                  if (profile.name) {
                    setRegFullNameKm(profile.name);
                    setRegFullNameEn(profile.name.toUpperCase());
                  }
                  setSuccessMessage(
                    lang === 'km' 
                      ? `បានផ្ទៀងផ្ទាត់គណនី Google (${verifiedEmail}) ពិតប្រាកដជោគជ័យ!`
                      : `Verified authentic Google account (${verifiedEmail}) successfully!`
                  );
                }
              } catch (err) {
                console.error('Fetch Google userinfo error:', err);
                setErrorMessage(lang === 'km' ? 'មិនអាចទាញយកព័ត៌មាន Google បានទេ' : 'Failed to fetch Google profile info.');
              } finally {
                setGoogleLoading(false);
              }
            } else {
              setGoogleLoading(false);
            }
          },
          error_callback: (err) => {
            setGoogleLoading(false);
            console.warn('Google Token Client Error:', err);
            if (err?.type === 'popup_closed') return;
            setErrorMessage(lang === 'km' ? 'សូមអនុញ្ញាត Popup Window សម្រាប់ Google' : 'Please allow popups for Google.');
          }
        });

        client.requestAccessToken({ prompt: 'select_account' });
      } catch (e) {
        setGoogleLoading(false);
        console.warn('Google OAuth token client exception:', e);
        setErrorMessage(lang === 'km' ? 'មានបញ្ហាក្នុងការបើកផ្ទាំង Google' : 'Failed to open Google popup.');
      }
    } else {
      setGoogleLoading(false);
      setErrorMessage(
        lang === 'km' 
          ? 'កំពុងដំណើរការផ្ទុក Google API... សូមព្យាយាមម្ដងទៀតក្នុងពេលបន្តិចទៀត។' 
          : 'Loading Google Identity Services SDK, please try again in a moment.'
      );
    }
  };

  // 5. Register Handler: Directly creates student account in DB
  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!regFullNameKm.trim() && !regFullNameEn.trim()) {
      setErrorMessage(lang === 'km' ? 'សូមបញ្ចូលឈ្មោះពេញរបស់ប្អូន!' : 'Please enter your full name.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage(lang === 'km' ? 'លេខសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ!' : 'Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage(lang === 'km' ? 'លេខសម្ងាត់ទាំងពីរមិនដូចគ្នាទេ!' : 'Passwords do not match.');
      return;
    }

    const emailValue = (regEmail || '').trim().toLowerCase();
    if (!emailValue || !emailValue.includes('@')) {
      setErrorMessage(lang === 'km' ? 'សូមបញ្ចូលអាសយដ្ឋាន Gmail/Email ត្រឹមត្រូវដើម្បីទទួលលេខកូដសម្ងាត់ OTP!' : 'Please enter a valid Gmail address to receive your OTP code.');
      return;
    }

    if (emailValue.endsWith('@gmail.com')) {
      const userPart = emailValue.replace('@gmail.com', '');
      if (userPart.length < 6 || userPart.length > 30) {
        setErrorMessage(
          lang === 'km' 
            ? `អាសយដ្ឋាន Gmail (${emailValue}) មិនត្រឹមត្រូវទេ! ឈ្មោះ Gmail ត្រូវមានប្រវែងយ៉ាងតិច ៦ តួអក្សរ។` 
            : `Gmail address must be between 6 and 30 characters.`
        );
        return;
      }
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const newStudentData = {
      username: (regFullNameEn.trim() || regFullNameKm.trim() || emailValue.split('@')[0]).toLowerCase().replace(/\s+/g, '.'),
      password: regPassword,
      fullName: regFullNameKm.trim() || regFullNameEn.trim(),
      fullNameEn: regFullNameEn.trim(),
      email: emailValue,
      grade: regGrade,
      stream: regStream,
      school: regSchoolName.trim() || 'វិទ្យាល័យជាតិកម្ពុជា',
      studentId: regStudentID.trim() || `BACII-${Date.now().toString().slice(-6)}`,
      avatar: regAvatar || '/assets/anime/boys/boy_1.png'
    };

    setPendingRegData(newStudentData);

    try {
      const otpRes = await api.sendOtp({
        target: emailValue,
        purpose: 'register'
      });

      if (otpRes.success) {
        playSound.click?.();
        const finalTarget = otpRes.resolvedTarget || otpRes.target || emailValue;
        setOtpTarget(finalTarget);

        const nameParts = (regFullNameKm.trim() || regFullNameEn.trim()).split(' ');
        setOtpLastName(nameParts[0] || regFullNameKm.trim());
        setOtpFirstName(nameParts.slice(1).join(' ') || nameParts[0]);
        setOtpNickname((regFullNameEn.trim() || emailValue.split('@')[0]).toLowerCase().replace(/\s+/g, '.'));
        setOtpPassword(regPassword);
        setOtpConfirmPassword(regConfirmPassword);
        setOtpSchool(regSchoolName);
        setOtpGrade(regGrade);
        setOtpStream(regStream);

        setOtpStep(2);
        setActiveTab('login');
        setOtpTimer(60);
        if (otpRes.previewCode) {
          setOtpDigits(otpRes.previewCode.split(''));
          setSuccessMessage(
            lang === 'km'
              ? `✨ លេខកូដ OTP សាកល្បង៖ ${otpRes.previewCode} (បានបំពេញស្វ័យប្រវត្តិតាមរយៈ Demo Mode)`
              : `✨ Preview OTP Code: ${otpRes.previewCode} (Auto-filled via Demo Mode)`
          );
        } else {
          setOtpDigits(['', '', '', '', '', '']);
          setSuccessMessage(
            lang === 'km'
              ? `លេខកូដសម្ងាត់ OTP ៦ ខ្ទង់ត្រូវបានផ្ញើទៅកាន់ ${finalTarget} រួចរាល់ហើយ! សូមពិនិត្យប្រអប់សំបុត្រ Gmail របស់អ្នក (Inbox/Spam)។`
              : `6-Digit OTP code sent to ${finalTarget}! Please check your Gmail inbox (or Spam folder).`
          );
        }
        setTimeout(() => {
          otpInputRefs[0]?.current?.focus();
        }, 200);
      }
    } catch (err) {
      console.warn('Backend send OTP error during registration:', err);
      const errMsg = err.data?.error || err.message || (lang === 'km' ? 'ការផ្ញើលេខកូដ OTP បរាជ័យ' : 'Failed to send OTP code to Gmail');
      setErrorMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071322] flex flex-col justify-between font-kantumruy text-slate-100 selection:bg-[#005baa] selection:text-white relative overflow-x-hidden">
      
      {/* 🌟 GRAND BACKGROUND WITH WAVING CAMBODIA FLAG & MINISTRY WATERMARK */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/assets/cambodia-flag.gif"
          onError={(e) => { e.currentTarget.src = 'https://media1.tenor.com/m/kDXhibIv45EAAAAC/cambodia-cambodia-flag.gif'; }}
          alt="Cambodia Flag Background"
          className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-90 contrast-115 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071322]/85 via-[#071322]/75 to-[#071322]/90" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-blue-500/20 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
            <img 
              src="/assets/moeys-crest-transparent.png" 
              alt="Official Ministry Background Logo" 
              className="w-[480px] h-[480px] sm:w-[650px] sm:h-[650px] lg:w-[750px] lg:h-[750px] object-contain opacity-[0.16] filter drop-shadow-[0_20px_60px_rgba(245,158,11,0.25)]" 
            />
          </div>
        </div>
      </div>

      {/* Top Official Banner Bar */}
      <div className="bg-[#001730]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-slate-300 relative z-20">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-400 font-cinzel tracking-wider">
            KINGDOM OF CAMBODIA
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">
            ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowGoogleConfigModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title="Configure Google Client ID"
          >
            <Settings className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Google API Key</span>
          </button>

          <button
            type="button"
            onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'km' ? 'ភាសាខ្មែរ (KM)' : 'English (EN)'}</span>
          </button>
        </div>
      </div>

      {/* Center Layout: 2-Column Split Portal */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-[#0c1f38]/90 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-[0_30px_90px_rgba(0,10,30,0.85)] overflow-hidden">
          
          {/* Left Column: Official Ministry Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#00244d] via-[#001c3d] to-[#00142e] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
            
            <div className="absolute right-[-15%] bottom-[-10%] w-72 h-72 opacity-20 pointer-events-none">
              <img 
                src="/assets/moeys-crest-transparent.png" 
                alt="" 
                className="w-full h-full object-contain filter drop-shadow-md" 
              />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 max-w-[56px] max-h-[56px] flex-shrink-0">
                  <img 
                    src="/assets/moeys-crest-transparent.png" 
                    alt="Official Crest" 
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-black text-sm sm:text-[15px] text-white tracking-tight">
                    ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់
                  </span>
                  <span className="font-bold text-[9px] text-amber-400 tracking-wider uppercase font-cinzel mt-0.5">
                    MINISTRY OF TALENT DEVELOPMENT & ADVANCED RESEARCH
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {lang === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រងការសិក្សាឌីជីថលកម្រិតវិទ្យាល័យជាតិ' : 'National Digital High School Learning Platform'}
                </h2>
                <p className="text-xs text-slate-300/80 leading-relaxed">
                  {lang === 'km' 
                    ? 'ច្រកទ្វារផ្ទៀងផ្ទាត់អត្តសញ្ញាណសិស្សផ្លូវការ ស្របតាមកម្មវិធីអប់រំជាតិ ថ្នាក់ទី១០ ទី១១ និងទី១២ នៃព្រះរាជាណាចក្រកម្ពុជា។'
                    : 'Official Ministry portal supporting Google OAuth 2.0 API, instant 6-digit OTP login, national Bac II exam archives, and interactive learning tools.'}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">
                      {lang === 'km' ? 'កម្មវិធីសិក្សា និងសៀវភៅពុម្ពស្តង់ដារ' : 'National Curriculum & Textbooks'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'km' ? 'មេរៀន និងវីដេអូបង្រៀនផ្លូវការគ្រប់មុខវិជ្ជា' : 'Official Grade 10-12 subjects and videos'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">
                      {lang === 'km' ? 'បណ្ណសារវិញ្ញាសាប្រឡងបាក់ឌុបជាតិ' : 'Official Bac II Exam Archive'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'km' ? 'វិញ្ញាសាពេញលេញ ២០១៤-២០២៤ ព្រមទាំងអត្រាកំណែ' : 'Verified exam papers & solution keys'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <GraduationCap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">
                      {lang === 'km' ? 'ចូលប្រើរហ័ស & សុវត្ថិភាពខ្ពស់' : 'Fast & Secure Access'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'km' ? 'គាំទ្រការចូលតាម Google & OTP ៦ ខ្ទង់' : 'Supports Google OAuth & 6-digit OTP codes'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+855 66 901 800</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>info@moeys.gov.kh</span>
              </div>
            </div>

          </div>

          {/* Right Column: Multi-Method Authentication Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#0a1829]">
            
            <div className="space-y-5">
              
              {/* Header Tab Switcher: Sign In | Register */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-4 sm:gap-6">
                  
                  {/* Tab 1: Sign In */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setOtpStep(1); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`text-xs sm:text-sm font-black transition-colors cursor-pointer relative pb-1 flex items-center gap-1.5 ${
                      activeTab === 'login' 
                        ? 'text-amber-400 border-b-2 border-amber-400' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'ចូលប្រព័ន្ធ' : 'Sign In'}</span>
                  </button>

                  {/* Tab 2: Register */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`text-xs sm:text-sm font-black transition-colors cursor-pointer relative pb-1 flex items-center gap-1.5 ${
                      activeTab === 'register' 
                        ? 'text-emerald-400 border-b-2 border-emerald-400' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'ចុះឈ្មោះសិស្ស' : 'Register'}</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MoEYS SSO</span>
                </div>
              </div>

              {/* Toast Messages */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold animate-fadeIn flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold animate-fadeIn flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* 🌟 TAB 1: SIGN IN TAB (Step 1: Google One-Click Login & OTP Gateway) */}
              {activeTab === 'login' && otpStep === 1 && (
                <div className="space-y-5 animate-fadeIn py-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/30 via-[#001730] to-cyan-950/30 border border-cyan-500/20 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto shadow-inner">
                      <ShieldCheck className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="font-extrabold text-white text-sm">
                      {lang === 'km' ? 'ច្រកទ្វារសុវត្ថិភាពសិស្សថ្នាក់ជាតិ' : 'National MoEYS Student Portal'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                      {lang === 'km' 
                        ? 'ចូលប្រើប្រាស់ដោយផ្ទាល់តាមរយៈគណនី Google ដែលបានចុះឈ្មោះក្នុងប្រព័ន្ធ។' 
                        : 'Sign in securely using your registered Google account.'}
                    </p>
                  </div>

                  {/* 🌟 PROMINENT GOOGLE LOGIN BUTTON */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleGoogleSignInClick}
                      disabled={googleLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-[0.99] cursor-pointer border border-slate-200 relative group overflow-hidden"
                    >
                      {googleLoading ? (
                        <span className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                            {lang === 'km' ? 'ចូលដោយប្រើគណនី Google (Sign In with Google)' : 'Sign In with Google'}
                          </span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span>{lang === 'km' ? 'មិនទាន់មានគណនី?' : "No account?"}</span>
                        <button
                          type="button"
                          onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
                          className="text-emerald-400 hover:underline font-bold cursor-pointer"
                        >
                          {lang === 'km' ? 'ចុះឈ្មោះសិស្សថ្មី' : 'Register now'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => { window.location.href = '/admin'; }}
                        className="text-amber-400/80 hover:text-amber-300 hover:underline font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        <span>{lang === 'km' ? 'ផ្ទាំងបញ្ជា Admin' : 'Admin Portal'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 🌟 STEP 2: 6-Digit OTP PIN Verification (Inside Sign In Tab) */}
              {activeTab === 'login' && otpStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-center animate-fadeIn">
                  <div className="flex items-center justify-between text-xs bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 text-left">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">
                          {lang === 'km' ? 'លេខកូដបានផ្ញើទៅកាន់៖' : 'OTP Code sent to:'}
                        </span>
                        <span className="font-bold text-white text-xs">{otpTarget}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
                    >
                      {lang === 'km' ? 'កែប្រែ (Change)' : 'Change'}
                    </button>
                  </div>

                      {/* 6 Digit Input Segmented Boxes */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 block">
                          {lang === 'km' ? 'បញ្ចូលលេខកូដសម្ងាត់ ៦ ខ្ទង់' : 'Enter 6-Digit Verification PIN'}
                        </label>
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              ref={otpInputRefs[index]}
                              type="text"
                              maxLength={6}
                              value={digit}
                              onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black bg-[#050f1c] border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all font-mono"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Resend Timer & Quick Fill */}
                      <div className="flex items-center justify-end text-xs px-1">
                        <div>
                          {otpTimer > 0 ? (
                            <span className="text-slate-400 text-xs font-mono">
                              {lang === 'km' ? `ផ្ញើឡើងវិញក្នុង (${otpTimer}s)` : `Resend in ${otpTimer}s`}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleSendOtp(e, otpTarget)}
                              disabled={otpSending}
                              className="text-amber-400 hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className={`w-3 h-3 ${otpSending ? 'animate-spin' : ''}`} />
                              <span>{lang === 'km' ? 'ផ្ញើលេខកូដឡើងវិញ' : 'Resend Code'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Verify Button */}
                      <button
                        type="submit"
                        disabled={otpVerifying || otpDigits.join('').length < 6}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 border border-cyan-400/40 text-white font-black text-xs sm:text-sm cursor-pointer shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {otpVerifying ? (
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <span>{lang === 'km' ? 'ផ្ទៀងផ្ទាត់លេខកូដ (Verify PIN)' : 'Verify OTP PIN'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* ── STEP 3: Complete Student Profile, School, Grade 1-12 & Password ── */}
                  {activeTab === 'login' && otpStep === 3 && (
                    <form onSubmit={handleCompleteOtpProfile} className="space-y-3 animate-fadeIn text-left">
                      
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{lang === 'km' ? 'លេខកូដផ្ទៀងផ្ទាត់ត្រឹមត្រូវ! សូមបំពេញព័ត៌មានខាងក្រោម' : 'OTP Verified! Please enter your details below.'}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 rounded-md font-mono text-emerald-200">{otpTarget}</span>
                      </div>

                      {/* 1. Last Name & First Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-200">
                            {lang === 'km' ? 'គោត្តនាម (Last Name / ត្រកូល) *' : 'Last Name (Family Name) *'}
                          </label>
                          <input
                            type="text"
                            value={otpLastName}
                            onChange={(e) => setOtpLastName(e.target.value)}
                            placeholder="e.g. សុខ ឬ Sok"
                            className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold transition-all"
                            required
                            autoFocus
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-200">
                            {lang === 'km' ? 'នាមខ្លួន (First Name / ឈ្មោះ) *' : 'First Name (Given Name) *'}
                          </label>
                          <input
                            type="text"
                            value={otpFirstName}
                            onChange={(e) => setOtpFirstName(e.target.value)}
                            placeholder="e.g. វិបុល ឬ Vibol"
                            className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* 2. Nickname / Username */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                          <span>{lang === 'km' ? 'ឈ្មោះហៅក្រៅ / ឈ្មោះគណនី (Nickname / Username) *' : 'Nickname / Username *'}</span>
                          <span className="text-[10px] text-slate-400">e.g. vibol.dev</span>
                        </label>
                        <input
                          type="text"
                          value={otpNickname}
                          onChange={(e) => setOtpNickname(e.target.value)}
                          placeholder="e.g. vibol.dev ឬ riki_pro"
                          className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold transition-all"
                          required
                        />
                      </div>

                      {/* 3. Password & Confirm Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-200">
                            {lang === 'km' ? 'លេខសម្ងាត់ថ្មី (Password) *' : 'Create Password *'}
                          </label>
                          <div className="relative">
                            <input
                              type={showOtpPassword ? 'text' : 'password'}
                              value={otpPassword}
                              onChange={(e) => setOtpPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#050f1c] border border-white/15 rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowOtpPassword(!showOtpPassword)}
                              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                            >
                              {showOtpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-200">
                            {lang === 'km' ? 'ផ្ទៀងផ្ទាត់លេខសម្ងាត់ (Confirm) *' : 'Confirm Password *'}
                          </label>
                          <input
                            type={showOtpPassword ? 'text' : 'password'}
                            value={otpConfirmPassword}
                            onChange={(e) => setOtpConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* 4. School Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                          <span>{lang === 'km' ? 'ឈ្មោះសាលា / វិទ្យាល័យ (School Name) *' : 'School / High School Name *'}</span>
                        </label>
                        <input
                          type="text"
                          value={otpSchool}
                          onChange={(e) => setOtpSchool(e.target.value)}
                          placeholder="e.g. វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ ឬ វិទ្យាល័យ បាក់ទូក"
                          className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold transition-all"
                          required
                        />
                      </div>

                      {/* 5. Grade (1 to 12) & Stream */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-200">
                            {lang === 'km' ? 'កម្រិតថ្នាក់ (Grade 1 - 12) *' : 'Grade (Grades 1 to 12) *'}
                          </label>
                          <select
                            value={otpGrade}
                            onChange={(e) => setOtpGrade(e.target.value)}
                            className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                          >
                            {ALL_GRADES.map((g) => (
                              <option key={g.value} value={g.value} className="bg-[#0c1f38]">
                                {lang === 'km' ? g.labelKm : g.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-200">
                            {lang === 'km' ? 'ផ្នែកសិក្សា (Stream) *' : 'Stream *'}
                          </label>
                          <select
                            value={otpStream}
                            onChange={(e) => setOtpStream(e.target.value)}
                            className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                          >
                            <option value="science" className="bg-[#0c1f38]">🔬 វិទ្យាសាស្ត្រពិត (Science)</option>
                            <option value="social" className="bg-[#0c1f38]">📚 វិទ្យាសាស្ត្រសង្គម (Social)</option>
                            <option value="general" className="bg-[#0c1f38]">🎒 មូលដ្ឋានទូទៅ (General)</option>
                          </select>
                        </div>
                      </div>

                      {/* Submit Profile */}
                      <button
                        type="submit"
                        disabled={otpSubmitting}
                        className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border border-emerald-400/50 text-white font-black text-xs sm:text-sm cursor-pointer shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                      >
                        {otpSubmitting ? (
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>{lang === 'km' ? 'បង្កើតគណនី និងចូលប្រព័ន្ធ (Create & Start Learning)' : 'Create Account & Start Learning'}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

              {/* 🌟 TAB 2: REGISTRATION VIEW */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-200">
                        {lang === 'km' ? 'ឈ្មោះជាភាសាខ្មែរ' : 'Full Name (Khmer)'}
                      </label>
                      <input
                        type="text"
                        value={regFullNameKm}
                        onChange={(e) => setRegFullNameKm(e.target.value)}
                        placeholder="e.g. សុខ វិបុល"
                        className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-200">
                        {lang === 'km' ? 'ឈ្មោះជាអក្សរឡាតាំង' : 'Full Name (Latin)'}
                      </label>
                      <input
                        type="text"
                        value={regFullNameEn}
                        onChange={(e) => setRegFullNameEn(e.target.value)}
                        placeholder="e.g. SOK VIBOL"
                        className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold uppercase font-cinzel"
                      />
                    </div>
                  </div>

                  {/* 🌟 GOOGLE VERIFIED REAL GMAIL SELECTOR */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'km' ? 'ផ្ទៀងផ្ទាត់គណនី Google (Real Gmail Verification) *' : 'Authentic Google Account *'}</span>
                      </span>
                      {regEmail && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Google Verified</span>
                        </span>
                      )}
                    </label>

                    {regEmail ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          <span className="font-bold text-emerald-300 text-xs font-mono">{regEmail}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleGoogleRegisterClick}
                          className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
                        >
                          {lang === 'km' ? 'ប្ដូរគណនី (Change)' : 'Change'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGoogleRegisterClick}
                        disabled={googleLoading}
                        className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 shadow-md border border-slate-200 transition-all cursor-pointer"
                      >
                        {googleLoading ? (
                          <span className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span className="font-extrabold text-slate-800">
                              {lang === 'km' ? 'ចុចទីនេះដើម្បីផ្ទៀងផ្ទាត់ Gmail តាមរយៈ Google (Verify Real Gmail)' : 'Click to Verify Real Gmail via Google'}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-200">
                      {lang === 'km' ? 'ឈ្មោះវិទ្យាល័យ / សាលារៀន' : 'High School / School Name'}
                    </label>
                    <input
                      type="text"
                      value={regSchoolName}
                      onChange={(e) => setRegSchoolName(e.target.value)}
                      placeholder="e.g. វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ"
                      className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-200">
                        {lang === 'km' ? 'កម្រិតថ្នាក់ (Grade 1 - 12)' : 'Grade (1 to 12)'}
                      </label>
                      <select
                        value={regGrade}
                        onChange={(e) => setRegGrade(e.target.value)}
                        className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                      >
                        {ALL_GRADES.map((g) => (
                          <option key={g.value} value={g.value} className="bg-[#0c1f38]">
                            {lang === 'km' ? g.labelKm : g.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-200">
                        {lang === 'km' ? 'ផ្នែកសិក្សា (Stream)' : 'Stream'}
                      </label>
                      <select
                        value={regStream}
                        onChange={(e) => setRegStream(e.target.value)}
                        className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                      >
                        <option value="science" className="bg-[#0c1f38]">🔬 វិទ្យាសាស្ត្រពិត (Science)</option>
                        <option value="social" className="bg-[#0c1f38]">📚 វិទ្យាសាស្ត្រសង្គម (Social)</option>
                        <option value="general" className="bg-[#0c1f38]">🎒 មូលដ្ឋានទូទៅ (General)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-200">
                        {lang === 'km' ? 'បង្កើតលេខសម្ងាត់' : 'Create Password'}
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-200">
                        {lang === 'km' ? 'បញ្ជាក់លេខសម្ងាត់' : 'Confirm Password'}
                      </label>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border border-emerald-400/40 text-white font-black text-xs sm:text-sm cursor-pointer shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span>{lang === 'km' ? 'បង្កើតគណនី & ចូលប្រើប្រាស់' : 'Register Account & Enter'}</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

            {/* Bottom Security Notice */}
            <div className="pt-5 mt-3 border-t border-white/10 flex items-center justify-between text-[10.5px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google OAuth 2.0 API & SSL Encrypted Official Gate</span>
              </span>
              <span>© {new Date().getFullYear()} MoEYS Cambodia</span>
            </div>

          </div>

        </div>
      </div>

      {/* 🌟 GOOGLE CLIENT ID CONFIGURATION MODAL */}
      {showGoogleConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0e223d] border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left relative">
            
            <button
              type="button"
              onClick={() => setShowGoogleConfigModal(false)}
              className="absolute right-4 top-4 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-400">
              <Settings className="w-5 h-5" />
              <h3 className="text-sm font-black text-white">Google OAuth Client ID & API Key</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If you have created a Google Cloud Console OAuth 2.0 Web Client ID, paste it below to enable official Google Sign-In popup with your credentials.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300">
                Google Client ID (`xxxx.apps.googleusercontent.com`):
              </label>
              <input
                type="text"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                className="w-full bg-[#050f1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('khmer_google_client_id', googleClientId.trim());
                  setShowGoogleConfigModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-all"
              >
                {lang === 'km' ? 'រក្សាទុក (Save Config)' : 'Save Configuration'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setGoogleClientId('');
                  localStorage.removeItem('khmer_google_client_id');
                }}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs cursor-pointer transition-all"
              >
                Reset
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Official Footer Notice */}
      <div className="bg-[#001730] border-t border-white/10 py-3 px-4 text-center text-xs text-slate-400">
        <span>
          ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់ • រក្សាសិទ្ធិគ្រប់យ៉ាងស្របតាមច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា
        </span>
      </div>

    </div>
  );
}
