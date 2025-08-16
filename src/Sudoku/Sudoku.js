import './sudoku.css'
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Button } from 'react-bootstrap';
//import { observable } from 'mobx';
//import { generateSudokuGrid } from './Generator'; // Assuming this utility function is defined in a separate file
import { seededRandom, generateRandomArray, validateSudoku } from './utils';
import ConfettiButton from './ConfettiButton'

const SIZE = 9;
/*

class SudokuGame {
  //@observable grid = [];

  constructor() {
    //this.sudokuGenerator = new SudokuGenerator();
  
    // Initialize the game
    this.newGame = this.newGame.bind(this);
    this.generateSudokuGridBoxByBox = this.generateSudokuGridBoxByBox.bind(this);
    this.validateSudoku = this.validateSudoku.bind(this);

    this.seededRandom = this.seededRandom.bind(this);

    const seed = Date.now() & 0xffffffff; // limit to 32 bits
    this.random = this.seededRandom(seed);
  }

  // Sudoku game logic here
  newGame() {
    let grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    //let grid = this.sudokuGenerator.grid; //this.generateSudokuGridBoxByBox();
    //squares = generateSudokuGridBoxByBox();
    return grid;
  }

  validateSudoku(grid) {
      if (!Array.isArray(grid) || grid.length !== SIZE || grid.flat().length !== SIZE * SIZE) return false;
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

  seededRandom(seed) {
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

  generateSudokuGridBoxByBox() {
      // Helper to check if num can be placed at grid[row][col]
      function isSafe(grid, row, col, num) {
        //let testGrid = grid.flat();
        for (let x = 0; x < 9; x++) {
          if (grid[row][x] === num || grid[x][col] === num) return false;
        }
        const startRow = row - row % 3, startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) return false;
          }
        }
        return true;
      }

      // Fill the grid box by box, row by row
      function fillBoxByBox(grid) {
        function getMissingNumber(subGrid)
        {     
          let existing = structuredClone(subGrid.filter(num => num > 0));
          existing.sort((a, b) => a - b);
          return existing.find((num, index) => num !== index + 1) || 0; // Return the first missing number or 0 if all are present
        }
 
        let gridItems = [];
        let badGridItems = [];

        for (let boxRow = 0; boxRow < 3; boxRow++) {
          for (let boxCol = 0; boxCol < 3; boxCol++) {
            // Fill each 3x3 box
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                const row = boxRow * 3 + i;
                const col = boxCol * 3 + j;
                // Try numbers 1-9 in random order
                //let randomNumber = Math.floor(random() * 9) + 1;
                const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
                // (() => Math.random() - 0.5);
                //Math.floor(random() * 9 * 0.5
                console.log(`Processing ${nums}`);
                for (let num of nums) {
                  if (isSafe(grid, row, col, num)) {
                    grid[row][col] = num;
                    //gridItems.push(num);
                    break;
                  }
                }                
                //let myGrid = grid.map(r => [...r]); // Ensure immutability

                //myGrid[0][2] = 5;
              }
            }
          }
        }

        let myGrid = structuredClone(grid);

        //let mySet = [...new Set(grid.flat())];
        console.log('Filled numbers:', myGrid);

        for (let boxRow = 0; boxRow < 9; boxRow++) {
          if (grid[boxRow].includes(0)) {
            let missing = getMissingNumber(grid[boxRow]);
            console.log('Missing number for boxRow', boxRow, 'is', missing, 'in column ',grid[boxRow].indexOf(0));
            grid[boxRow][grid[boxRow].indexOf(0)] = missing;
          }
        }
        console.log('grid',grid);
        console.log('gridItems',gridItems);
        console.log('badGridItems',badGridItems);
      }

    // Initialize empty grid
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    console.log('Before fill','grid',grid);
    fillBoxByBox(grid);
    return grid;
  }

}
*/
  function useScreenSize() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    useEffect(() => {
      function handleResize() {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return { screenWidth, screenHeight };
  }
  
  function getExclusions(grid, row, col) {
    const exclusions = new Set();
    for (let i = 0; i < 9; i++) {
      if (parseInt(grid[row][i]) && col !== i) {
            exclusions.add(grid[row][i]); // Row
      }
      if (parseInt(grid[i][col]) && row !== i) {
        exclusions.add(grid[i][col]); // Column
      }
    }
    // 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (parseInt(grid[boxRow + i][boxCol + j]) && (boxRow + i !== row || boxCol + j !== col)) {
          exclusions.add(grid[boxRow + i][boxCol + j]);
        }
      }
    }
    //console.log(`Exclusions for row ${row}, col ${col}:`, exclusions);
    return [...exclusions];
  }

  // function isValidPlacement(grid, row, col, value) {
  //   // Check if the value is not already in the row, column, and 3x3 box
  //   return (
  //     !grid[row].includes(value) &&
  //     !grid.map(r => r[col]).includes(value) &&
  //     !getExclusions(grid, row, col).includes(value)
  //   );
  // }

  
