#!/usr/bin/env node
/**
 * 🎓 National Bac II 20,000 Question Bank Management & Query Tool
 * Use this tool to query, sample, filter, inspect, and export questions from the 20,000 Question Bank.
 * 
 * Usage Examples:
 *   node tools/question_bank_tool.mjs --stats
 *   node tools/question_bank_tool.mjs --query "អាំងតេក្រាល"
 *   node tools/question_bank_tool.mjs --sample 5 --subject math
 *   node tools/question_bank_tool.mjs --sample 10 --stream social --grade 12
 *   node tools/question_bank_tool.mjs --export custom_exam.json --subject history --count 20
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'server', 'data', 'master_question_bank_20000.json');

if (!fs.existsSync(DB_PATH)) {
  console.error(`❌ Question bank database not found at ${DB_PATH}. Please run: node build_20000_questions.mjs`);
  process.exit(1);
}

const rawData = fs.readFileSync(DB_PATH, 'utf-8');
const questions = JSON.parse(rawData);

// Parse CLI Args
const args = process.argv.slice(2);

function printHelp() {
  console.log(`
📚 ធនាគារវិញ្ញាសាជាតិ ២០,០០០ សំណួរ - National Question Bank CLI Tool
---------------------------------------------------------------------
Commands & Options:
  --stats                       Show pool statistics & subject breakdown
  --query <keyword>             Search questions & solutions by keyword
  --sample [N=5]                Get N random questions
    --subject <key>             Filter sample by subject (math, physics, chem, bio, khmer, history, geo, civics)
    --stream <science|social>   Filter sample by stream
    --grade <10|11|12>          Filter sample by grade level
  --export <file.json>          Export filtered questions to a JSON file
    --count <N>                 Number of questions to export (default: 20)
  --help                        Show this help message
`);
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

// 1. STATS
if (args.includes('--stats')) {
  const stats = {
    total: questions.length,
    science: questions.filter(q => q.stream === 'science').length,
    social: questions.filter(q => q.stream === 'social').length,
    bySubject: {},
    byGrade: { '10': 0, '11': 0, '12': 0 }
  };

  questions.forEach(q => {
    stats.bySubject[q.subject] = (stats.bySubject[q.subject] || 0) + 1;
    if (stats.byGrade[q.grade] !== undefined) {
      stats.byGrade[q.grade]++;
    }
  });

  console.log(`\n======================================================`);
  console.log(`🎓 ស្ថិតិធនាគារសំណួរប្រឡងថ្នាក់ជាតិ ២០,០០០ សំណួរ (20,000 Questions Pool)`);
  console.log(`======================================================`);
  console.log(`⭐ សរុបទាំងអស់ (Total):          ${stats.total.toLocaleString()} សំណួរ`);
  console.log(`🔬 ថ្នាក់វិទ្យាសាស្ត្រពិត (Science): ${stats.science.toLocaleString()} សំណួរ`);
  console.log(`📚 ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social):  ${stats.social.toLocaleString()} សំណួរ\n`);
  
  console.log(`📊 បែងចែកតាមមុខវិជ្ជា (By Subject):`);
  Object.entries(stats.bySubject).forEach(([sub, count]) => {
    console.log(`  - ${sub.padEnd(28, ' ')}: ${count.toLocaleString()} សំណួរ`);
  });

  console.log(`\n🏫 បែងចែកតាមកម្រិតថ្នាក់ (By Grade):`);
  Object.entries(stats.byGrade).forEach(([grd, count]) => {
    console.log(`  - ថ្នាក់ទី ${grd} (Grade ${grd})               : ${count.toLocaleString()} សំណួរ`);
  });
  console.log(`======================================================\n`);
  process.exit(0);
}

// 2. QUERY / SEARCH
const queryIdx = args.indexOf('--query');
if (queryIdx !== -1 && args[queryIdx + 1]) {
  const keyword = args[queryIdx + 1].toLowerCase();
  const matched = questions.filter(q => 
    q.q.toLowerCase().includes(keyword) || 
    (q.explanation && q.explanation.toLowerCase().includes(keyword)) ||
    (q.chapter && q.chapter.toLowerCase().includes(keyword))
  );

  console.log(`\n🔍 ស្វែងរកពាក្យគន្លឹះ "${keyword}": រកឃើញ ${matched.length} សំណួរ\n`);
  matched.slice(0, 10).forEach((q, idx) => {
    console.log(`[${idx + 1}] (${q.subject} - ${q.grade} | ${q.chapter})`);
    console.log(`    សំណួរ៖ ${q.q}`);
    console.log(`    ចម្លើយត្រឹមត្រូវ៖ ជម្រើស ${['ក', 'ខ', 'គ', 'ឃ'][q.answer]} => ${q.options[q.answer]}`);
    console.log(`    ពន្យល់៖ ${q.explanation}\n`);
  });

  if (matched.length > 10) {
    console.log(`... និងមាន ${matched.length - 10} សំណួរទៀត (បង្ហាញត្រឹម ១០ សំណួរដំបូង)`);
  }
  process.exit(0);
}

// 3. SAMPLE / FILTER / EXPORT
let filtered = [...questions];

const streamIdx = args.indexOf('--stream');
if (streamIdx !== -1 && args[streamIdx + 1]) {
  filtered = filtered.filter(q => q.stream === args[streamIdx + 1]);
}

const subIdx = args.indexOf('--subject');
if (subIdx !== -1 && args[subIdx + 1]) {
  filtered = filtered.filter(q => q.subjectKey === args[subIdx + 1]);
}

const gradeIdx = args.indexOf('--grade');
if (gradeIdx !== -1 && args[gradeIdx + 1]) {
  filtered = filtered.filter(q => q.grade === args[gradeIdx + 1]);
}

// Check if Export
const exportIdx = args.indexOf('--export');
if (exportIdx !== -1 && args[exportIdx + 1]) {
  const countIdx = args.indexOf('--count');
  const count = countIdx !== -1 && args[countIdx + 1] ? parseInt(args[countIdx + 1], 10) : 20;

  // Shuffle and slice
  const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, count);
  const outputFile = path.resolve(process.cwd(), args[exportIdx + 1]);

  fs.writeFileSync(outputFile, JSON.stringify(shuffled, null, 2), 'utf-8');
  console.log(`✅ ជោគជ័យ! បាននាំចេញ ${shuffled.length} សំណួរទៅកាន់ឯកសារ៖ ${outputFile}`);
  process.exit(0);
}

// Sample command
const sampleIdx = args.indexOf('--sample');
if (sampleIdx !== -1) {
  const sampleCount = (args[sampleIdx + 1] && !args[sampleIdx + 1].startsWith('--')) 
    ? parseInt(args[sampleIdx + 1], 10) 
    : 5;

  const sampled = filtered.sort(() => 0.5 - Math.random()).slice(0, sampleCount);

  console.log(`\n🎲 គំរូសំណួរចៃដន្យ ${sampled.length} សំណួរ ពីធនាគារសំណួរជាតិ ២០,០០០៖\n`);
  sampled.forEach((q, idx) => {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`សំណួរទី ${idx + 1} [#${q.id}] [${q.subject} | ថ្នាក់ទី ${q.grade} | ${q.chapter}]`);
    console.log(`ប្រធាន៖ ${q.q}\n`);
    console.log(`ជម្រើស៖`);
    q.options.forEach((opt, oIdx) => {
      const marker = oIdx === q.answer ? '✓' : ' ';
      console.log(`  [${['ក', 'ខ', 'គ', 'ឃ'][oIdx]}] ${opt} ${marker}`);
    });
    console.log(`\n💡 ដំណោះស្រាយ៖ ${q.explanation}`);
  });
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  process.exit(0);
}
