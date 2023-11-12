import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const WSEndpoint = '192.168.2.25' || window.location.host

function App() {
  const [isForward, setIsForward] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [turning, setTurning] = useState(0);
  const [wsMessage, setWSMessage] = useState('Connecting . . .');
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    let ws = new WebSocket('ws://' + WSEndpoint + '/connect-websocket');
    ws.onopen = () => setWSMessage('Connected to WS Server');
    ws.onclose = () => setWSMessage('Disconnect from WS Server');
    ws.onmessage = event => setWSMessage(event.data);
    ws.onerror = error => setWSMessage(`${error}`);

    wsRef.current = ws;
    return () => ws.close();
  }, [])
  const handleSpeed: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const currentSpeed = parseFloat(e.target.value)
    setSpeed(currentSpeed);
    wsRef.current?.send(`${isForward ? currentSpeed : currentSpeed * -1}#${turning}`)
  }
  const handleTurn: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const currentTurning = parseFloat(e.target.value);
    setTurning(currentTurning)
    wsRef.current?.send(`${isForward ? speed : speed * -1}#${currentTurning}`)
  }
  return (
    <div className="App">
      <header>
        <h2>
          Motor controller
        </h2>
      </header>
      <main>
        <div className='main-content'>
          <div className={`light ${isForward ? 'on' : 'off'}`}>
          </div>
          <button onClick={() => { setIsForward(!isForward) }}>
            {isForward ? 'Backward' : 'Forward'}
          </button>
          <label className='throttle'>
            <input value={speed} type='range' min={0} max={1} step={0.05} onChange={handleSpeed} />
            Speed {isForward ? speed.toFixed(2) : (speed * -1).toFixed(2)}
          </label>
          <label className='throttle'>
            <input value={turning} type='range' min={-1} max={1} step={0.05} onChange={handleTurn} />
            Turn {turning.toFixed(2)}
          </label>
          <div className='message-panel'>
            {wsMessage}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
