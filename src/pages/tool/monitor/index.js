import { Box, Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useState } from "react";
import { POMReader } from "@/components/POMReader";
import { useAtom } from "jotai";
import { urlAtom } from "@/lib/atoms";
import Layout from "@/layouts/SignedIn";

const options = [
  {
    voltage: "DB23,R56",
    freq: "DB23,R220",
    power: "DB23,R120",
    ampere: "DB23,R0",
    closed: "I0.1",
    tripped: "I0.2",
    device: "POM01"
  },
  {
    voltage: "DB23,R572",
    freq: "DB23,R736",
    power: "DB23,R636",
    ampere: "DB23,R516",
    closed: "I0.7",
    tripped: "I1.0",
    device: "POM02"
  },
  {
    voltage: "DB23,R1088",
    freq: "DB23,R1252",
    power: "DB23,R1172",
    ampere: "DB23,R1032",
    closed: "I0.4",
    tripped: "I0.5",
    device: "POM03"
  },
  {
    voltage: "DB23,R2120",
    freq: "DB23,R2284",
    power: "DB23,R2172",
    ampere: "DB23,R2064",
    closed: "I1.2",
    tripped: "I1.3",
    device: "POM04"
  },
  {
    voltage: "DB23,R2636",
    freq: "DB23,R2800",
    power: "DB23,R2688",
    ampere: "DB23,R2580",
    closed: "I1.5",
    tripped: "I2.0",
    device: "POM05"
  },
]

const Monitor = () => {
  const [selectedDevice, setSelectedDevice] = useState(options[0])
  const [url, setUrl] = useAtom(urlAtom)
  const [key, setKey] = useState(0)

  function onSubmit(e) {
    e.preventDefault()
    setUrl(e.target.url.value)
    setKey(Math.random())
  }

  function onUrlError() {
    setUrl("")
  }

  if (!url) {
    return (
      <Box>
        <form onSubmit={onSubmit}>
          <FormControl>
            <FormLabel>Set endpoint server</FormLabel>
            <Input id="url" />
            <Button type="submit">Go</Button>
          </FormControl>
        </form>
      </Box>
    )
  }

  return (
    <div>
      <FormControl>
        <FormLabel>Select a device</FormLabel>
        <Select placeholder='Select device' onChange={e => setSelectedDevice(options[parseInt(e.target.value)])}>
          <option value='0'>POM1</option>
          <option value='1'>POM2</option>
          <option value='2'>POM3</option>
          <option value='3'>POM4</option>
          <option value='4'>POM5</option>
        </Select>
      </FormControl>
      <POMReader addresses={selectedDevice} key={selectedDevice.device} url={url} onUrlError={onUrlError} />
    </div>
  )
}

Monitor.Layout = Layout;
export default Monitor;