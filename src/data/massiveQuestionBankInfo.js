// Master 20,000 National Examination Question Pool Registry
// 10,000 វិទ្យាសាស្ត្រពិត (Natural Science) + 10,000 វិទ្យាសាស្ត្រសង្គម (Social Science)

export const MASTER_EXAM_BANK_STATS = {
  totalQuestions: 20000,
  scienceCount: 10000,
  socialCount: 10000,
  version: '3.0.0-National-MoEYS-20k',
  streams: {
    science: {
      total: 10000,
      subjects: [
        { nameKm: 'គណិតវិទ្យា (Mathematics)', key: 'math', count: 2500 },
        { nameKm: 'រូបវិទ្យា (Physics)', key: 'physics', count: 2500 },
        { nameKm: 'គីមីវិទ្យា (Chemistry)', key: 'chemistry', count: 2500 },
        { nameKm: 'ជីវវិទ្យា (Biology)', key: 'biology', count: 2500 }
      ]
    },
    social: {
      total: 10000,
      subjects: [
        { nameKm: 'ភាសាខ្មែរ (Khmer Literature)', key: 'khmer', count: 2500 },
        { nameKm: 'ប្រវត្តិវិទ្យា (History)', key: 'history', count: 2500 },
        { nameKm: 'ភូមិវិទ្យា (Geography)', key: 'geography', count: 2500 },
        { nameKm: 'សីលធម៌-ពលរដ្ឋ & សេដ្ឋកិច្ច (Civics & Economics)', key: 'civics', count: 2500 }
      ]
    }
  }
};
