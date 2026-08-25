// Master 12,000 National Examination Question Pool Registry
// 6,000 វិទ្យាសាស្ត្រពិត (Natural Science) + 6,000 វិទ្យាសាស្ត្រសង្គម (Social Science)

export const MASTER_EXAM_BANK_STATS = {
  totalQuestions: 12000,
  scienceCount: 6000,
  socialCount: 6000,
  version: '2.5.0-National-MoEYS',
  streams: {
    science: {
      total: 6000,
      subjects: [
        { nameKm: 'គណិតវិទ្យា (Mathematics)', key: 'math', count: 1500 },
        { nameKm: 'រូបវិទ្យា (Physics)', key: 'physics', count: 1500 },
        { nameKm: 'គីមីវិទ្យា (Chemistry)', key: 'chemistry', count: 1500 },
        { nameKm: 'ជីវវិទ្យា (Biology)', key: 'biology', count: 1500 }
      ]
    },
    social: {
      total: 6000,
      subjects: [
        { nameKm: 'ភាសាខ្មែរ (Khmer Literature)', key: 'khmer', count: 1500 },
        { nameKm: 'ប្រវត្តិវិទ្យា (History)', key: 'history', count: 1500 },
        { nameKm: 'ភូមិវិទ្យា (Geography)', key: 'geography', count: 1500 },
        { nameKm: 'សីលធម៌-ពលរដ្ឋ & សេដ្ឋកិច្ច (Civics & Economics)', key: 'civics', count: 1500 }
      ]
    }
  }
};
