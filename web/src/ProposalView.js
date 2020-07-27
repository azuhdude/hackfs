import React from 'react'

export default ({proposal}) => {
    return <div>
        <h1>Name</h1>
        <h2>{proposal.name}</h2>
        <h1>Description</h1>
        <h2>{proposal.description}</h2>
    </div>
}
