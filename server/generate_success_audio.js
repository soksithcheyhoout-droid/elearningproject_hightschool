import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';

const audioDir = 'd:/elearningproject_hightschool/public/assets/audio';

async function generateFile(voiceName, text, filename) {
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
  const successText = 'ការទូទាត់ប្រាក់បានជោគជ័យ! សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការចូលរួមចំណែកឧបត្ថម្ភគាំទ្រ។';

  await generateFile('km-KH-SreymomNeural', successText, 'khmer-payment-sreymom.mp3');
  await generateFile('km-KH-SreymomNeural', successText, 'khmer-payment-success.mp3');
  await generateFile('km-KH-PisethNeural', successText, 'khmer-payment-piseth.mp3');

  console.log('🎉 Payment success audio files generated successfully!');
}

main().catch(console.error);
