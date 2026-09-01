import { spawn, spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting MoTDAR National E-Learning Production Services...');

// 1. Determine Python executable (python3 on Linux/Render, python on Windows)
const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
const pythonDir = path.join(__dirname, 'python_ai');
const pythonScript = path.join(pythonDir, 'ai_engine.py');
const reqFile = path.join(pythonDir, 'requirements.txt');

// Auto-ensure requirements are installed
try {
  console.log(`📦 Ensuring Python AI packages are installed (${pythonCmd} -m pip install -r ${reqFile})...`);
  spawnSync(pythonCmd, ['-m', 'pip', 'install', '-r', reqFile, '--quiet'], {
    stdio: 'ignore',
    timeout: 30000
  });
} catch (e) {
  // Continue even if pip install fails
}

console.log(`🧠 Launching Python AI Knowledge Engine (${pythonCmd} ${pythonScript} --server)...`);
const pythonProcess = spawn(pythonCmd, [pythonScript, '--server'], {
  cwd: pythonDir,
  stdio: 'inherit',
  env: { ...process.env, PYTHONUNBUFFERED: '1' }
});

pythonProcess.on('error', (err) => {
  console.warn('⚠️ Python AI process warning (Node.js fallback will be used):', err.message);
});

// 2. Launch Bakong KHQR Bypass Server (Port 3000)
let bakongProcess = null;
const bakongDir = path.join(__dirname, 'Bakong Bypass');
const bakongScript = path.join(bakongDir, 'server.js');
try {
  console.log('🇰🇭 Launching Bakong KHQR High-Speed SSR Engine on port 3000...');
  bakongProcess = spawn('node', [bakongScript], {
    cwd: bakongDir,
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000', KH_PROXY: 'true' }
  });

  bakongProcess.on('error', (err) => {
    console.warn('⚠️ Bakong Bypass process notice:', err.message);
  });
} catch (e) {
  console.warn('⚠️ Bakong bypass start notice:', e.message);
}

// 3. Launch Node.js Backend Server
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
  if (bakongProcess && !bakongProcess.killed) {
    bakongProcess.kill();
  }
  process.exit(code || 0);
});

// Graceful termination handling
const cleanup = () => {
  console.log('🛑 Shutting down production services...');
  if (pythonProcess && !pythonProcess.killed) pythonProcess.kill();
  if (bakongProcess && !bakongProcess.killed) bakongProcess.kill();
  if (nodeProcess && !nodeProcess.killed) nodeProcess.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
