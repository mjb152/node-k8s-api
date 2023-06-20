import React,{ useState, useRef }  from 'react'
import style from "./Pod.module.css";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const  url='http://localhost:8080/deletePod/'

export function Pod({ pod }) {
    function killPod() {
        console.log("Killing pod=" + pod.name + " NS = " + pod.namespace + " ID=" + pod.id)
        fetch(url + pod.namespace + '/' + pod.name)
        .then((data)=>data.json())
        .catch(err => {console.log(err," NS fetch failed")});  
        // open an API call,  perform the delete of the pod
    }

    // style={connectionStatus==='Closed' ? connOpen : connOpen}
    //Pending
    //Terminating
    //ContainerCreating
    //Running
    //ErrImagePull
    //ImagePullBackOff

    // <label style={pod.status==='Running' ? running : nrunning}>
    //     <span className={style.first}>
    //         {pod.id} - {pod.name} {pod.status} {pod.action}  - 
    //         <a id={pod.id} title={'Kill Pod '} onClick={killPod} href='#'>Kill</a>
    //     </span>
    // </label> 



    // const running = { color: 'black', background: 'white'}
    // const nrunning = { color: 'black', background: 'red'}

    // <span className={podColor}>
    //         {pod.name} {pod.status}
    //     </span> 

    let podColor;
    if (pod.status==='Running') {
        podColor = style.running
    } else if (pod.status==='Terminating') {
        podColor = style.terminating
    } else if (pod.status==='ContainerCreating') {
        podColor = style.containercreating
    } else if (pod.status==='ErrImagePull') {
        podColor = style.terminating
    } else {
        podColor = style.unknown
    }

    //<Card style={{ width: '18rem', backgroundColor: 'red' }}>
    return (  
        <> 
        <Card className={podColor} style={{ width: "12rem" }}>
            <Card.Img variant="top" src="k8s3.png"/>
            <Card.Body>
                <Card.Title>{pod.name}</Card.Title>
                <Card.Text>{pod.status}</Card.Text>
                <Button variant="danger" onClick={killPod}>Kill</Button>
            </Card.Body>
        </Card>
        </>   
    )
}