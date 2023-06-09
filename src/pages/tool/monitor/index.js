import { Box, Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { POMReader } from "@/components/POMReader";
import { useAtom } from "jotai";
import { selectedDeviceAtom, urlAtom } from "@/lib/atoms";
import Layout from "@/layouts/SignedIn";
import { useRouter } from "next/router";

const Monitor = () => {
  const [selectedDevice, setSelectedDevice] = useAtom(selectedDeviceAtom)
  const [url, setUrl] = useAtom(urlAtom)
  const [key, setKey] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter();

  function onSubmit(e) {
    e.preventDefault()
    setUrl(e.target.url.value)
    setKey(Math.random())
  }

  function onUrlError() {
    setUrl("")
  }

  useEffect(() => {
    const deviceParams = router.query.device;
    const device = parseInt(deviceParams);
    if (!isNaN(device) && device >= 0 && device <= 4) {
      setSelectedDevice(device);
      setLoaded(true);
    }
  }, [router.query.device])

  return (
    <Box py={5}>
      { loaded && <POMReader addresses={selectedDevice.addresses} key={selectedDevice.addresses.device} toggleUrl={selectedDevice.toggleUrl} url={url} onUrlError={onUrlError} />}
    </Box>
  )
}

Monitor.Layout = Layout;
export default Monitor;