// function fixGrid(squares) {
//   let tempGrid = squares.map(row => [...row]); // Create a copy of the grid

//   function flipVert(row, x, y){
//     const temp = squares[row][x];
//     squares[row][x] = squares[y][x];
//     squares[y][x] = temp;
//   }

//   function flipHoriz(col, x, y){
//     const temp = squares[x][col];
//     squares[x][col] = squares[y][col];
//     squares[y][col] = temp;
//   }

//   for (let row = 0; row < 9; row++) {
//     for (let col = 0; col < 9; col++) {
      
      
//       // if (squares[row][col] === 0) {
//       //   squares[row][col] = Math.floor(Math.random() * 9) + 1; // Fill empty squares with random numbers
//       // }
//     }
//   }
//   return squares;
// }

// Generates a 9x9 array where each row and column contains unique numbers 1-9 (randomized Latin square)
// function generateRandomSudokuGrid() {
//   function seededRandom(seed) {
//     // LCG parameters
//     const m = 0x80000000; // 2**31
//     const a = 1103515245;
//     const c = 12345;

//     let state = seed ? seed : Math.floor(Math.random() * (m - 1));

//     return function() {
//         state = (a * state + c) % m;
//         return Math.abs(state / (m - 1));
//     };
//   }



//   // Helper to shuffle an array
// //   function shuffle(array) {
// //     console.log("Shuffling array:", array);
// //     for (let i = array.length - 1; i > 0; i--) {
// //       const j = Math.floor(Math.random() * (i + 1));
// //       [array[i], array[j]] = [array[j], array[i]];
// //     }
// //     console.log("Generated array:", array);
// //     return array;
// //   }
  
//   //console.log("Seeded random number:", randomNumber,seed);  
//     // Start with a valid Latin square (shifted rows)
//   const seed = Date.now() & 0xffffffff; // limit to 32 bits
//   const random = seededRandom(seed);  

//   function getRow() {  
//     // Generate random number from 1 to 9
//     let randomNumber = Math.floor(random() * 9) + 1;

//     const base = [randomNumber];
//     let counter = 0;
    
//     while (base && base.length < 9) {
//       counter++;
//       randomNumber = Math.floor(random() * 9) + 1;
//       if (!base.includes(randomNumber)) {
//         base.push(randomNumber);
//       }
//     }
//     console.log("Base numbers generated:", base, "after", counter, "iterations");

//     return base;
//   }  

//   function getRandomWithExclusions(exclusions) {
//     let num;
//     if (exclusions.length === 9) {
//       console.warn("All numbers 1-9 are excluded, cannot place a number.");
//       return 0; // No valid number can be placed
//     }
//     do {
//       num = Math.floor(random() * 9) + 1;
//     } while (exclusions.includes(num));
//     return num;
//   }

//   //console.log("Base array:", base);

//   const grid = [];

//   //const gridItems = [...'0'.repeat(9)];

//   for (let i = 0; i < 9; i++) {
//     grid.push(getRow());
//   }

//   //console.log("Based 2 grid:", grid);
//   //console.log("Based gridItems:", gridItems);

//   let newGrid = [...grid[0]];
//   newGrid.push(new Array(9).fill(0).map(() => new Array(9).fill(0))); //Create a copy of the grid to fill in values

//   console.log("New grid before filling:", newGrid);

//   grid.forEach((row, rowIndex) => {
//     //console.log('Row idx= ', rowIndex, row);    
//     let newRow = [];
//     row.forEach((value, colIndex) => {
//       let excluded = [];
      
//       if (value === '0') {
//         excluded = getExclusions(newGrid, rowIndex, colIndex)
        
//         excluded = [...new Set([...excluded, ...newRow])];

