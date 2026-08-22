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
  // Natural polite phrase: "QR Code is ready, please scan to make payment. Thank you!"
  const scanText = 'កូដ ឃ្យូអរ បានត្រៀមរួចរាល់ហើយ សូមស្កេនដើម្បីធ្វើការទូទាត់ប្រាក់។ សូមអរគុណ!';

  // Sreymom (Sweet Female Voice)
  await generateFile('km-KH-SreymomNeural', scanText, 'qr-scan-sreymom.mp3');
  await generateFile('km-KH-SreymomNeural', scanText, 'qr-scan-khmer.mp3');

  // Piseth (Male Voice)
  await generateFile('km-KH-PisethNeural', scanText, 'qr-scan-piseth.mp3');

  console.log('🎉 Please scan & Thank you audio files generated successfully!');
}

main().catch(console.error);
