// ============================================================
// MeshGrid.js — Renders the mesh grid and runs the animation
// ============================================================
// Shows 3 states: Initial → After Stage 1 (row shift) → After Stage 2 (col shift)
// Animates arrows between steps so you can see data moving.

import { computeShift } from '../utils/shiftLogic.js';

function MeshGrid() {

  // ── Initial placeholder render ─────────────────────────────
  function render() {
    return `
      <div class="panel mesh-panel">
        <h2 class="panel-title">Mesh Grid Visualizer</h2>

        <!-- Stage indicator tabs -->
        <div class="stage-tabs">
          <div class="stage-tab active" id="tab-0">Initial State</div>
          <div class="stage-tab" id="tab-1">After Stage 1 (Row Shift)</div>
          <div class="stage-tab" id="tab-2">After Stage 2 (Col Shift)</div>
        </div>

        <!-- The grid is drawn here -->
        <div id="grid-container" class="grid-container">
          <p class="muted center">Enter p and q, then click ▶ Run Shift.</p>
        </div>

        <!-- Animation controls -->
        <div class="anim-controls hidden" id="anim-controls">
          <button class="btn btn-sm" id="btn-prev">◀ Prev</button>
          <span id="anim-label" class="anim-label">Stage 0</span>
          <button class="btn btn-sm" id="btn-next">Next ▶</button>
          <button class="btn btn-sm btn-play" id="btn-play">▶ Auto Play</button>
        </div>

        <!-- Arrow legend -->
        <div class="legend hidden" id="legend">
          <span class="legend-item"><span class="arrow-demo row-arrow">→</span> Row shift direction</span>
          <span class="legend-item"><span class="arrow-demo col-arrow">↓</span> Col shift direction</span>
        </div>
      </div>
    `;
  }

  // ── Draw the grid for a given data state ──────────────────
  // stageIndex: 0 = initial, 1 = after row shift, 2 = after col shift
  // highlightType: 'none', 'row', 'col'  — which arrows to show
  function drawGrid(data, side, stageIndex, highlightType) {
    const container = document.getElementById('grid-container');

    // Set CSS grid columns dynamically based on side
    container.style.gridTemplateColumns = `repeat(${side}, 1fr)`;
    container.style.display = 'grid';
    container.style.gap = '8px';
    container.innerHTML = '';  // clear old grid

    for (let i = 0; i < data.length; i++) {
      const row = Math.floor(i / side);
      const col = i % side;

      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.setAttribute('data-index', i);

      // Color the cell differently by stage
      if (stageIndex === 1) cell.classList.add('stage1-cell');
      if (stageIndex === 2) cell.classList.add('stage2-cell');

      // Arrow overlay: show direction of movement for this stage
      let arrowHTML = '';
      if (highlightType === 'row') {
        arrowHTML = `<span class="cell-arrow row-arrow">→</span>`;
      } else if (highlightType === 'col') {
        arrowHTML = `<span class="cell-arrow col-arrow">↓</span>`;
      }

      cell.innerHTML = `
        <div class="cell-index">Node ${i}</div>
        <div class="cell-data">${data[i]}</div>
        <div class="cell-pos">[${row},${col}]</div>
        ${arrowHTML}
      `;

      // Animate cells in with a small staggered delay
      cell.style.animationDelay = `${(row * side + col) * 20}ms`;
      cell.classList.add('cell-enter');

      container.appendChild(cell);
    }

    // Update the active tab highlight
    document.querySelectorAll('.stage-tab').forEach((tab, idx) => {
      tab.classList.toggle('active', idx === stageIndex);
    });
  }

  // ── Main function: run the shift with animation ────────────
  // Called by App.js with valid p and q
  function runShift(p, q) {
    const { initialData, afterStage1, afterStage2, rowShift, colShift, side } = computeShift(p, q);

    // Show the animation controls and legend
    document.getElementById('anim-controls').classList.remove('hidden');
    document.getElementById('legend').classList.remove('hidden');

    // All 3 stages with their data and labels
    const stages = [
      { data: initialData,  label: '🧊 Initial State',                    arrow: 'none' },
      { data: afterStage1,  label: `➡️ After Stage 1 — Row Shift by ${rowShift}`, arrow: 'row'  },
      { data: afterStage2,  label: `⬇️ After Stage 2 — Col Shift by ${colShift}`, arrow: 'col'  },
    ];

    let currentStage = 0;

    // Draw the current stage
    function showStage(idx) {
      currentStage = idx;
      const { data, label, arrow } = stages[idx];
      drawGrid(data, side, idx, arrow);
      document.getElementById('anim-label').textContent = label;
    }

    // Start at stage 0
    showStage(0);

    // Prev / Next buttons
    document.getElementById('btn-prev').onclick = () => {
      if (currentStage > 0) showStage(currentStage - 1);
    };
    document.getElementById('btn-next').onclick = () => {
      if (currentStage < stages.length - 1) showStage(currentStage + 1);
    };

    // Auto-play: cycles through all stages with a 1.5s delay
    let playTimer = null;
    const btnPlay = document.getElementById('btn-play');
    btnPlay.onclick = () => {
      if (playTimer) {
        // Already playing → stop
        clearInterval(playTimer);
        playTimer = null;
        btnPlay.textContent = '▶ Auto Play';
        return;
      }
      btnPlay.textContent = '⏸ Pause';
      showStage(0);  // restart from beginning
      playTimer = setInterval(() => {
        if (currentStage < stages.length - 1) {
          showStage(currentStage + 1);
        } else {
          clearInterval(playTimer);
          playTimer = null;
          btnPlay.textContent = '▶ Auto Play';
        }
      }, 1500);
    };
  }

  // ── Reset: clear grid back to placeholder ─────────────────
  function reset() {
    document.getElementById('grid-container').style.display = '';
    document.getElementById('grid-container').innerHTML =
      '<p class="muted center">Enter p and q, then click ▶ Run Shift.</p>';
    document.getElementById('anim-controls').classList.add('hidden');
    document.getElementById('legend').classList.add('hidden');
    document.querySelectorAll('.stage-tab').forEach((tab, idx) => {
      tab.classList.toggle('active', idx === 0);
    });
  }

  return { render, runShift, reset };
}

export { MeshGrid };
