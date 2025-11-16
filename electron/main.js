/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/electron/main.js
 * Description: Electron main process for Permahub Wiki desktop application
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-16
 */

const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// Global reference to window object
let mainWindow;

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: 'Permahub Wiki',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#f5f5f0',
    show: false // Don't show until ready
  });

  // Load the wiki home page
  const startUrl = process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../src/wiki/wiki-home.html')
    : path.join(__dirname, '../dist-electron/wiki/wiki-home.html');

  mainWindow.loadFile(startUrl);

  // Show window when ready to prevent flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle external links - open in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // If URL is external (http/https), open in browser
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Prevent navigation away from wiki pages
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Allow navigation within the app
    if (!url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Clean up reference when window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

/**
 * Create application menu bar
 */
function createMenu() {
  const template = [
    // macOS app menu
    ...(process.platform === 'darwin' ? [{
      label: app.name,
      submenu: [
        {
          label: `About ${app.name}`,
          click: () => {
            showAboutDialog();
          }
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'Home',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../src/wiki/wiki-home.html'));
          }
        },
        { type: 'separator' },
        { role: process.platform === 'darwin' ? 'close' : 'quit' }
      ]
    },

    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },

    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },

    // Navigate menu
    {
      label: 'Navigate',
      submenu: [
        {
          label: 'Home',
          accelerator: 'Alt+1',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../src/wiki/wiki-home.html'));
          }
        },
        {
          label: 'Guides',
          accelerator: 'Alt+2',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../src/wiki/wiki-guides.html'));
          }
        },
        {
          label: 'Events',
          accelerator: 'Alt+3',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../src/wiki/wiki-events.html'));
          }
        },
        {
          label: 'Map',
          accelerator: 'Alt+4',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../src/wiki/wiki-map.html'));
          }
        },
        { type: 'separator' },
        {
          label: 'Create Page',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../src/wiki/wiki-editor.html'));
          }
        }
      ]
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(process.platform === 'darwin' ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },

    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://permahub.com');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../src/wiki/wiki-issues.html'));
          }
        },
        { type: 'separator' },
        {
          label: 'About Permahub Wiki',
          click: () => {
            showAboutDialog();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Show About dialog with version info
 */
function showAboutDialog() {
  const { dialog } = require('electron');
  const fs = require('fs');
  const versionPath = path.join(__dirname, '../src/version.json');

  let versionInfo = {
    version: '1.0.0',
    webVersion: '1.0.0',
    releaseDate: '2025-01-16'
  };

  try {
    const versionData = fs.readFileSync(versionPath, 'utf8');
    versionInfo = JSON.parse(versionData);
  } catch (error) {
    console.error('Could not load version info:', error);
  }

  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About Permahub Wiki',
    message: 'Permahub Wiki',
    detail: `Version: ${versionInfo.version} (Desktop)
Based on Web: v${versionInfo.webVersion}
Release Date: ${versionInfo.releaseDate}

A global permaculture community platform connecting practitioners, projects, and sustainable living communities.

© 2025 Permahub
Requires internet connection to access cloud database.`,
    buttons: ['OK']
  });
}

// App lifecycle events

/**
 * Create window when app is ready
 */
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * Quit app when all windows are closed (except on macOS)
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Security: Prevent new windows from being created unsafely
 */
app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Prevent webview attachments
    event.preventDefault();
  });
});

console.log('🚀 Permahub Wiki Electron app starting...');
console.log('   Environment:', process.env.NODE_ENV || 'production');
console.log('   Electron version:', process.versions.electron);
console.log('   Node version:', process.versions.node);
console.log('   Chrome version:', process.versions.chrome);
