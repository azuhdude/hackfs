import { FormField, TextInput} from 'grommet'
import React from 'react'

export default ({register, label, placeholder, ...props}) => {
    return <FormField label={label}>
        <TextInput ref={register} placeholder={placeholder} {...props}/>
    </FormField>
}
