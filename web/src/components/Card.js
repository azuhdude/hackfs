import React from 'react'
import {Box} from 'grommet'
import styled from 'styled-components'

const CardBox = styled(Box)`
    margin: 10px 10px;
    width: calc(100% - 20px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    
    &:hover {
        box-shadow: 0 7px 21px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
        cursor: pointer;
    }
`

export default CardBox
