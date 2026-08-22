import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting MoTDAR National E-Learning Production Services...');

// 1. Determine Python executable (python3 on Linux/Render, python on Windows)
const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
const pythonDir = path.join(__dirname, 'python_ai');
const pythonScript = path.join(pythonDir, 'ai_engine.py');

console.log(`🧠 Launching Python AI Knowledge Engine (${pythonCmd} ${pythonScript} --server)...`);
const pythonProcess = spawn(pythonCmd, [pythonScript, '--server'], {
  cwd: pythonDir,
  stdio: 'inherit',
  env: { ...process.env, PYTHONUNBUFFERED: '1' }
});

pythonProcess.on('error', (err) => {
  console.warn('⚠️ Python AI process warning (Node.js fallback will be used):', err.message);
});

// 2. Launch Node.js Backend Server
console.log('🌐 Launching Node.js Express Server...');
const serverDir = path.join(__dirname, 'server');
const serverScript = path.join(serverDir, 'server.js');
const nodeProcess = spawn('node', [serverScript], {
  cwd: serverDir,
  stdio: 'inherit',
  env: { ...process.env }
});

nodeProcess.on('exit', (code) => {
  console.log(`Node process exited with code ${code}`);
  if (pythonProcess && !pythonProcess.killed) {
    pythonProcess.kill();
  }
  process.exit(code || 0);
});

// Graceful termination handling
const cleanup = () => {
  console.log('🛑 Shutting down production services...');
  if (pythonProcess && !pythonProcess.killed) pythonProcess.kill();
  if (nodeProcess && !nodeProcess.killed) nodeProcess.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