//         //console.log(`Excluded for ${rowIndex}, ${colIndex}:`, excluded);
//         let newValue = getRandomWithExclusions(excluded);
//         if (newValue === 0) {
//           return; // Skip if no valid number can be placed
//         }
//         newRow.push(newValue);
//         //grid[rowIndex][colIndex] = newValue; // Update the grid with the new value
//         //excluded.push(newValue); // Update exclusions
//         //console.log(`New value generated for ${rowIndex}, ${colIndex}:`, newValue);
//         //console.log(`New exclusions for ${rowIndex}, ${colIndex}:`, excluded);

//         //excluded.push(newRow[newRow.length - 1]); // Update exclusions
//         //newGrid[rowIndex][colIndex] = newRow[newRow.length - 1]; // Update the grid with the new value
//       }
//     });

//     //console.log('New Grid = ', newGrid);
//   });
  
// /*
//   grid.forEach((row, rowIndex) => {
//     let newRow = [];
//     console.log('Row idx= ', rowIndex);
//     row.forEach((value, colIndex) => {
//       if (value === '0') {
//         const excluded = getExclusions(newGrid, rowIndex, colIndex);
//         //excluded.splice(0,1, getExclusions(newGrid, rowIndex, colIndex));
//         console.log(`new Excluded = ${rowIndex}, ${colIndex}:`, excluded);
//         while (newRow.length < 9) {
//             randomNumber = Math.floor(random() * 9) + 1;
//             if (!excluded.includes(randomNumber)) {
//               newRow.push(randomNumber);
//               excluded.push(randomNumber); // Update exclusions
//               console.log(`excludings = ${rowIndex}, ${colIndex}:`, excluded);
//             }
//         }
//         console.log('New Row = ', newRow);
//         newGrid[rowIndex] = newRow; // Update the row with new values
//         //newRow.push(value);
//         console.log(`Excluded for ${rowIndex}, ${colIndex}:`, excluded);
//       }      
//     });
//     //grid[colIndex] = newRow;
//     console.log('New Row 2 = ', newRow);
//     //grid.splice(rowIndex+1, newRow.length, [...newRow]); // Update the row with new values
    
//   });*/

//   //let excluded = getExclusions(grid, 1, 1);

//   //console.log("New grid:", newGrid);

//   // Shuffle rows and columns to randomize, but keep Latin square property
//   // Shuffle rows within each band
// //   for (let band = 0; band < 3; band++) {
// //     const rows = [0,1,2].map(x => x + band * 3);
// //     const shuffled = shuffle(rows.slice());
// //     for (let i = 0; i < 3; i++) {
// //       [grid[rows[i]], grid[shuffled[i]]] = [grid[shuffled[i]], grid[rows[i]]];
// //     }
// //   }
// //   // Shuffle columns within each stack
// //   for (let stack = 0; stack < 3; stack++) {
// //     const cols = [0,1,2].map(x => x + stack * 3);
// //     const shuffled = shuffle(cols.slice());
// //     for (let i = 0; i < 3; i++) {
// //       for (let row = 0; row < 9; row++) {
// //         [grid[row][cols[i]], grid[row][shuffled[i]]] = [grid[row][shuffled[i]], grid[row][cols[i]]];
// //       }
// //     }
// //   }

//   //console.log("Final grid:", grid);

//   return grid;
// }

function shuffle(array) {
  console.log("Shuffling array:", array);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  console.log("Generated array:", array);
  return array;
}

// function applyDifficulty2(gridBoard, setting)
// {
//   let gridItem = 0;
//   for (let s = 0; s < 3; s++) {
//     for (let r = 0; r < 3; r++) {
//       // Apply difficulty settings to each 3x3 sub-grid
//       gridItem = s * 3 + r;
//     }
//   }
// }


function applyDifficulty(gridBoard, difficulty)
{
  const holesMap = {
    easy: 35,
    medium: 45,
    hard: 55
  };

  let holes = holesMap[difficulty] || 35;

  if (typeof holes === 'undefined') {
    throw new Error(`Unknown difficulty setting: ${difficulty}`);
  }

  const puzzle = gridBoard.map(row => [...row]);

  let removed = 0;

  const positions = Array.from({ length: SIZE * SIZE }, (_, i) => i);
  shuffle(positions, seededRandom(Date.now() & 0xffffffff));

  for (const pos of positions) {
    const row = Math.floor(pos / SIZE);
    const col = pos % SIZE;
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0; // Remove the number
      removed++;
      if (removed >= holes) break; // Stop when enough holes are dug
    }
  }

  return puzzle;
}

