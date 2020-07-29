import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Home from './Home'
import NewProposal from './NewProposal'
import Proposal from './Proposal'

export default () => {
    const match = useRouteMatch()

    return <Switch>
        <Route path={`/proposals/:address`}>
            <Proposal/>
        </Route>
        <Route path={`/newProposal`}>
            <NewProposal/>
        </Route>
        <Route path={match.path}>
            <Home/>
        </Route>
    </Switch>
}
