import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import './styles.css'
import { PodList } from './PodList'
import { NamespaceSelect } from './NamespaceSelect'
import { Context } from './context'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

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
  //<button onClick={startWebsockets}>Start</button>
  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src="lseg.png"
              width="150"
              height="auto"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Text>Kubernetes API demo </Navbar.Text>
          <Context.Provider value={namespaces}>
          <NamespaceSelect />
          </Context.Provider>
        </Container>
      </Navbar>
      <Container fluid="xxl">
        <span>The NS WebSocket is currently <span style={connectionStatus==='Closed' ? connClosed : connOpen}>{connectionStatus}</span></span><br></br>
        <Context.Provider value={namespaces}>
          <PodList />
        </Context.Provider>
      </Container>
    </>   
  )
}

export default App;
