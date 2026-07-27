const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const HOST = '127.0.0.1';
const PORT = process.env.PORT ? Number(process.env.PORT) : 4173;
const APP_URL = `http://${HOST}:${PORT}/`;
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function isServerUp() {
  return new Promise((resolve) => {
    const req = http.get(APP_URL, (res) => {
      res.resume();
      resolve(true);
    });

    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await isServerUp()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error('LearnStreak preview server did not become ready in time.');
}

function openBrowser() {
  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', APP_URL], { detached: true, stdio: 'ignore' }).unref();
  } else {
    spawn('xdg-open', [APP_URL], { detached: true, stdio: 'ignore' }).unref();
  }
}

async function main() {
  const alreadyRunning = await isServerUp();
  if (!alreadyRunning) {
    const child = spawn(npmCmd, ['run', 'start:online'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: false,
    });

    child.on('exit', (code) => {
      if (code && code !== 0) {
        process.exitCode = code;
      }
    });

    child.unref();
  }

  await waitForServer();
  console.log(`LearnStreak launcher ready at ${APP_URL}`);
  openBrowser();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
