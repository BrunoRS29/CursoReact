/* eslint-env node */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, 'src', 'assets', 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
    },
    
  });

  win.setMenuBarVisibility(false);
  win.removeMenu();

  // Carrega o index.html da build React
  win.loadFile(path.join(__dirname, 'dist/index.html'));

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:8080;"
      }
    });
  });

}

app.whenReady().then(() => {
  console.log('[ELECTRON] Iniciando backend Java...');

  const isDev = !app.isPackaged;
  const pathToJar = isDev
    ? path.join(__dirname, 'backend', 'app.jar') // agora está dentro do mesmo diretório
    : path.join(process.resourcesPath, 'backend', 'app.jar');


  const jar = exec(`java -jar "${pathToJar}"`);

  jar.stdout.on('data', (data) => {
    console.log('[JAVA]', data);
    if (data.includes('Started') || data.includes('Tomcat started')) {
      console.log('[ELECTRON] Backend iniciado. Abrindo janela...');
      createWindow();
    }
  });

  jar.stderr.on('data', (data) => {
    console.error('[JAVA ERR]', data);
  });

  jar.on('exit', (code) => {
    console.log(`[JAVA] Processo finalizado com código ${code}`);
  });

  // Fallback: abre a janela mesmo se o backend não responder
  setTimeout(() => {
    console.log('[ELECTRON] Timeout atingido. Abrindo janela mesmo sem backend.');
    createWindow();
  }, 8000);
});

