import React from 'react'
import { Pod } from './Pod'

export function PodList({ podlist }) {
    return (
        podlist.map(pod => {
            return <Pod key={pod.id} pod={pod}/>
        })
    )
}