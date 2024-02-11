/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './Game.css'
import GobbletGobblersRules from './GobbletGobblersRules'

const Game = (props) => {
  const {
    socket,
    userSymbol,
    roomId,
  } = props

  // ** States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isXNext, setIsXNext] = useState(true)
  const [playerXPieces, setPlayerXPieces] = useState([1, 2, 3, 4, 5, 6])
  const [playerOPieces, setPlayerOPieces] = useState([1, 2, 3, 4, 5, 6])
  const [gameCells, setGameCells] = useState(Array(9).fill([0, "", ""]))
  const [weightOfX, setWeightOfX] = useState(0)
  const [weightOfO, setWeightOfO] = useState(0)
  const [isGameWon, setIsGameWon] = useState(false)
  const [isGameLive, setIsGameLive] = useState(true)

  useEffect(() => {
    socket.on('update-game', (playedMove, index) => {
      let updatedCells = [...gameCells]
      updatedCells[index] = playedMove
      setGameCells(updatedCells)
      if (playedMove[1] === 'x') {
        let updateXPieces = [...playerXPieces]
        let index = playerXPieces.indexOf(playedMove[0])
        updateXPieces[index] = playedMove[1]
        setPlayerXPieces(updateXPieces)
        setIsXNext(false)
      } else if (playedMove[1] === 'o') {
        let updateOPieces = [...playerOPieces]
        let index = playerOPieces.indexOf(playedMove[0])
        updateOPieces[index] = playedMove[1]
        setPlayerOPieces(updateOPieces)
        setIsXNext(true)
      }
      console.log(`weight of ${playedMove[0]} at position ${index} moved by ${playedMove[1]}`);
    })

    socket.on('won-game', (playedMove, index, winningLine) => {
      const [a,b,c] = winningLine
      let updatedCells = [...gameCells]
      updatedCells[index] = playedMove
      updatedCells[a][2] = 'won'
      updatedCells[b][2] = 'won'
      updatedCells[c][2] = 'won'
      setIsGameWon(true)
      setIsGameLive(false)
      setGameCells(updatedCells)
    })

    return (() => {
      socket.off('update-game')
      socket.off('won-game')
    })
  }, [socket, gameCells, isXNext, playerOPieces, playerXPieces])

  useEffect(() => {
    socket.on('reset', () => {
      console.log('reset');
      handleResetGame()
    })
    return () => {
      socket.off('won-game')
    }
  }, [socket])
  

  const handleUpdateGame = (playedMove, index) => {
    socket.emit('update-game', roomId, playedMove, index, (playedMove) => {
      console.log(`weight of ${playedMove[0]} at position ${index} moved by ${playedMove[1]}`);
    })
  }

  const handleWonGame = (playedMove, index, winningLine) => {
    socket.emit('won-game', roomId, playedMove, index, winningLine, (playedMove) => {
    })
  }

  const handlePlayerX = (piece, index) => {
    if ((isXNext && userSymbol === 'X') && weightOfX === 0 && isGameLive) {
      if (piece === 'X') {
        alert('Aleardy Used')
        return
      }
      setWeightOfX(piece)
      let newPlayerXPieces = [...playerXPieces]
      newPlayerXPieces[index] = 'X'
      setPlayerXPieces(newPlayerXPieces)
    }
  }

  const handlePlayerO = (piece, index) => {
    if ((!isXNext && userSymbol === 'O') && weightOfO === 0 && isGameLive) {
      if (piece === 'O') {
        alert('Aleardy Used')
        return
      }
      setWeightOfO(piece)
      let newPlayerOPieces = [...playerOPieces]
      newPlayerOPieces[index] = 'O'
      setPlayerOPieces(newPlayerOPieces)
    }
  }

  const handleCellClick = (index) => {
    let weight = gameCells[index][0]
    if (
      !isGameLive ||
      (weightOfX === 0 && weightOfO === 0) ||
      (weightOfX <= weight && weightOfO <= weight) ||
      (isXNext && userSymbol === 'O')
    ) {
      return
    }
    let updateSelectedCell = [weightOfX ? weightOfX : weightOfO, userSymbol.toLowerCase(), '']
    let updatedCells = [...gameCells]
    updatedCells[index] = updateSelectedCell
    calculateWinner(updatedCells, updateSelectedCell, index)
  }

  const calculateWinner = (gameCells, updateSelectedCell, index) => {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (gameCells[a][1] && gameCells[a][1] === gameCells[b][1] && gameCells[a][1] === gameCells[c][1]) {
        let updateedGameCell = [...gameCells]
        updateedGameCell[a][2] = 'won'
        updateedGameCell[b][2] = 'won'
        updateedGameCell[c][2] = 'won'
        setGameCells(updateedGameCell)
        setIsGameWon(true)
        setIsGameLive(false)
        handleWonGame(updateSelectedCell, index, [a, b, c])
        return gameCells[a][1]
      }
    }
    handleUpdateGame(updateSelectedCell, index)
    setGameCells(gameCells)
    setIsXNext(!isXNext)
    setWeightOfX(0)
    setWeightOfO(0)
    return false
  };

  const calculateGameStatues = () => {
    return isGameWon ? `${(isXNext ? 'X' : 'O')} has won!` : (isXNext ? 'X' : 'O') + ' is next';
  }

  const handleResetClick = () => {
    if (userSymbol !== 'X') {
      alert('You can not reset the game!')
    } else {
      socket.emit('reset', roomId)
      handleResetGame()
    }
  }

  const handleResetGame = () => {
    setIsXNext(true)
    setGameCells(Array(9).fill([0, "", ""]))
    setPlayerXPieces([1, 2, 3, 4, 5, 6])
    setPlayerOPieces([1, 2, 3, 4, 5, 6])
    setWeightOfX(0)
    setWeightOfO(0)
    setIsGameWon(false)
    setIsGameLive(true)
  }

  return (
    <>
      <div className="container">
        <div className="title-section">
          <div className="title">Gobblet Gobbler</div>
          <div className="underline"></div>
        </div>
        <div className="rules" onClick={() => setIsModalOpen(true)}>How to play?</div>

        {
          isModalOpen && <GobbletGobblersRules setIsModalOpen={setIsModalOpen} />
        }

        <div className="status-section">
          <div className="status">{calculateGameStatues(gameCells)}</div>
          <div className="reset" onClick={handleResetClick}>Reset</div>
        </div>

        <div className="player-x">
          {
            playerXPieces.map((playerXPiece, index) => (
              <div
                key={index}
                className="box player-x-weight"
                onClick={() => handlePlayerX(playerXPiece, index)}
              >
                {playerXPiece}
              </div>
            ))
          }
        </div>

        <div className="game-board">
          {
            gameCells.map((gameCell, index) => (
              <div
                key={gameCell[1] + index}
                className={`game-cell ${gameCell[1]} ${gameCell[2]}`}
                onClick={() => handleCellClick(index)}
              >
                {gameCell[0]}
              </div>
            ))
          }
        </div>


        <div className="player-o">
          {
            playerOPieces.map((playerOPiece, index) => (
              <div
                key={index}
                className="box player-o-weight"
                onClick={() => handlePlayerO(playerOPiece, index)}
              >
                {playerOPiece}
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Game
