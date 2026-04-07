// ============================================================
// ComplexityPanel.js — Real-time complexity comparison panel
// ============================================================
// Shows Mesh steps vs Ring steps and explains WHY mesh is better.

import { computeComplexity } from '../utils/shiftLogic.js';

function ComplexityPanel() {

  // ── Initial (empty) render ─────────────────────────────────
  function render() {
    return `
      <div class="panel complexity-panel">
        <h2 class="panel-title">Complexity Analysis</h2>
        <div id="complexity-content">
          <p class="muted">Run a shift to see analysis.</p>
        </div>
      </div>
    `;
  }

  // ── Update the panel with real numbers ────────────────────
  // Called from App.js every time p or q change
  function update(p, q) {
    const { rowShift, colShift, meshSteps, ringSteps } = computeComplexity(p, q);

    // Bar chart: scale bars as % of p (worst-case ring = p/2)
    const maxSteps = Math.floor(p / 2);  // worst case ring steps
    const meshPct  = Math.min(100, (meshSteps / maxSteps) * 100).toFixed(1);
    const ringPct  = Math.min(100, (ringSteps / maxSteps) * 100).toFixed(1);

    const saving = ringSteps - meshSteps;
    const savingLabel = saving > 0
      ? `Mesh saves <b>${saving}</b> communication step${saving > 1 ? 's' : ''}!`
      : saving === 0
      ? 'Same number of steps in this case.'
      : 'Ring is faster here (rare edge case).';

    document.getElementById('complexity-content').innerHTML = `

      <!-- Step breakdown -->
      <div class="complexity-row">
        <span class="label">Row shift amount</span>
        <span class="value">${rowShift} steps</span>
      </div>
      <div class="complexity-row">
        <span class="label">Col shift amount</span>
        <span class="value">${colShift} steps</span>
      </div>
      <div class="complexity-divider"></div>

      <!-- Formulas -->
      <div class="formula-block">
        <div class="formula-line mesh">
          <span class="formula-tag mesh-tag">MESH</span>
          <span>(q mod √p) + ⌊q/√p⌋ = (${q} mod ${Math.round(Math.sqrt(p))}) + ⌊${q}/${Math.round(Math.sqrt(p))}⌋ = <b>${meshSteps}</b></span>
        </div>
        <div class="formula-line ring">
          <span class="formula-tag ring-tag">RING</span>
          <span>min(q, p−q) = min(${q}, ${p - q}) = <b>${ringSteps}</b></span>
        </div>
      </div>

      <!-- Bar chart -->
      <div class="bar-chart">
        <div class="bar-row">
          <span class="bar-label">Mesh</span>
          <div class="bar-track">
            <div class="bar-fill mesh-bar" style="width: ${meshPct}%">
              <span class="bar-num">${meshSteps}</span>
            </div>
          </div>
        </div>
        <div class="bar-row">
          <span class="bar-label">Ring</span>
          <div class="bar-track">
            <div class="bar-fill ring-bar" style="width: ${ringPct}%">
              <span class="bar-num">${ringSteps}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Verdict -->
      <div class="verdict">${savingLabel}</div>

      <!-- Total comm steps -->
      <div class="complexity-row total-row">
        <span class="label">Total Mesh comm steps</span>
        <span class="value highlight">${meshSteps}</span>
      </div>
    `;
  }

  return { render, update };
}

export { ComplexityPanel };
