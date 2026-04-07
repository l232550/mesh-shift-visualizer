// ============================================================
// index.js — Entry point, boots up the App
// ============================================================
// This is the very first file that runs.
// It just waits for the page to load, then starts the app.

import { App } from './App.js';

// Wait until the HTML page is fully loaded before mounting
document.addEventListener('DOMContentLoaded', () => {
  const app = App();
  app.mount();   // inject all component HTML and wire up listeners
});
