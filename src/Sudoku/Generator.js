import React, { Component } from 'react'

export default function generateSudokuGrid() {
    // sudoku-generator.ts
    // Generates a fully-filled, valid 9x9 Sudoku grid.
    //type Grid = number[][];
    const SIZE = 9;
    const ALL_MASK = 0x3FE; // bits 1..9 set (binary 1111111110) -> 1022

    function seededRandom(seed) {
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

    const seed = Date.now() & 0xffffffff; // limit to 32 bits
    const random = seededRandom(seed);

    /** Fisher-Yates shuffle in-place */
    //function shuffle<T>(arr: T[], rnd: () => number = Math.random): void {
    function shuffle(arr, rnd = Math.random) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    /** Create an empty 9x9 grid (filled with 0 = empty) */
    // function emptyGrid(): Grid {
    //   const g: Grid = [];
    //   for (let r = 0; r < SIZE; r++) g.push(new Array(SIZE).fill(0));
    //   return g;
    // }
    function emptyGrid() {
      let grd = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      return grd;
    }
    /**
    * Generates a completed random Sudoku grid.
    * Optionally pass a custom random function (0..1).
    */
    function generateSudoku(rnd = Math.random) {
      const grid = emptyGrid();
      // Masks: bit n (1<<n) set if n is already used in that row/col/box
      const rowMask = Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); //new Array<number>(SIZE).fill(0);
      const colMask = Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); //new Array<number>(SIZE).fill(0);
      const boxMask = Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); //new Array<number>(SIZE).fill(0);

      // Helper: box index from row & col
      const boxIndex = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

      // Pre-generate candidate arrays [1..9] so we can shuffle them per cell
      const baseNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      function seededRandom(seed) {
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

      const seed = Date.now() & 0xffffffff; // limit to 32 bits
      const random = seededRandom(seed);  

      function isSolved(cell = 0) {
        if (cell === SIZE * SIZE) return true; // filled all
        const r = Math.floor(cell / SIZE);
        const c = cell % SIZE;
        const b = boxIndex(r, c);
        // compute available numbers mask for this cell
        const used = rowMask[r] | colMask[c] | boxMask[b];
        let availableMask = ALL_MASK & ~used; // bits for numbers that can be placed
        if (availableMask === 0) return false; // dead end
        // build candidate list from mask
        const candidates = []; //: number[] = [];
        for (let n = 1; n <= 9; n++) {
          if ((availableMask & (1 << n)) !== 0) candidates.push(n);
        }
        // shuffle candidates to ensure randomness
        shuffle(candidates, rnd);
        for (const n of candidates) {
          const bit = 1 << n;
          // place
          grid[r][c] = n;
          rowMask[r] |= bit;
          colMask[c] |= bit;
          boxMask[b] |= bit;
          if (isSolved(cell + 1)) return true;
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
        return generateSudoku(random);
      }
      return grid;
    }

    /** Validate that a completed 9x9 grid is a valid Sudoku. Useful for tests. */
    function validateSudoku(grid) {
      if (!Array.isArray(grid) || grid.length !== SIZE) return false;
      const seenRow = Array.from({ length: SIZE }, () => new Set());
      const seenCol = Array.from({ length: SIZE }, () => new Set());
      const seenBox = Array.from({ length: SIZE }, () => new Set());
      const boxIndex = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);
      for (let r = 0; r < SIZE; r++) {
        if (!Array.isArray(grid[r]) || grid[r].length !== SIZE) return false;
        for (let c = 0; c < SIZE; c++) {
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
    /** Example usage */
    // if (require.main === module) {
    //   const sudoku = generateSudoku();
    //   console.log(sudoku.map(row => row.join(' ')).join('\n'));
    //   console.log('Valid:', validateSudoku(sudoku));
    // }
  }
/*
export default class SudokuGenerator extends Component {

  constructor() {
    super();
    this.grid = this.generateFullGrid();
  }



  generateFullGrid() {
    // Implementation for generating a complete Sudoku grid
    const grid = Array.from({ length: 9 }, () => Array(9).fill(null));
    // Fill the grid with numbers 1-9
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        grid[i][j] = (i * 3 + Math.floor(i / 3) + j) % 9 + 1;
      }
    }
    return grid;
  }

  render() {
    // Generate skewed letters for 'POCKET SUDOKU'
    const title = 'POCKET SUDOKU';
    const letters = title.split('').map((char, idx) => {
      // Random rotation between -20 and 20 degrees
      const rotate = Math.floor(Math.random() * 41) - 20;
      return (
        <span
          key={idx}
          style={{
            display: 'inline-block',
            color: 'white',
            fontFamily: 'Calibri, Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '3rem',
            transform: `rotate(${rotate}deg)`,
            margin: '0 2px',
            letterSpacing: '2px',
            padding: '2px 6px',
            boxSizing: 'border-box',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });

    // Render the title with skewed letters
    return (
      <div style={{
        position: 'fixed',
        left: '50%',
        top: '50px',
        width: '100%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        padding: '24px 0',
        display: 'inline-block',
        zIndex: 1000,
        textShadow: 'rgb(43, 191, 255) 4px 0px 0px, rgb(43, 191, 255) 3.87565px 0.989616px 0px, rgb(43, 191, 255) 3.51033px 1.9177px 0px, rgb(43, 191, 255) 2.92676px 2.72656px 0px, rgb(43, 191, 255) 2.16121px 3.36588px 0px, rgb(43, 191, 255) 1.26129px 3.79594px 0px, rgb(43, 191, 255) 0.282949px 3.98998px 0px, rgb(43, 191, 255) -0.712984px 3.93594px 0px, rgb(43, 191, 255) -1.66459px 3.63719px 0px, rgb(43, 191, 255) -2.51269px 3.11229px 0px, rgb(43, 191, 255) -3.20457px 2.39389px 0px, rgb(43, 191, 255) -3.69721px 1.52664px 0px, rgb(43, 191, 255) -3.95997px 0.56448px 0px, rgb(43, 191, 255) -3.97652px -0.432781px 0px, rgb(43, 191, 255) -3.74583px -1.40313px 0px, rgb(43, 191, 255) -3.28224px -2.28625px 0px, rgb(43, 191, 255) -2.61457px -3.02721px 0px, rgb(43, 191, 255) -1.78435px -3.57996px 0px, rgb(43, 191, 255) -0.843183px -3.91012px 0px, rgb(43, 191, 255) 0.150409px -3.99717px 0px, rgb(43, 191, 255) 1.13465px -3.8357px 0px, rgb(43, 191, 255) 2.04834px -3.43574px 0px, rgb(43, 191, 255) 2.83468px -2.82216px 0px, rgb(43, 191, 255) 3.44477px -2.03312px 0px, rgb(43, 191, 255) 3.84068px -1.11766px 0px, rgb(43, 191, 255) 3.9978px -0.132717px',
      }}>
        {letters}
      </div>
    );
  }

  // Other methods for Sudoku generation

}

*/