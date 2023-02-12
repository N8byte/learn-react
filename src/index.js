import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" 
    onClick={props.onClick} 
    style={{"backgroundColor":props.highlight}}>
      {props.value}
    </button>
  );
}


function OrderButton(props) {
  return (
    <button className="order" onClick={() => {
        props.onClick();
      }} >{"Reverse order of moves"}</button>
  )
}


class Board extends React.Component {
  
  renderSquare(i, highlight) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        highlight={highlight}
      />
    );
  }

  render() {
    const winner = this.props.winner;
    const grid = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        const currentSquare = i * 3 + j;
        let highlight = '#fff'
        if (winner && winner.winningSquares.includes(currentSquare))
          highlight = '#ff0';
        row.push(this.renderSquare(currentSquare, highlight));
      }
      grid.push(<div className="board-row" key={i}>{row}</div>);
    }

    return ( <div>{grid}</div> );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: [0, 0],
      }],
      stepNumber: 0,
      turn: 'X',
      reverse: false,
    };
  }

  calculateWinner(squares) {
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
        return {side: squares[a], winningSquares: lines[i].slice()};
      }
    }
    return null;
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = [i % 3 + 1, 3 - Math.floor(i / 3)];

    if (this.calculateWinner(squares) || squares[i])
    {
      return;
    }

    squares[i] = this.state.turn;
    this.setState({ 
      turn: this.state.turn === 'X' ? 'O' : 'X',
      history: history.concat([{
        squares: squares,
        location: location,
      }]),
      stepNumber: history.length,
    });
  }

  reverseOrder() {
    this.setState({
      reverse: !(this.state.reverse),
    });
    console.log(this.state.reverse);
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      turn: step % 2 ? 'O' : 'X',
    })
  }

  render() {
    // const history = this.state.reverse ? this.state.history.slice(0).reverse() : this.state.history();
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    let status = winner ? "Winner is " + winner.side + "!" : "Next player: " + this.state.turn;

    const temp = history.map((step, move, loc) => {
      let desc = move ?
        'Go to move #' + move + ' ' + step.location:
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}
            style={{fontWeight: move === this.state.stepNumber ? 'bold' : 'normal'}}
          >{desc}</button>
        </li>
      )
    });

    const moves = this.state.reverse ? temp.reverse() : temp;

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner ? winner : null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <OrderButton onClick={() => this.reverseOrder()} />
          <ol reversed = {this.state.reverse}>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
