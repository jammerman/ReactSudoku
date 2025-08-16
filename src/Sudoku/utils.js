
// Returns a 9x9 array with random numbers between 1 and 9
export function generateRandomArray() {
    //const arr = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.floor(Math.random() * size) + 1));
    const SIZE = 9;
    const ALL_MASK = 0x3FE; // bits 1..9 set (binary 1111111110) -> 1022  

    const arr = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => Math.floor(Math.random() * SIZE) + 1));

    //console.log('Initial array :', arr);

    function seededRandom(seed) {
        // LCG parameters
        const m = 0x80000000; // 2**31
        const a = 1103515245;
        const c = 12345;

        let state = seed ? seed : Math.floor(Math.random() * (m - 1));

        return function () {
            state = (a * state + c) % m;
            return Math.abs(state / (m - 1));
        };
    }

    const seed = Date.now() & 0xffffffff; // limit to 32 bits
    const random = seededRandom(seed);

    /** Fisher-Yates shuffle in-place */
    function shuffle(arr, rnd = Math.random) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    function emptyGrid() {
      let grid1 = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      return grid1;
    }

    function longToBits(num) {
        const bits = [];
        for (let i = 9; i >= 0; i--) {
            bits.push((num >> i) & 1);
        }
        return bits;
    }
    
        /**
    * Generates a completed random Sudoku grid.
    * Optionally pass a custom random function (0..1).
    */
    function generateSudoku(rnd = Math.random) {
      const grid = emptyGrid();

      // Masks: bit n (1<<n) set if n is already used in that row/col/box
      const rowMask = Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); 
      const colMask = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      const boxMask = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

      //console.log('Masks (row, col, box)...', rowMask, colMask, boxMask);

      // Helper: box index from row & col
      const boxIndex = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

      // Pre-generate candidate arrays [1..9] so we can shuffle them per cell
      //const baseNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      function isSolved(cell = 0) {
        if (cell === SIZE * SIZE) return true; // filled all
        const r = Math.floor(cell / SIZE);
        const c = cell % SIZE;
        const b = boxIndex(r, c);
        // compute available numbers mask for this cell
        const used = rowMask[r] | colMask[c] | boxMask[b];
        let availableMask = ALL_MASK & ~used; // bits for numbers that can be placed
        //console.log(availableMask === 0 ? 'No available numbers' : 'Available numbers found');
        if (availableMask === 0) return false; // dead end

        //console.log('Available mask for cell', cell, 'at (', r, ',', c, '):',availableMask, longToBits(availableMask).toString());

        // build candidate list from mask
        const candidates = []; //: number[] = [];
        for (let n = 1; n <= 9; n++) {
          if ((availableMask & (1 << n)) !== 0) candidates.push(n);
        }

        //console.log('Candidates for cell', cell, 'at (', r, ',', c, '):', candidates);

        // shuffle candidates to ensure randomness
        if (candidates.length > 1) {
            shuffle(candidates, random);
        }

        for (const n of candidates) {
          const bit = 1 << n;
          // place
          grid[r][c] = n;
          //console.log('--','placing',n, `at (`,r,`,`,c,`):`,'(',longToBits(bit).toString(),') resulting in',grid.toString());
          rowMask[r] |= bit;
          colMask[c] |= bit;
          boxMask[b] |= bit;
          if (isSolved(cell + 1)) return true;
          //console.log('**','not solved, backtracking:',grid,'**');
          // backtrack
          grid[r][c] = 0;
          rowMask[r] &= ~bit;
          colMask[c] &= ~bit;
          boxMask[b] &= ~bit;
        }
        return false;
      }
      // Start the recursive solve
      const ok = isSolved(0);
      if (!ok) {
        // extremely unlikely with this strategy, but retry if it fails
        let grid = generateSudoku(random);

        console.log('Grid generated ',grid);
        return grid;
      } else {
        return grid;
      }
    }

    return generateSudoku(random);
}

/** Validate that a completed 9x9 grid is a valid Sudoku. Useful for tests. */
export function validateSudoku(grid, gridSize) {
  if (!Array.isArray(grid) || grid.length !== gridSize) return false;
  const seenRow = Array.from({ length: gridSize }, () => new Set());
  const seenCol = Array.from({ length: gridSize }, () => new Set());
  const seenBox = Array.from({ length: gridSize }, () => new Set());
  const boxIndex = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);
  for (let r = 0; r < gridSize; r++) {
    if (!Array.isArray(grid[r]) || grid[r].length !== gridSize) return false;
    for (let c = 0; c < gridSize; c++) {
      const v = grid[r][c];
      if (typeof v !== 'number' || v < 1 || v > 9) return false;
      const b = boxIndex(r, c);
      if (seenRow[r].has(v) || seenCol[c].has(v) || seenBox[b].has(v)) return false;
      seenRow[r].add(v);
      seenCol[c].add(v);
      seenBox[b].add(v);
    }
  }
  return true;
}

// Returns a seeded random number generator function
export function seededRandom(seed) {
  // LCG parameters
  const m = 0x80000000; // 2**31
  const a = 1103515245;
  const c = 12345;
  let state = seed ? seed : Math.floor(Math.random() * (m - 1));
  return function() {
    state = (a * state + c) % m;
    return Math.abs(state / (m - 1));
  };
}