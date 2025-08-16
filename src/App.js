// HalfMoon component: renders a half-moon shape that toggles a black border on click
import React, { useState } from 'react';
import './App.css';

export function HalfMoon() {
  const [active, setActive] = useState(false);
  return (
    <div
      className={`half-moon${active ? ' active' : ''}`}
      onClick={() => setActive(a => !a)}
      style={{ cursor: 'pointer', display: 'inline-block' }}
    >
      <div className="half-moon-shape" />
    </div>
  );
}


function Square({ value, onSquareClick }) {
  const [hovered, setHovered] = useState(false);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [menuSelecting, setMenuSelecting] = useState(false);

  // Calculate positions for 9 circles in a circle
  const circles = Array.from({ length: 9 }, (_, i) => {
    const angle = (2 * Math.PI * i) / 9 - Math.PI / 2;
    const radius = 55; // px, adjust as needed
    const x = 45 + radius * Math.cos(angle);
    const y = 45 + radius * Math.sin(angle);
    return (
      <div
        key={i + 1}
        className="circle-number"
        onMouseEnter={(e) => { e.currentTarget.className = 'circle-number hovered'; }}
        onMouseLeave={(e) => { e.currentTarget.className = 'circle-number'; }}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: '#fff',
          border: '2px solid #888',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          boxShadow: '0 1px 4px #0002',
          pointerEvents: 'none',
          zIndex: 1200
        }}
      >
        {i + 1}
      </div>
    );
  });

  // Mouse event handlers
  function handleMouseEnter(e) {
    const rect = e.target.getBoundingClientRect();
    setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setMenuSelecting(true);
    setHovered(true);
  }
  function handleMouseLeave(e) {
    //if (menuSelecting) return; // Prevent hiding if menu is being selected
    setHovered(false);
    //setTimeout(() => setHovered(false), 100);
  }

  return (
    <span
      className="square-wrapper"
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
      {hovered && (
        <div
          className="circle-menu"
          onMouseOver={() => setMenuSelecting(true)}
          onMouseLeave={() => setMenuSelecting(false)}
          style={{
            border: '1px solid #f00',
            position: 'fixed',
            left: center.x - 62,
            top: center.y - 62,
            width: '154px',
            height: '154px',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          {circles}
        </div>
      )}
    </span>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function newGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <button onClick={() => newGame()} className="new-game-button">
          Start New Game
        </button>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
