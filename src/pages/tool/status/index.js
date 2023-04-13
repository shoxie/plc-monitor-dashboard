const { Box, SimpleGrid, VStack, Text } = require("@chakra-ui/react")
import Layout from "@/layouts/SignedIn";
import { getStatuses } from "@/lib/utils";
import { useEffect, useState } from "react";

const Status = () => {
    const [status, setStatus] = useState({
        isOnline: false,
        onlineDevices: 0,
        power: 0
    })
    
    useEffect(() => {
        async function run() {
            setStatus(await getStatuses())
        }
        run()
    }, [])

    return (
        <Box>
            <SimpleGrid columns={2} spacing={20}>
                <VStack justify="center">
                    <VStack bg="gray.200" py={8} px={16} w="full">
                        <Text textTransform={"uppercase"} fontWeight={"600"} fontSize="3xl">trạng thái</Text>
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
                            <Text textTransform={"uppercase"} px={5}>{status.power}kW</Text>
                        </Box>
                    </VStack>
                </VStack>
                <VStack justify="center">
                    <VStack bg="gray.200" py={8} px={16} w="full">
                        <Text textTransform={"uppercase"} fontWeight={"600"} fontSize="3xl">Truy cập</Text>
                        <Box bg={"orange"} p={4}>
                            <Text textTransform={"uppercase"} px={5}>{status.onlineDevices}</Text>
                        </Box>
                    </VStack>
                </VStack>
            </SimpleGrid>
        </Box>
    )
}

Status.Layout = Layout
export default Status