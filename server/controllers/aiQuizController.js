// ============================================================================
// AI-Powered Academic Quiz Question Generator
// Uses Gemini API to generate grade-appropriate multiple-choice questions
// Supports grades 1-12, Science/Social Science tracks, and all subjects
// ============================================================================

const AI_API_KEY = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '';
const AI_MODELS = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemma-4-26b-a4b-it'];

/**
 * Clean raw markdown/formatting from AI response
 */
function cleanAIText(text) {
  if (!text) return '';
  return text
    .replace(/\*{2,}/g, '')
    .replace(/\*/g, '')
    .replace(/\${1,2}/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/_{2,}/g, '')
    .trim();
}

/**
 * Build the system prompt for quiz generation based on grade, subject, and stream
 */
function buildQuizPrompt(grade, subject, stream, count = 5) {
  const gradeNum = parseInt(grade, 10) || 12;
  
  let difficultyDesc = '';
  if (gradeNum <= 3) {
    difficultyDesc = 'Questions must be very simple, easy, use short words appropriate for children aged 6-9. Use basic concepts only.';
  } else if (gradeNum <= 6) {
    difficultyDesc = 'Questions should be at elementary level for children aged 10-12. Use clear language with short explanations.';
  } else if (gradeNum <= 9) {
    difficultyDesc = 'Questions at lower secondary level for students aged 13-15. Can include some complex concepts, formulas, and analysis.';
  } else if (gradeNum <= 10) {
    difficultyDesc = 'Questions at upper secondary level. Include theories, formulas, analysis and problem-solving.';
  } else {
    difficultyDesc = 'Questions at the highest level for grade 11-12 students preparing for Bac II exams. Include deep theories, complex formulas, analysis, synthesis and real-world applications.';
  }

  const subjectContextMap = {
    'គណិតវិទ្យា': 'Focus on: calculations, formulas, equations, geometry, statistics, or Calculus (for higher grades)',
    'ភាសាខ្មែរ': 'Focus on: Khmer grammar, literature, composition, poetry, stories, syntax',
    'រូបវិទ្យា': 'Focus on: mechanics, electricity, waves, light, energy, magnetism, nuclear physics',
    'គីមីវិទ្យា': 'Focus on: atoms, chemical equations, acids, bases, pH, organic, inorganic chemistry',
    'ជីវវិទ្យា': 'Focus on: cells, genes, DNA, body systems, ecology, evolution',
    'ប្រវត្តិវិទ្យា': 'Focus on: Cambodian history, Asian and world history, important events and periods',
    'ភូមិវិទ្យា': 'Focus on: geography of Cambodia, Asia, world, climate, natural resources, demographics',
    'សីលធម៌-ពលរដ្ឋវិជ្ជា': 'Focus on: constitution, human rights, law, morality, good citizenship, democracy',
    'ផែនដី និងបរិស្ថាន': 'Focus on: earth science, environmental science, climate change, minerals, geology',
    'ភាសាអង់គ្លេស': 'Focus on: Grammar, Vocabulary, Reading Comprehension, Tenses, Sentence Structure. Questions should be in English.',
    'វិទ្យាសាស្ត្រ': 'Focus on: general science, physics, chemistry, biology, earth science'
  };

  const subjectContext = subjectContextMap[subject] || 'General questions';

  return `You are an expert Cambodian national exam question creator.

Instructions:
- Create ${count} multiple-choice questions for subject "${subject}" at Grade ${gradeNum} level
${stream ? `- Track: ${stream === 'science' ? 'Real Science (វិទ្យាសាស្ត្រពិត)' : 'Social Science (វិទ្យាសាស្ត្រសង្គម)'}` : ''}
- ${difficultyDesc}
- ${subjectContext}
- Questions MUST be in Khmer language (except English subject questions should be in English)
- Each question must have EXACTLY 4 options with 1 correct answer
- The "answer" field is the 0-based index of the correct option

Respond with ONLY a JSON array, no markdown, no code fences:
[
  {
    "q": "Question text in Khmer",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Brief explanation in Khmer (2-3 sentences)"
  }
]

Generate ${count} high-quality questions now:`;
}

/**
 * Parse AI response to extract JSON questions array
 */
function parseAIQuizResponse(rawText) {
  if (!rawText) return null;
  
  let text = rawText.trim();
  text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  text = text.trim();
  
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const valid = parsed.filter(q => 
        q && typeof q.q === 'string' && q.q.trim() &&
        Array.isArray(q.options) && q.options.length >= 3 &&
        typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.options.length
      );
      if (valid.length > 0) return valid;
    }
  } catch (e) {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(q => 
            q && typeof q.q === 'string' && q.q.trim() &&
            Array.isArray(q.options) && q.options.length >= 3 &&
            typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.options.length
          );
          if (valid.length > 0) return valid;
        }
      } catch (e2) {}
    }
  }
  
  return null;
}

/**
 * Call Gemini AI to generate quiz questions
 */
async function callGeminiForQuiz(prompt) {
  for (const modelName of AI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(AI_API_KEY)}`;
    
    // Try with JSON response mode first, then without it
    for (const useJsonMode of [true, false]) {
      try {
        const generationConfig = {
          temperature: 0.8,
          maxOutputTokens: 4096
        };
        if (useJsonMode) {
          generationConfig.responseMimeType = 'application/json';
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{ text: prompt }]
            }],
            generationConfig
          }),
          signal: AbortSignal.timeout(15000)
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 20) {
            const questions = parseAIQuizResponse(text);
            if (questions && questions.length > 0) {
              return questions.map(q => ({
                ...q,
                q: cleanAIText(q.q),
                explanation: cleanAIText(q.explanation || ''),
                options: q.options.map(opt => cleanAIText(String(opt)))
              }));
            }
          }
        }
      } catch (err) {
        console.warn(`[AI Quiz] Model ${modelName} (jsonMode=${useJsonMode}) notice:`, err.message);
      }
    }
  }
  return null;
}

/**
 * Main API Handler: Generate AI Quiz Questions
 * POST /api/ai/quiz-generate
 */
export async function generateAIQuizQuestions(req, res) {
  try {
    const { grade = '12', subject = 'គណិតវិទ្យា', stream = null, count = 5 } = req.body || {};

    if (!AI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI API key not configured',
        questions: [] 
      });
    }

    const safeCount = Math.min(Math.max(parseInt(count, 10) || 5, 3), 10);
    const prompt = buildQuizPrompt(grade, subject, stream, safeCount);
    
    const questions = await callGeminiForQuiz(prompt);
    
    if (questions && questions.length > 0) {
      return res.json({
        success: true,
        questions: questions.map((q, idx) => ({
          ...q,
          id: `ai-quiz-${Date.now()}-${idx}`,
          subject: subject,
          grade: String(grade),
          stream: stream || 'general',
          source: 'AI Generated'
        })),
        meta: {
          grade,
          subject,
          stream,
          count: questions.length,
          generatedAt: new Date().toISOString()
        }
      });
    }

    return res.json({
      success: false,
      questions: [],
      error: 'AI could not generate questions. Please try again.',
      meta: { grade, subject, stream }
    });

  } catch (error) {
    console.error('[AI Quiz Generator Error]:', error);
    return res.status(500).json({
      success: false,
      questions: [],
      error: error.message
    });
  }
}
