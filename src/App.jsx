import { useState, useEffect } from "react"
import "./App.css"
import Game from "./Game"
import { io } from "socket.io-client"

const App = () => {
  const generateId = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const array = new Uint32Array(Math.ceil(length))
    window.crypto.getRandomValues(array)
    let result = ""
    for (let i = 0; i < array.length; i++) {
      result += characters.charAt(array[i] % characters.length)
    }
    return result.slice(0, length)
  }

  // ** States
  const [isJoinRoom, setIsJoinRoom] = useState(false) //toggle button
  const [socket, setSocket] = useState("")
  const [roomId, setRoomId] = useState("")
  const [isRoomJoined, setisRoomJoined] = useState(false)
  const [isBothPlayerJoined, setIsBothPlayerJoined] = useState(false)
  const [userSymbol, setUserSymbol] = useState('')

  useEffect(() => {
    const socket = io("https://tic-tac-toe-backend-snowy.vercel.app/")
    socket.on("connect", () => {
      console.log(socket.id)
    })
    setSocket(socket)
    return (() => {
      socket.disconnect()
    })
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("joined", () => {
        setIsBothPlayerJoined(true)
      })
      return (() => {
        socket.off('joined')
      })
    }
  }, [socket])

  const handleCreateRoomId = () => {
    const roomId = generateId(10)
    setRoomId(roomId)
    socket.emit("create-room", roomId, (msg) => {
      console.log(msg)
      setUserSymbol('X')
      setisRoomJoined(true)
    })
  }

  const handleJoinRoom = () => {
    socket.emit("join-room", roomId, (status, msg) => {
      if (status) {
        setisRoomJoined(true)
        setIsBothPlayerJoined(true)
        setUserSymbol('O')
      } else {
        if (msg) {
          alert(msg)
        }
      }
    })
  }

  const RenderRoomDetails = () => {
    return (
      <div className="room-details">
        <h3>
          {`Joined Room ID : ${roomId}`}
        </h3>
        {isBothPlayerJoined ?
          <h3>
            {`You are ${userSymbol} and your opponent is ${userSymbol === 'X' ? 'O' : 'X'}`}
          </h3>
          :
          <h3>
            Waiting for the opponent to be joined!
          </h3>
        }
      </div>
    )
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {isBothPlayerJoined ? (
          <>
            <RenderRoomDetails />
            <Game
              socket={socket}
              userSymbol={userSymbol}
              roomId={roomId}
            />
          </>
        ) : (
          <>
            {isRoomJoined ? (
              <RenderRoomDetails />
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1>Welcome!</h1>
                <div className="switch-container">
                  <h3>
                    Create
                  </h3>
                  <label className="switch">
                    <input
                      type="checkbox"
                      value={isJoinRoom}
                      onChange={() => setIsJoinRoom(!isJoinRoom)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <h3>
                    Join
                  </h3>
                </div>
                {isJoinRoom ? (
                  <>
                    <label htmlFor="join">
                      <h3>
                        Room ID
                      </h3>
                    </label>
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="joinRoom"
                    />
                    <button className="button" onClick={() => handleJoinRoom()}>
                      Join room
                    </button>
                  </>
                ) : (
                  <button className="button" onClick={handleCreateRoomId}>
                    Create room
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default App
