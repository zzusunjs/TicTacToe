import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.middleClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squareValues[i]}
            middleClick={() =>  this.props.onClick(i) }
         />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [{values : Array(9).fill('')}],
            currentIdx: 0,
            xIsNext: true,
            winer: null,
        };
        
    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.currentIdx+1);
        const current = history[history.length-1];
        // 根据跳转或自然增加的结果截取 history
        // 获取跳转结果的这一步
        // 胜负已分或已经落子

        if(this.state.winer || current.values[i]){
            return;
        }

        let newSquareValues = current.values.slice();
        newSquareValues[i] = this.state.xIsNext ? 'X' : 'O';
        const winer =  calculateWiner(newSquareValues);

        this.setState({
            history: history.concat([{values:newSquareValues}]),
            xIsNext: history.length % 2 === 0,
            winer: winer,
            currentIdx: history.length,
        });
    }

    goto(index){
        const squareValues =  this.state.history[index].values;
        const newWiner = calculateWiner(squareValues);
        this.setState({
            currentIdx: index,
            winer: newWiner,
            xIsNext: index % 2 === 0,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.currentIdx];

        let status;
        if(!this.state.winer){
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }else{
            if(this.state.winer === 'even'){
                status = 'ends in a draw';
            }else{
                status = 'Winner: ' + this.state.winer;
            }
        }


        const move = history.map((item, index) => {
            let desc = index === 0 ? 'Game Start' : `Go to step #${index}`;
            
            return(
                <li key={index}>
                    <button onClick={() => this.goto(index)}>{desc}</button>
                </li>
            ) 
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squareValues={current.values}
                        winer={this.state.winer}
                        xIsNext={this.state.xIsNext}
                        onClick={(i) => {this.handleClick(i)}}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{move}</ol>
                </div>
            </div>
        );
    }
}

function calculateWiner(squareValues) {
    // squareValue: Array(9) 传入数组 3*3 方格上的落子记录
    // return 'X' or 'O' for winer, or null for even

    // 获胜的多种方式
    const winPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]];

    for (let pos of winPositions) {
        if (squareValues[pos[0]] && squareValues[pos[0]] === squareValues[pos[1]]
            && squareValues[pos[0]] === squareValues[pos[2]]) {
            return squareValues[pos[0]];
        }
        // 三颗棋子连成线
    }

    // 未分出胜负
    for(let item of squareValues){
        if(item !== 'X' && item !== 'O'){
            return null;
        }
    }

    // 平局
    return 'even';
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
