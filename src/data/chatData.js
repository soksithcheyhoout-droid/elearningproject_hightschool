export const INITIAL_GLOBAL_MESSAGES = [];

export const INITIAL_PRIVATE_CONTACTS = [
  {
    id: 'c1',
    name: 'ចាន់ ធីតា (Chan Thida)',
    avatar: '/assets/anime/girl_1.jpg',
    avatarFrame: '/assets/frames/phoenix.webp',
    status: 'online',
    school: 'វិទ្យាល័យព្រះស៊ីសុវត្ថិ',
    lastMessage: 'មិនទាន់មានសារនៅឡើយទេ',
    lastTime: 'Online',
    unreadCount: 0,
    messages: []
  },
  {
    id: 'c2',
    name: 'ម៉េង ហួរ (Meng Hour)',
    avatar: '/assets/anime/boy_2.jpg',
    avatarFrame: '/assets/frames/dragons_smile.webp',
    status: 'online',
    school: 'វិទ្យាល័យហ៊ុនសែនកំពង់កន្ទួត',
    lastMessage: 'មិនទាន់មានសារនៅឡើយទេ',
    lastTime: 'Online',
    unreadCount: 0,
    messages: []
  },
  {
    id: 'c3',
    name: '🤖 AI Study Tutor (គ្រូបង្រៀនឆ្លាតវៃ)',
    avatar: '/assets/anime/boy_3.jpg',
    avatarFrame: '/assets/frames/ki_energy.webp',
    status: 'online',
    school: 'ប្រព័ន្ធ AI ស្វ័យប្រវត្តិកម្ពុជា',
    lastMessage: 'ត្រៀមខ្លួនឆ្លើយសំណួរមេរៀន ២៤/៧',
    lastTime: 'Online',
    unreadCount: 0,
    messages: []
  }
];

export const CHAT_CHANNELS = [
  { id: 'global', name: '🌐 បន្ទប់ជជែកទូទៅ (National Lounge)', icon: 'Globe', desc: 'ជជែកចែករំលែកបទពិសោធន៍សិស្សទូទាំងប្រទេស' },
  { id: 'math', name: '📐 #គណិតវិទ្យា-math', icon: 'Calculator', desc: 'ដោះស្រាយលំហាត់លីមីត អាំងតេក្រាល ធរណីមាត្រ' },
  { id: 'physics', name: '⚡ #រូបវិទ្យា-physics', icon: 'Zap', desc: 'រលក អគ្គិសនី មេដែក និងទែម៉ូឌីណាមិច' },
  { id: 'chemistry', name: '🧪 #គីមីវិទ្យា-chemistry', icon: 'FlaskConical', desc: 'សមីការគីមី គីមីសរីរាង្គ និងកំហាប់សូលុយស្យុង' },
  { id: 'bacii', name: '🎓 #ត្រៀមបាក់ឌុប-bacii-2026', icon: 'GraduationCap', desc: 'កម្រងវិញ្ញាសា និងគន្លឹះដណ្តើមនិទ្ទេស A' },
  { id: 'gaming', name: '🎮 #សង្វៀនប្រកួត-gaming-1v1', icon: 'Gamepad2', desc: 'ស្វែងរកមិត្តភក្តិប្រកួតល្បឿន 1v1 និង Team Squad' }
];
