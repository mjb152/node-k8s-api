import React, { useState, useEffect } from 'react';
import { Pod } from './Pod';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import style from "./PodList.module.css";

export function PodList() {

    const [allPods, setallPods] = useState(new Map());

    // websocket .. lastMessage receives all Pod update messages, all we're going to do is to alter a unique Map with the Pod ID
    const [psocketUrl, psetSocketUrl] = useState('ws://localhost:8080/ws/pods');
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
        if (lastMessage !== null) { 
            // {name: 'ppp', namespace: 'default', id: '04cb9458-4a17-4e45-86d8-5e7bf32e1320', status: 'Terminating', action: 'add'}
            const data = JSON.parse(lastMessage.data)
            console.log(data,"Pods update received - " + data.status + " " + data.action);
            if (data.action == "add") {
                console.log("Pods added "+data.name);
                
                setallPods(new Map(allPods.set(data.id,data))); // we need a new Map, so react re-renders

                console.log(allPods,"All pods")
            }

            if (data.action == "delete"){
                // Map.delete returns True/False,  so this technique make a copied of the altered data,  then sets it
                let prev = new Map(allPods);
                prev.delete(data.id);
                setallPods(prev);
                
                console.log(allPods,"All pods after delete")
            }
        }
      }, [lastMessage]);

    const connClosed = { color: 'black', background: 'red'}
    const connOpen = { color: 'blue', background: 'white'}
    
    function showData(e) {
        console.log("Starting button pushed");
    }

    //{[...allPods.keys()].map( k => (
    //    <li key={k}>xx {allPods.get(k).name} -  {allPods.get(k).status} {allPods.get(k).action}</li>
    //    ))}

    // <li key={pod}>xx {allPods.get(pod).name} -  {allPods.get(pod).status} {allPods.get(pod).action}</li>
    //<button onClick={showData}>List Pods</button>
    return (
        <>
            <br></br><span>The Pods WebSocket is currently <span style={connectionStatus==='Closed' ? connClosed : connOpen}>{connectionStatus}</span></span><br></br>
        
            <div className={style.container}>
                {Array.from(allPods.keys()).map((pod,idx) => (
                    <Pod key={pod} pod={allPods.get(pod)}/>
                ))}
            </div>
                 
            <Button variant="primary">Primary</Button>{' '}
            <br/>
            <br/>
        </>
    )
}