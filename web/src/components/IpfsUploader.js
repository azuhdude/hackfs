import React, {useRef, useState} from "react"
import {uploadFile, validateAddress} from "../services/ipfs"
import {Box, Button, Text, TextInput} from "grommet/es6"

export default ({name, label, required}) => {
    const fileInput = useRef()
    const [uploading, setUploading] = useState(false)
    const [validating, setValidating] = useState(false)

    const [address, setAddress] = useState('')

    const validate = async () => {
        if (!address) return
        setValidating(true)
        const exists = await validateAddress(address)
        if (!exists) setAddress('')
        setValidating(false)
    }

    const uploadToIPFS = async () => {
        setUploading(true)
        const file = fileInput.current.files[0]
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (e) {
            const data = e.target.result
            uploadFile({content: data}).then((address) => {
                setAddress(address)
            }).finally(() => setUploading(false))
        }
        reader.onerror = function (evt) {
            document.getElementById("fileContents").innerHTML = "error reading file";
        }
    }

    let buttonLabel
    if (uploading) {
        buttonLabel = 'Uploading...'
    } else if (validating) {
        buttonLabel = 'Validating...'
    } else {
        buttonLabel = 'Upload File'
    }

    return <Box align={'start'}>
        <Text margin={'0 10px'}>{label}</Text>
        <Box direction={'row'} align={'center'} gap={'small'}>
            <input type={'file'} ref={fileInput} onChange={() => uploadToIPFS()} hidden/>
            <TextInput value={address} name={name}
                       onChange={(e) => setAddress(e.target.value)}
                       onBlur={() => validate()}
                       required={required}/>
            <Button label={buttonLabel}
                    onClick={() => !uploading && fileInput.current.click()}
                    primary
            />
        </Box>
    </Box>
}
