import { Box, SimpleGrid, VStack, Text, HStack, Heading } from "@chakra-ui/react"
import Layout from "@/layouts/SignedIn";
import { getStatuses } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useUserAgent } from 'next-useragent'
import { isModileAtom } from "@/lib/atoms";
import { useAtom } from "jotai";

const Status = (props) => {
    const [status, setStatus] = useState({
        isOnline: false,
        onlineDevices: 0,
        power: 0,
        gen: false,
        grid: false
    })
    const [isError, setIsError] = useState(false)
    const [notis, setNotis] = useState([])
    const [, setIsMobile] = useAtom(isModileAtom)

    useEffect(() => {
        async function run() {
            try {
                const data = await getStatuses()
                console.log(data)
                setStatus(data)
            } catch(err) {
                setIsError(true)
            }
        }

        async function getNoti() {
            axios.get("/api/getNoti").then(res => setNotis(res.data))
        }

        setInterval(() => {
            if (!isError) run()
        }, 1000)

        getNoti()

        if (props.uaString) {
            setIsMobile(useUserAgent(props.uaString))
          } else {
            setIsMobile(useUserAgent(window.navigator.userAgent))
          }
        

        return () => {
            clearInterval(run)
        }

        // run()

    }, [])

    return (
        <Box>
            <SimpleGrid columns={2} spacing={20}>
                <VStack justify="center">
                    <VStack bg="gray.200" py={8} px={16} w="full">
                        <Text textTransform={"uppercase"} fontWeight={"600"} fontSize="3xl">trạng thái server</Text>
                        <Box bg={status.isOnline ? "green.400" : "red.400"} p={4}>
                            <Text textTransform={"uppercase"}>{status.isOnline ? "Online" : "Offline"}</Text>
                        </Box>
                    </VStack>
                </VStack>
                <VStack justify="center">
                    <VStack bg="gray.200" py={8} px={16} w="full">
                        <Text textTransform={"uppercase"} fontWeight={"600"} fontSize="3xl">thiết bị hoạt động</Text>
                        <Box bg={"blue.500"} p={4}>
                            <Text textTransform={"uppercase"} px={5}>{status.onlineDevices}</Text>
                        </Box>
                    </VStack>
                </VStack>
                <VStack justify="center">
                    <VStack bg="gray.200" py={8} px={16} w="full">
                        <Text textTransform={"uppercase"} fontWeight={"600"} fontSize="3xl">Công suất</Text>
                        <Box bg={"yellow"} p={4}>
                            <Text textTransform={"uppercase"} px={5}>{status.power} kW</Text>
                        </Box>
                    </VStack>
                </VStack>
                <VStack justify="center">
                    <VStack bg="gray.200" py={8} px={16} w="full">
                        <Text textTransform={"uppercase"} fontWeight={"600"} fontSize="3xl">Nguồn phát</Text>
                        <Box bg={"orange"} p={4}>
                            <Text textTransform={"uppercase"} px={5}>{status.grid ? "Hòa lưới" : status.gen ? "Máy phát" : "Không hoạt động"}</Text>
                        </Box>
                    </VStack>
                </VStack>
            </SimpleGrid>
            <Heading py="5">Thông báo</Heading>
            <VStack align="start">
                {
                    notis.map(item => (
                        <HStack key={item.created_at}>
                            <Text>{format(new Date(item.created_at), 'HH:mm:ss dd/MM/yyyy')}</Text>
                            <Text>{item.message}</Text>
                        </HStack>
                    ))
                }
            </VStack>
        </Box>
    )
}

Status.Layout = Layout
export default Status

export function getServerSideProps(context) {
    return {
      props: {
        uaString: context.req.headers['user-agent']
      }
    }
  }