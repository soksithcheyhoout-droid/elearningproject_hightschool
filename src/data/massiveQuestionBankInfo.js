// Master 60,000 National Examination Question Pool Registry
// 30,000 វិទ្យាសាស្ត្រពិត (Natural Science) + 30,000 វិទ្យាសាស្ត្រសង្គម (Social Science)

export const MASTER_EXAM_BANK_STATS = {
  totalQuestions: 60000,
  scienceCount: 30000,
  socialCount: 30000,
  version: '4.0.0-National-MoEYS-60k',
  streams: {
    science: {
      total: 30000,
      subjects: [
        { nameKm: 'គណិតវិទ្យា (Mathematics)', key: 'math', count: 7500 },
        { nameKm: 'រូបវិទ្យា (Physics)', key: 'physics', count: 7500 },
        { nameKm: 'គីមីវិទ្យា (Chemistry)', key: 'chemistry', count: 7500 },
        { nameKm: 'ជីវវិទ្យា (Biology)', key: 'biology', count: 7500 }
      ]
    },
    social: {
      total: 30000,
      subjects: [
        { nameKm: 'ភាសាខ្មែរ (Khmer Literature)', key: 'khmer', count: 7500 },
        { nameKm: 'ប្រវត្តិវិទ្យា (History)', key: 'history', count: 7500 },
        { nameKm: 'ភូមិវិទ្យា (Geography)', key: 'geography', count: 7500 },
        { nameKm: 'សីលធម៌-ពលរដ្ឋ & សេដ្ឋកិច្ច (Civics & Economics)', key: 'civics', count: 7500 }
      ]
    }
  }
};
