import React,{ useState, useRef }  from 'react'

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
    const running = { color: 'black', background: 'white'}
    const nrunning = { color: 'black', background: 'red'}

    return (
        <div>
            <label style={pod.status==='Running' ? running : nrunning}>
                {pod.id} - {pod.name} {pod.status} {pod.action}  - 
                <a id={pod.id} title={'Kill Pod '} onClick={killPod} href='#'>Kill</a>
            </label> 
        </div>
    )
}