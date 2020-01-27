import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.numRows = 3;
    this.numCols = 3;
  }

  renderSquare(i, className) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        className={className}
      />
    );
  }

  render() {
    let classNames = Array(this.numRows * this.numCols + 1).fill('square')
    if (this.props.winningSquares) {
      for (let i = 0; i < this.props.winningSquares.length; i++) {
        classNames[this.props.winningSquares[i]] = 'square-win';
      }
    }
    console.log("classNames: ", classNames);

    return (
      <div>
        {[...Array(this.numRows)].map((_, i) =>
          <div className="board-row" key={i}>
            {
              [...Array(this.numCols)].map((_, j) => this.renderSquare(rowColToIndex(i, j), classNames[rowColToIndex(i, j)]))
            }
          </div>
        )}
      </div>
    );
  }
}

var rowColToIndex = (i, j) => 3*i + j

function calculateWinner(squares) {
  // square sequences to check
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

  // check all sequences for matching square states
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {'player': squares[a], 'squares': lines[i]};
    }
  }

  // no matches
  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [null], // sequence of selected square indices, e.g. [null, 3, 8, 1, 0, ...]
      stepNumber: 0,
      xIsNext: true,
      sortAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = buildBoardFromHistory(history);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([i]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) == 0,
    });
  }

  toggleSort() {
    this.setState((prevState, _) => ({
      sortAsc: !prevState.sortAsc,
    }));
  }

  render() {
    const history = this.state.history;
    const squares = buildBoardFromHistory(history.slice(0, this.state.stepNumber + 1));
    const winner = calculateWinner(squares);

    const moves = history.map((pos, move) => {
      const row = Math.floor(pos / 3)
      const col = pos % 3;
      const desc = move
        ? 'Go to move #' + move + ' (' + row + ', ' + col + ')'
        : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner && winner.player) {
      status = 'Winner: ' + winner.player;
    } else if (!squares.includes(null)) { // no winner, but all squares are full
      status = 'Draw!'
    } else { // no winner, game still playable
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let altSortOrder = (this.state.sortAsc ? 'descending' : 'ascending')

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            onClick={i => this.handleClick(i)}
            winningSquares={winner && winner.squares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.sortAsc ? moves : moves.reverse()}</ol>
          <button onClick={() => this.toggleSort()}>
            {'Sort moves ' + altSortOrder}
          </button>
        </div>
      </div>
    );
  }
}

function buildBoardFromHistory(history) {
  let board = Array(9).fill(null);
  for (let i = 0; i < history.length; i++) {
    if (history[i] !== null) {
      board[history[i]] = (i % 2) === 0 ? 'O' : 'X';
    }
  }
  return board;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
