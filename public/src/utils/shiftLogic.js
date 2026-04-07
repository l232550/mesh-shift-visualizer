// ============================================================
// shiftLogic.js — Pure circular shift algorithm
// ============================================================
// A circular q-shift on p nodes: node i sends its data to node (i+q) mod p
// On a 2D mesh with side = sqrt(p):
//   Stage 1 (Row Shift):    shift by  rowShift = q mod side
//   Stage 2 (Column Shift): shift by  colShift = Math.floor(q / side)

/**
 * Returns side length of the mesh (sqrt of p).
 * We only allow perfect squares for p.
 */
function getSide(p) {
  return Math.round(Math.sqrt(p));
}

/**
 * Get the row and column of node i in a sqrt(p) x sqrt(p) grid.
 *   row = Math.floor(i / side)
 *   col = i mod side
 */
function getRowCol(i, side) {
  return {
    row: Math.floor(i / side),
    col: i % side,
  };
}

/**
 * computeShift(p, q)
 *
 * Returns an object with:
 *   - initialData   : array of length p, node i holds value i (simple starting state)
 *   - afterStage1   : array of length p, data after the row shift
 *   - afterStage2   : array of length p, data after the column shift (final)
 *   - rowShift      : how many positions each row is shifted right
 *   - colShift      : how many positions each column is shifted down
 */
function computeShift(p, q) {
  const side = getSide(p);
  const rowShift = q % side;                  // Stage 1 amount
  const colShift = Math.floor(q / side);      // Stage 2 amount

  // Initial: node i simply holds data value i
  const initialData = Array.from({ length: p }, (_, i) => i);

  // ── Stage 1: Row Shift ───────────────────────────────────
  // Within each row, node at column c sends its data to column (c + rowShift) mod side
  // So after stage 1, position [row][col] holds data that came from [row][(col - rowShift + side) mod side]
  const afterStage1 = new Array(p);
  for (let i = 0; i < p; i++) {
    const { row, col } = getRowCol(i, side);
    // Where did my data come FROM in stage 1?
    const srcCol = ((col - rowShift) % side + side) % side;
    const srcIndex = row * side + srcCol;
    afterStage1[i] = initialData[srcIndex];
  }

  // ── Stage 2: Column Shift ────────────────────────────────
  // Within each column, node at row r sends its data to row (r + colShift) mod side
  // So after stage 2, position [row][col] holds data that came from [(row - colShift + side) mod side][col]
  const afterStage2 = new Array(p);
  for (let i = 0; i < p; i++) {
    const { row, col } = getRowCol(i, side);
    const srcRow = ((row - colShift) % side + side) % side;
    const srcIndex = srcRow * side + col;
    afterStage2[i] = afterStage1[srcIndex];
  }

  return { initialData, afterStage1, afterStage2, rowShift, colShift, side };
}

/**
 * computeComplexity(p, q)
 *
 * Returns comparison data for Mesh vs Ring shift counts.
 *   Ring steps  = min(q, p - q)          (naive ring needs up to p/2 hops)
 *   Mesh steps  = rowShift + colShift     (two short hops on a 2D grid)
 */
function computeComplexity(p, q) {
  const side = getSide(p);
  const rowShift = q % side;
  const colShift = Math.floor(q / side);
  const meshSteps = rowShift + colShift;
  const ringSteps = Math.min(q, p - q);
  return { rowShift, colShift, meshSteps, ringSteps };
}

// Export so other files can import these functions
export { computeShift, computeComplexity, getSide, getRowCol };
