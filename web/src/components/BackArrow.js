import {LinkPrevious} from 'grommet-icons'
import React from 'react'
import { Box } from 'grommet'

export default ({onClick}) => {
    return <Box gap={'medium'} direction={'row'} onClick={onClick} pad={'10px 20px'}>
        <LinkPrevious size={'medium'}/>
        Back
    </Box>
}
