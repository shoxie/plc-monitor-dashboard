import { Box, Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useState } from "react";
import { POMReader } from "@/components/POMReader";
import { useAtom } from "jotai";
import { selectedDeviceAtom, urlAtom } from "@/lib/atoms";
import Layout from "@/layouts/SignedIn";

const Monitor = () => {
  const [selectedDevice, setSelectedDevice] = useAtom(selectedDeviceAtom)
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

  // if (!url) {
  //   return (
  //     <Box>
  //       <form onSubmit={onSubmit}>
  //         <FormControl>
  //           <FormLabel>Set endpoint server</FormLabel>
  //           <Input id="url" />
  //           <Button type="submit">Go</Button>
  //         </FormControl>
  //       </form>
  //     </Box>
  //   )
  // }

  return (
    <Box py={5}>
      {/* <FormControl>
        <FormLabel>Select a device</FormLabel>
        <Select placeholder='Select device' onChange={e => setSelectedDevice(options[parseInt(e.target.value)])}>
          <option value='0'>POM1</option>
          <option value='1'>POM2</option>
          <option value='2'>POM3</option>
          <option value='3'>POM4</option>
          <option value='4'>POM5</option>
        </Select>
      </FormControl> */}
      <POMReader addresses={selectedDevice} key={selectedDevice.device} url={url} onUrlError={onUrlError} />
    </Box>
  )
}

Monitor.Layout = Layout;
export default Monitor;