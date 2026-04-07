// ============================================================
// App.js — The "glue" that wires all components together
// ============================================================
// This is the main controller. It:
//   1. Renders all three components into the page
//   2. Passes callbacks so components can talk to each other
//   3. Keeps no logic itself — logic lives in shiftLogic.js

import { ControlPanel }   from './components/ControlPanel.js';
import { MeshGrid }       from './components/MeshGrid.js';
import { ComplexityPanel } from './components/ComplexityPanel.js';

function App() {

  // Create instances of each component
  const controlPanel    = ControlPanel(onRun, onReset);
  const meshGrid        = MeshGrid();
  const complexityPanel = ComplexityPanel();

  // ── Insert HTML for all panels into #app ──────────────────
  function mount() {
    const appEl = document.getElementById('app');
    appEl.innerHTML = `
      <div class="layout">
        <!-- Left sidebar: controls + complexity -->
        <div class="sidebar">
          ${controlPanel.render()}
          ${complexityPanel.render()}
        </div>
        <!-- Main area: mesh grid -->
        <div class="main-area">
          ${meshGrid.render()}
        </div>
      </div>
    `;

    // Now that HTML is in the DOM, attach event listeners
    controlPanel.attachListeners();
  }

  // ── Called when user clicks "Run Shift" ───────────────────
  function onRun(p, q) {
    meshGrid.runShift(p, q);       // animate the grid
    complexityPanel.update(p, q);  // update the analysis numbers
  }

  // ── Called when user clicks "Reset" ───────────────────────
  function onReset() {
    meshGrid.reset();
    document.getElementById('complexity-content').innerHTML =
      '<p class="muted">Run a shift to see analysis.</p>';
  }

  return { mount };
}

export { App };
