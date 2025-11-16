/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/electron/preload.js
 * Description: Electron preload script - security bridge between main and renderer processes
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-01-16
 */

const { contextBridge } = require('electron');

/**
 * Expose safe APIs to renderer process
 * Currently minimal - all Supabase calls work via fetch() API which is available by default
 */
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
  isElectron: true
});

console.log('✅ Electron preload script loaded');
