import React, { useState, useEffect } from 'react';
import { Pod } from './Pod';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export function PodList() {
    const [podlist, getPodlist] = useState([{id: 1, name: 'pod1'},{id: 2, name: 'pod2'},{id: 3, name: 'pod3'}]) // xxx change this


    // websocket 
    const [psocketUrl, psetSocketUrl] = useState('ws://localhost:8080/ws/pods');
    const [pmessageHistory, psetMessageHistory] = useState([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(psocketUrl, {
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

    }, [podlist])

    useEffect(() => {
        if (lastMessage !== null) {
          psetMessageHistory((prev) => prev.concat(lastMessage));
          console.log(lastMessage,"Pods update received");   
        }
      }, [lastMessage, psetMessageHistory]);

    const connClosed = { color: 'black', background: 'red'}
    const connOpen = { color: 'blue', background: 'white'}
    
    return (
        <>
            <br></br><span>The Pods WebSocket is currently <span style={connectionStatus==='Closed' ? connClosed : connOpen}>{connectionStatus}</span></span><br></br>
            {podlist.map(pod => {
                return <Pod key={pod.id} pod={pod}/>
            })};
            <br/>
      <div>
        {lastMessage ? <span>Last POD message: {lastMessage.data}</span> : null}
        <br></br><span>Pod History</span>
        <ul>
          {pmessageHistory.map((message, idx) => (
            <span key={idx}>{message ? message.data : null}</span>
          ))}
        </ul>
      </div>
        </>
        
    )
}