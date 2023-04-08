import axios from "axios"
import { useEffect, useState } from "react"

const { Box, FormControl, Input, FormLabel, Heading, SimpleGrid, Switch, Button } = require("@chakra-ui/react")

const Report = () => {
    const [input, setInput] = useState({})
    const [isMailing, setIsMailing] = useState(false)

    const handleInputChange = (e, target) => setInput({ ...input, [target]: e.target.value })

    useEffect(() => {
        console.log(input)
    }, [input])

    async function generateReport() {
        const data = await axios.get(`http://localhost:3000/api/getData?where=${JSON.stringify({
            time: {
                gte: new Date(input.from).getTime(),
                lte: new Date(input.to).getTime()
            }
        })}`)  

        console.log(data)
    }

    return (
        <Box>
            <Heading>Monthly Report</Heading>
            <SimpleGrid columns={2} spacing={5}>
                <FormControl>
                    <FormLabel>From</FormLabel>
                    <Input type='datetime-local' value={input["from"]} onChange={(e) => handleInputChange(e, "from")} />
                </FormControl>
                <FormControl>
                    <FormLabel>To</FormLabel>
                    <Input type='datetime-local' value={input["to"]} onChange={(e) => handleInputChange(e, "to")} />
                </FormControl>
            </SimpleGrid>
            <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='email-alerts' mb='0'>
                    Enable email alerts?
                </FormLabel>
                <Switch checked={isMailing} onChange={e => setIsMailing(e.target.checked)} id='email-alerts' />
            </FormControl>
            <Button colorScheme='blue' onClick={generateReport}>Create</Button>
        </Box>
    )
}

export default Report