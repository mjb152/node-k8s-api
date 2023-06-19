import React, { useState, useEffect } from 'react';
import { Pod } from './Pod';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export function PodList() {
    //const [podlist, setPodlist] = useState([{id: 1, name: 'pod1'},{id: 2, name: 'pod2'},{id: 3, name: 'pod3'}]) // xxx change this
    const [podlist, setPodlist] = useState([]);

    // websocket 
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
            const data = JSON.parse(lastMessage.data)
            console.log(data,"Pods update received - " + data.status + " " + data.action);
            if (data.action == "add") {
                console.log("Pods added "+data.name);
                //const copyOfPodlist = [...podlist];

                switch (data.status) {
                    case "Running":
                        console.log("Pods Running "+data.name);
                        setPodlist(podlist => [...podlist, data]);     
                        break;
                        case "Terminating":
                            console.log("Pods Terminating "+data.name);
                            break;    
                }

                // setPodlist(podlist => [...podlist, data]);
                //         podlist.forEach(item => {
                //             console.log("Item " + item.id + " Name " + item.name );
                //         }
                if (data.status == "Terminating") {
                    //console.log("Pods Terminating "+data.name);
                }
                if (data.status == "Pending") {
                    console.log("Pods Pending "+data.name);
                }
                if (data.status == "ContainerCreating") {
                    //console.log("Pods ContainerCreating "+data.name);
                }



                // setPodlist(podlist => ({
                //     ...podlist,
                //     ...data
                // }));
                //Pending
                //Terminating
                //ContainerCreating
                //Running
                //ErrImagePull
                //ImagePullBackOff
            }

            if (data.action == "delete"){
                //console.log("Pods deleted "+data.name);
                // let copyOfPodlist = [...podlist]
                // delete copyOfPodlist[data.id]
                // console.log("Pods OLD deleted "+JSON.stringify(podlist));
                // console.log("Pods NEW deleted "+JSON.stringify(copyOfPodlist));
                //setPodlist( podlist => [...copyOfPodlist]);
                //setPodlist([...podlist, podlist.find(i => !podlist.includes(i))]);
            }
        }
      }, [lastMessage]);

    const connClosed = { color: 'black', background: 'red'}
    const connOpen = { color: 'blue', background: 'white'}
    
    function showData(e) {
        //alert("starting")
        console.log({podlist},"Starting button pushed");
        //setNamespaces([{id: 1, name: 'pod1'}]);
      }

    return (
        <>
            <br></br><span>The Pods WebSocket is currently <span style={connectionStatus==='Closed' ? connClosed : connOpen}>{connectionStatus}</span></span><br></br>
            {podlist.map(pod => {
                if (pod.id) {
                    return <Pod key={pod.id} pod={pod}/>
                }
                
            })}
            
            <button onClick={showData}>List Pods</button>
            <br/>
            <br/>

        </>
        
    )
}