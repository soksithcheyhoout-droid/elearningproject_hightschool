import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';

const audioDir = 'd:/elearningproject_hightschool/public/assets/audio';

async function generateFile(voiceName, text, filename) {
  console.log(`Generating ${filename} with ${voiceName}...`);
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const targetPath = path.join(audioDir, filename);
  const stream = tts.toStream(text);
  
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.audioStream.on('data', chunk => chunks.push(chunk));
    stream.audioStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(targetPath, buffer);
      console.log(`✅ Saved ${filename} (${buffer.length} bytes)`);
      try { tts.close(); } catch(e) {}
      resolve();
    });
    stream.audioStream.on('error', err => {
      try { tts.close(); } catch(e) {}
      reject(err);
    });
  });
}

async function main() {
  const qrText = 'កូដ ឃ្យូអរ ត្រូវបានបង្កើតដោយជោគជ័យ។ សូមស្កេនទូទាត់ប្រាក់តាមកម្មវិធីបាគង ឬធនាគារណាក៏បាន។';
  const successText = 'ការទូទាត់ប្រាក់បានជោគជ័យ! សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការចូលរួមចំណែកគាំទ្រ។';
  const scanText = 'សូមស្កេនកូដ ឃ្យូអរ ដើម្បីបន្តការទូទាត់។';
  const devText = 'សូមចូលរួមគាំទ្រការអភិវឌ្ឍន៍ប្រព័ន្ធអប់រំ និងការស្រាវជ្រាវកម្រិតខ្ពស់ជាតិ!';

  // Piseth (Male Developer Voice)
  await generateFile('km-KH-PisethNeural', qrText, 'khmer-qr-piseth.mp3');
  await generateFile('km-KH-PisethNeural', successText, 'khmer-payment-piseth.mp3');
  await generateFile('km-KH-PisethNeural', qrText, 'khmer-qr-generated.mp3');
  await generateFile('km-KH-PisethNeural', successText, 'khmer-payment-success.mp3');
  await generateFile('km-KH-PisethNeural', scanText, 'qr-scan-khmer.mp3');
  await generateFile('km-KH-PisethNeural', devText, 'khmer-dev-test-piseth.mp3');

  // Sreymom (Female Voice)
  await generateFile('km-KH-SreymomNeural', qrText, 'khmer-qr-sreymom.mp3');
  await generateFile('km-KH-SreymomNeural', successText, 'khmer-payment-sreymom.mp3');
  await generateFile('km-KH-SreymomNeural', devText, 'khmer-dev-test-sreymom.mp3');

  console.log('🎉 All high-definition voice assets generated successfully!');
}

main().catch(console.error);
