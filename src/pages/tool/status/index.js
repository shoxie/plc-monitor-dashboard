import { Box, SimpleGrid, VStack, Text, HStack, Heading } from "@chakra-ui/react"
import Layout from "@/layouts/SignedIn";
import { getStatuses } from "@/lib/utils";
import axios from "axios";
import { format, isToday } from "date-fns";
import { useEffect, useState } from "react";
import { useUserAgent } from 'next-useragent'
import { isModileAtom, weatherDataAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import DataTable from "@/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import {
  WiCloud,
  WiDaySunny,
  WiFog,
  WiRain,
  WiRainMix,
  WiRainWind,
  WiThunderstorm,
} from "react-icons/wi";

function getWeatherIconByCode(code) {
    
  }
  
const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor("weatherCode", {
        cell: (info) => info.getValue(),
        header: "Thời tiết",
        meta: {
            isNumeric: false,
        },
        cell: props => {
            const config = {
                size: 36,
              };
              console.log("props", props)
              let icon;
          
              switch (props.getValue()) {
                case 0:
                  icon = <WiDaySunny {...config} />;
                  break;
                case 1:
                case 2:
                case 3:
                  icon = <WiCloud {...config} />;
                  break;
                case 45:
                case 48:
                  icon = <WiFog {...config} />;
                  break;
                case 51:
                case 53:
                case 55:
                  icon = <WiRainMix {...config} />;
                  break;
                case 56:
                case 57:
                  icon = <WiRainWind {...config} />;
                  break;
                case 61:
                case 63:
                case 65:
                  icon = <WiRain {...config} />;
                  break;
                case 66:
                case 67:
                  icon = <WiRainWind {...config} />;
                  break;
                case 80:
                case 81:
                case 82:
                  icon = <WiRain {...config} />;
                  break;
                case 95:
                case 99:
                case 96:
                  icon = <WiThunderstorm {...config} />;
                  break;
                default:
                  icon = <WiDaySunny {...config} />;
                  break;
              }
          
              return icon;
        },
    }),
    columnHelper.accessor("rain", {
        cell: (info) => info.getValue(),
        header: "Mưa",
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor("humid", {
        cell: (info) => info.getValue(),
        header: "Độ ẩm",
        meta: {
            isNumeric: true,
        },
    }),
    columnHelper.accessor("time", {
        cell: (info) => info.getValue(),
        header: "Thời gian",
        meta: {
            isNumeric: false,
        },
    }),
];

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
    const [weatherData] = useAtom(weatherDataAtom)
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        async function run() {
            try {
                const data = await getStatuses()
                console.log(data)
                setStatus(data)
            } catch (err) {
                setIsError(true)
            }
        }

        async function getNoti() {
            axios.get("/api/getNoti").then(res => setNotis(res.data))
        }

        let interval = setInterval(() => {
            if (!isError) run()
        }, 1000)

        getNoti()

        if (props.uaString) {
            setIsMobile(useUserAgent(props.uaString).isMobile)
        } else {
            setIsMobile(useUserAgent(window.navigator.userAgent).isMobile)
        }


        return () => {
            clearInterval(interval)
        }

        // run()

    }, [isError])

    useEffect(() => {
        if (!weatherData) return;

        const cellData = []

        const todayData = weatherData.hourly.time.filter(time => isToday(new Date(time)))

        for (let i = 0; i < todayData.length; i++) {
            const time = weatherData.hourly.time[i];
            const humid = weatherData.hourly.relativehumidity_2m[i];
            const rain = weatherData.hourly.rain[i]
            const weatherCode = weatherData.hourly.weathercode[i]

            cellData.push({
                time,
                rain,
                humid,
                weatherCode
            })
        }

        setTableData(cellData)
    }, [weatherData])

    return (
        <Box width="full">
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
            <SimpleGrid columns={1}>

            <Box minW="100vw">

            <Heading>Thời tiết</Heading>
                <DataTable data={tableData} columns={columns} setSortCondition={() => {}} sortCondition={null} />

                </Box>
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