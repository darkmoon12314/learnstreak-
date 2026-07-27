import { app, BrowserWindow } from 'electron';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = '127.0.0.1';
const DEFAULT_PORT = 4173;
const MAX_PORT_ATTEMPTS = 20;
let appUrl = `http://${HOST}:${DEFAULT_PORT}/`;
const distPath = path.join(__dirname, '..', 'dist');

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.ico': return 'image/x-icon';
    default: return 'application/octet-stream';
  }
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const requestPath = req.url && req.url !== '/' ? req.url : '/index.html';
      const decodedPath = decodeURIComponent(requestPath);
      const safePath = decodedPath.replace(/^\/+/, '').replace(/\/+/g, '/');
      const targetPath = path.resolve(distPath, safePath);

      if (!targetPath.startsWith(distPath)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }

      fs.readFile(targetPath, (error, data) => {
        if (error) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not Found');
          return;
        }

        res.writeHead(200, { 'Content-Type': getMimeType(targetPath) });
        res.end(data);
      });
    });

    const tryListen = (port, attempt) => {
      server.removeAllListeners('error');
      server.once('error', (error) => {
        if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
          tryListen(port + 1, attempt + 1);
        } else {
          reject(error);
        }
      });

      server.listen(port, HOST, () => {
        appUrl = `http://${HOST}:${port}/`;
        console.log(`LearnStreak desktop server ready at ${appUrl}`);
        resolve(server);
      });
    };

    tryListen(DEFAULT_PORT, 1);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 720,
    title: 'LearnStreak',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.once('ready-to-show', () => {
    win.show();
    win.maximize();
  });

  win.loadURL(appUrl);
}

async function bootstrap() {
  try {
    await startStaticServer();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Unable to start LearnStreak desktop server:', error);
    app.quit();
  }
}

app.whenReady().then(bootstrap);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
