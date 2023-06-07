import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import './styles.css'
import { PodList } from './PodList'
import { NamespaceSelect } from './NamespaceSelect'
import { Context } from './context'
import useWebSocket, { ReadyState } from 'react-use-websocket';

function App() {
  const [podlist, getPodlist] = useState([{id: 1, name: 'pod1'},{id: 2, name: 'pod2'}]) // xxx change this
  const [namespaces, setNamespaces] = useState([]);

  // websocket 
  const [nsocketUrl, nsetSocketUrl] = useState('ws://localhost:8080/ws/namespaces');
  const [nmessageHistory, nsetMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(nsocketUrl, {
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      nsetMessageHistory((prev) => prev.concat(lastMessage));
      console.log("NS update received"); 
      fetch('http://localhost:8080/namespaces')
        .then((data)=>data.json())
        .then((val)=>setNamespaces(val))
        .catch(err => {console.log(err," NS fetch failed")});   
    }
  }, [lastMessage, nsetMessageHistory]);

  //console.log({namespaces},"Starting")
  useEffect(() => {

  }, [podlist])

  function startWebsockets(e) {
    //alert("starting")
    console.log({podlist},"Starting button pushed");
    setNamespaces([{id: 1, name: 'pod1'}]);
  }
  
  const connClosed = { color: 'black', background: 'red'}
  const connOpen = { color: 'blue', background: 'white'}

  return (
    <>
      <span>The NS WebSocket is currently <span style={connectionStatus==='Closed' ? connClosed : connOpen}>{connectionStatus}</span></span><br></br>
      <span>The Pods WebSocket is currently <span style={connectionStatus==='Closed' ? connClosed : connOpen}>{connectionStatus}</span></span><br></br>
      <button onClick={startWebsockets}>Start</button>
      <Context.Provider value={namespaces}>
        <NamespaceSelect />
        <PodList podlist={podlist}/>
      </Context.Provider>

      <br/>
      <div>
        {lastMessage ? <span>Last NS message: {lastMessage.data}</span> : null}
        <ul>
          {nmessageHistory.map((message, idx) => (
            <span key={idx}>{message ? message.data : null}</span>
          ))}
        </ul>
      </div>
    </>
    
  )
}

export default App;
