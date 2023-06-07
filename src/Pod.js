import React,{ useState, useRef }  from 'react'

const  url='http://localhost:8080/deletePod/xx/yy'

export function Pod({ pod }) {
    function killPod() {
        console.log("Killing pod=" + pod.name + " ID=" + pod.id)
        // open an API call,  perform the delete of the pod
    }

    return (
        <div>
            <label>
                {pod.name}
                <a id={pod.id} title={'Kill Pod '} onClick={killPod} href='#'>Kill</a>
            </label> 
        </div>
    )
}