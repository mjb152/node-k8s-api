import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import './styles.css'
import { PodList } from './PodList'
import { NamespaceSelect } from './NamespaceSelect'
import { Context } from './context'
import useWebSocket, { ReadyState } from 'react-use-websocket';

function App() {
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


  function startWebsockets(e) {
    //alert("starting")
    //console.log({podlist},"Starting button pushed");
    setNamespaces([{id: 1, name: 'pod1'}]);
  }
  
  const connClosed = { color: 'black', background: 'red'}
  const connOpen = { color: 'blue', background: 'white'}

  // <PodList podlist={podlist}/>
  return (
    <>
      <button onClick={startWebsockets}>Start</button>
      <span>The NS WebSocket is currently <span style={connectionStatus==='Closed' ? connClosed : connOpen}>{connectionStatus}</span></span><br></br>
      <Context.Provider value={namespaces}>
        <NamespaceSelect />
        <PodList />
      </Context.Provider>
    </>
    
  )
}

export default App;