function Square({ value, boxSize, onSquareClick }) {
  const [sqHovered, setSqHovered] = useState(false);

  let squareSize = boxSize || 35; // Default size if not provided

  return (    
    <span
      className="square-wrapper"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button className={`square ${sqHovered ? 'hovered' : ''}`} 
        style={{ 
          width: `${squareSize}px`, 
          height: `${squareSize}px`
        }}
        onClick={onSquareClick}
        onMouseOver={() => setSqHovered(true)}
        onMouseLeave={() => setSqHovered(false)}
      >
        {value > 0 ? value : '' }
      </button>
    </span>
  ); 
}




// Displays a 9x9 grid of squares with values from the generated array
function SudokuGrid({ squares, cellsize, difficultyLevel, onLevelChange, onClickNewBoard, onSizeChange }) {
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [curSquare, setCurSquare] = useState([-1,-1]);
  const {screenWidth, screenHeight } = useScreenSize();

  difficultyLevel = difficultyLevel || 'easy';

  console.log(`Screen size: width=${screenWidth}, height=${screenHeight}`);

  cellsize = cellsize || 50; // Default cell size if not provided

  //console.log("Rendering SudokuGrid with squares:", squares);
  //console.log(`width : ${cellsize}px, height : ${cellsize}px`);

  function handleCircleClick(numClicked, row, col) {
    squares[row][col] = numClicked < 10 ? numClicked : 0; // Update the square with the clicked number

    if (validateSudoku(squares, 9))
    {
      console.log('You won');
    } else {
      console.log('Not quite, but almost there');
    }

    setMenuVisible(false);
  }

  function onSquareClick(value, row, col, e) {

    console.log(`Square clicked at (${row}, ${col}) with value: ${value} at (${e.clientX}, ${e.clientY})`);

    console.log(`Document clicked at (${e.pageX}, ${e.pageY})`);

    console.log(`Square clicked with window width: ${screenWidth}, height: ${screenHeight}`);

    const boardRect = document.querySelector('.board').getBoundingClientRect();

    console.log(`Board position: left=${boardRect.left}, top=${boardRect.top}, width=${boardRect.width}, height=${boardRect.height}`);

    const rect = e.target.getBoundingClientRect();

    //console.log(`Targeting `,e.target);

    console.log(`Square position: left=${rect.left}, top=${rect.top}, width=${rect.width}, height=${rect.height}`);

    console.log(`Circle menu position: left=${center.x - 68}, top=${center.y - 68}`);
    console.log(`Setting Circle menu position: ${JSON.stringify({ x: boardRect.left, y: boardRect.top })}`);

    //setCenter({ x: boardRect.left + rect.left, y: boardRect.top + rect.top });
    setCenter({ x: rect.left + 2, y: rect.top });

    //setCenter({ x: (screenWidth - (cellsize * 9)) / 2, y: (screenHeight - (cellsize * 9)) / 2 });
    setCurSquare([row, col]);
    setMenuVisible(true);

    console.log('Center set to ',center);

    console.log(`Square clicked with value ${squares[row][col]}`);

    console.log(`Square clicked with value: ${value} at (${row}, ${col})`, getExclusions(squares, row, col), squares);
  }

  // Calculate positions for 9 circles in a circle, centered over the clicked square
  const circles = Array.from({ length: 10 }, (_, i) => {
    const angle = ((2 * Math.PI * i) / 10 - Math.PI / 2) + 120;
    const radius = 50; // px, adjust as needed
    // Center the menu over the clicked square using 'center' state
    const x = 50 + radius * Math.cos(angle); // 68 centers inside the menu div (width/2)
    const y = 50 + radius * Math.sin(angle); // 68 centers inside the menu div (height/2)
    return (
      menuVisible && <div
        key={i + 1}
        className='circle-number'
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          color: `${i + 1 === squares[curSquare[0]][curSquare[1]] ? '#fff' : '#000'}`,
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: `${i + 1 === squares[curSquare[0]][curSquare[1]] ? 'rgba(34, 165, 104, 1)' : '#fff'}`,
          fontWeight: `${(i + 1 === squares[curSquare[0]][curSquare[1]] || i + 1 >= 10) ? '800' : 'normal'}`,
          fontSize: `${i + 1 === squares[curSquare[0]][curSquare[1]] ? 18 : 14}px`,
        }}
        onClick={() => handleCircleClick(i + 1, curSquare[0], curSquare[1]) }
        onMouseEnter={(e) => { e.currentTarget.className = 'circle-number hovered'; }}
        onMouseLeave={(e) => { e.currentTarget.className = 'circle-number'; }}
      >
        {i + 1 < 10 ? `${i + 1}` : 'X'}
      </div>
    );
  });

  let selectOptions = ['easy', 'medium', 'hard'];
  let sizeOptions = [35, 50, 65];

  return (
    <>
      <div className='settingsbar'>
        <div className='custom-select-wrapper'>        
          <select className='custom-select'
            defaultValue={difficultyLevel}
            onChange={(e) => onLevelChange(e.target.value, e)}
          >
            <option value=''>Difficulty</option>
            {selectOptions.map((value, rowIdx) => (
              <option key={rowIdx} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div className='custom-select-wrapper select-sm'>
          <select className='custom-select select-sm'
            defaultValue={cellsize}
            onChange={(e) => onSizeChange(e.target.value, e)}
          >
            <option value=''>Board Size</option>
            {sizeOptions.map((value, rowIdx) => (
              <option key={rowIdx} value={value}>{value}px</option>
            ))}
          </select>          
        </div>
        <button className='custom-button' onClick={(e) => onClickNewBoard(e)}>New Board</button>
      </div>

      <div className="board"
        style={{ 
          backgroundColor: '#ccc', // Light gray background
          position: 'relative',
          maxWidth: `${cellsize * 9 + 17}px`, 
          maxHeight: `${cellsize * 9 + 20}px`, 
          border: '10px solid #888',
          margin: '10 auto' }}
      >
        {squares.map((row, rowIdx) => (
          <div className="board-row" key={rowIdx}
              style={{ 
                width: `${cellsize * 9}px`, 
                height: `${cellsize}px` 
              }} 
          >
            {row.map((value, colIdx) => (
              <Square key={colIdx} value={value} boxSize={cellsize}
                onSquareClick={e => onSquareClick(value, rowIdx, colIdx, e)}
              />
            ))}
          </div>
        ))}
      </div>
        {menuVisible && (
          <div
            className="circle-menu"
            onMouseLeave={() => setMenuVisible(false)}
            style={{
              position: 'absolute',
              left: center.x - 30,
              top: center.y - 30,
              width: '136px',
              height: '136px',
              borderRadius: '50%',
              border: '2px solid red',
              zIndex: 1000,
            }}
          >
            {circles}
          </div>
        )}      
    </>
  );
}


// Main exported component: SudokuBoard
export default function SudokuBoard() {
  
  const BOX_SIZE = 35; // px

  const DIFFICULTY_LEVEL = 'easy'; // 'easy', 'medium', 'hard'

  // Generate a random 9x9 grid
  const [squares, setSquares] = useState(generateRandomArray());
  const [gameBoard, setGameBoard] = useState(applyDifficulty(squares, DIFFICULTY_LEVEL));  
  const [difficulty, setDifficulty] = useState('easy');
  const [cellSize, setCellSize] = useState(BOX_SIZE);

  //let currentLevel = null;

  function handleClickNewBoard(e)
  {
    //difficultyLevel = difficultyLevel || 'easy';

    console.log('New board clicked ',e);

    setSquares(generateRandomArray());
    setGameBoard(applyDifficulty(squares, difficulty));
  }


  function handleLevelChange(newLevel, e)
  {
    console.log('Level changed to ' + newLevel);
    setDifficulty(newLevel);
    setGameBoard(applyDifficulty(squares, newLevel));
  }

  function handleSizeChange(newSize, e)
  {
    console.log('Size changed to ' + newSize);
    setCellSize(newSize ? newSize : BOX_SIZE);
  }

  console.log('Rendered Sudoku grid:', squares);
  console.log('Difficulty applied Sudoku grid:', gameBoard);
  console.log('Difficulty setting', difficulty);  

  return (
    <>
     <SudokuGrid squares={gameBoard} cellsize={cellSize} difficultyLevel={difficulty} 
        onLevelChange={handleLevelChange} 
        onClickNewBoard={handleClickNewBoard} 
        onSizeChange={handleSizeChange} />
     <div
      style={{
        fontWeight: '600',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
     >
        <ConfettiButton />
        {'Current Level : '+difficulty}
     </div>
    </>
  );
}
