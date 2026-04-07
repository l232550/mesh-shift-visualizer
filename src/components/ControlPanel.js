// ============================================================
// ControlPanel.js — User input panel (p and q values + validation)
// ============================================================

/**
 * ControlPanel manages the HTML for the left panel where users
 * type in p and q. It validates input and calls back to App.js.
 *
 * @param {Function} onRun  — called with (p, q) when user clicks Run
 * @param {Function} onReset — called when user clicks Reset
 */
function ControlPanel(onRun, onReset) {

  // ── Build the HTML for this panel ──────────────────────────
  function render() {
    return `
      <div class="panel control-panel">
        <h2 class="panel-title">Parameters</h2>

        <div class="input-group">
          <label for="input-p">
            p — Total Nodes
            <span class="hint">(perfect square, 4–64)</span>
          </label>
          <input
            type="number"
            id="input-p"
            value="16"
            min="4"
            max="64"
            step="1"
            placeholder="e.g. 16"
          />
        </div>

        <div class="input-group">
          <label for="input-q">
            q — Shift Amount
            <span class="hint">(1 to p−1)</span>
          </label>
          <input
            type="number"
            id="input-q"
            value="5"
            min="1"
            step="1"
            placeholder="e.g. 5"
          />
        </div>

        <!-- Validation error message (hidden by default) -->
        <div id="error-msg" class="error-msg hidden"></div>

        <div class="button-row">
          <button id="btn-run" class="btn btn-primary">▶ Run Shift</button>
          <button id="btn-reset" class="btn btn-secondary">↺ Reset</button>
        </div>

        <!-- Quick formula reminder for the user -->
        <div class="formula-box">
          <p class="formula-title">How it works</p>
          <p>Node <b>i</b> → Node <b>(i + q) mod p</b></p>
          <p>Stage 1 Row shift: <b>q mod √p</b></p>
          <p>Stage 2 Col shift: <b>⌊q / √p⌋</b></p>
        </div>
      </div>
    `;
  }

  // ── Attach click listeners after the HTML is in the DOM ───
  function attachListeners() {
    const btnRun   = document.getElementById('btn-run');
    const btnReset = document.getElementById('btn-reset');

    btnRun.addEventListener('click', () => {
      const result = readAndValidate();
      if (result) onRun(result.p, result.q);
    });

    btnReset.addEventListener('click', () => {
      // Clear inputs to defaults
      document.getElementById('input-p').value = 16;
      document.getElementById('input-q').value = 5;
      clearError();
      onReset();
    });
  }

  // ── Read inputs and validate them ─────────────────────────
  function readAndValidate() {
    const pVal = parseInt(document.getElementById('input-p').value);
    const qVal = parseInt(document.getElementById('input-q').value);

    // Check p is a number
    if (isNaN(pVal) || isNaN(qVal)) {
      showError('Please enter numbers for both p and q.');
      return null;
    }
    // Check p is in range
    if (pVal < 4 || pVal > 64) {
      showError('p must be between 4 and 64.');
      return null;
    }
    // Check p is a perfect square (sqrt must be a whole number)
    const side = Math.sqrt(pVal);
    if (!Number.isInteger(side)) {
      showError(`p = ${pVal} is not a perfect square. Try 4, 9, 16, 25, 36, 49, or 64.`);
      return null;
    }
    // Check q is in valid range
    if (qVal < 1 || qVal >= pVal) {
      showError(`q must be between 1 and p−1 (i.e. 1 to ${pVal - 1}).`);
      return null;
    }

    clearError();
    return { p: pVal, q: qVal };
  }

  function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function clearError() {
    const el = document.getElementById('error-msg');
    if (el) {
      el.textContent = '';
      el.classList.add('hidden');
    }
  }

  // Public API
  return { render, attachListeners };
}

export { ControlPanel };
