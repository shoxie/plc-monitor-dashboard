import Layout from "@/layouts/SignedIn";
import { reader } from "@/lib/api";
import { isModileAtom } from "@/lib/atoms";
import { getServerConfig } from "@/lib/utils";
import { Box, HStack, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

const Overview = () => {
    const [pom1, setPom1] = useState(0)
    const [pom2, setPom2] = useState(0)
    const [pom3, setPom3] = useState(0)
    const [pom4, setPom4] = useState(0)
    const [pom5, setPom5] = useState(0)
    const [config, setConfig] = useState(null)
    const [isMobile] = useAtom(isModileAtom)

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!config) {
                const serverConfig = await getServerConfig()
                setConfig(serverConfig)
                return
            }
            const readerData = await reader(
                config.url,
                {
                    pom1: "DB23,R120",
                    pom2: "DB23,R636",
                    pom3: "DB23,R1172",
                    pom4: "DB23,R2172",
                    pom5: "DB23,R2688",
                },
                true,
                isMobile,
                function (readerData) {
                    const pom1Val = readerData.values.pom1_power ? readerData.values.pom1_power : readerData.values.pom1;
                    const pom2Val = readerData.values.pom2_power ? readerData.values.pom2_power : readerData.values.pom2;
                    const pom3Val = readerData.values.pom3_power ? readerData.values.pom3_power : readerData.values.pom3;
                    const pom4Val = readerData.values.pom4_power ? readerData.values.pom4_power : readerData.values.pom4;
                    const pom5Val = readerData.values.pom5_power ? readerData.values.pom5_power : readerData.values.pom5;
                    setPom1(pom1Val)
                    setPom2(pom2Val)
                    setPom3(pom3Val)
                    setPom4(pom4Val)
                    setPom5(pom5Val)
                }
            
            );
        }, 5000);

        return () => {
            clearInterval(interval);

        };
    });
    return (
        <SimpleGrid columns={3} spacing={20}>
            <VStack>
                <Heading>Grid</Heading>
                <GaugeChart id="gauge-chart1" colors={["#5BE12C"]} nrOfLevels={1} percent={isNaN((parseFloat(pom1) / 4)) ? 0 : (parseFloat(pom1) / 4)} textColor={"#000000"} hideText />
                <Heading>{Number.parseFloat(pom1).toFixed(2)} Kwh</Heading>
            </VStack>
            <VStack>
                <Heading>Grid + Sola</Heading>
                <GaugeChart id="gauge-chart1" colors={["#5BE12C"]} nrOfLevels={1} percent={isNaN((parseFloat(pom2) / 4)) ? 0 : (parseFloat(pom2) / 4)} textColor={"#000000"} hideText />
                <Heading>{Number.parseFloat(pom2).toFixed(2)} Kwh</Heading>
            </VStack>
            <VStack>
                <Heading>Gen</Heading>
                <GaugeChart id="gauge-chart1" colors={["#5BE12C"]} nrOfLevels={1} percent={isNaN((parseFloat(pom3) / 4)) ? 0 : (parseFloat(pom3) / 4)} textColor={"#000000"} hideText />
                <Heading>{Number.parseFloat(pom3).toFixed(2)} Kwh</Heading>
            </VStack>
            <VStack>
                <Heading>Load 1</Heading>
                <GaugeChart id="gauge-chart1" colors={["#5BE12C"]} nrOfLevels={1} percent={isNaN((parseFloat(pom4) / 4)) ? 0 : (parseFloat(pom4) / 4)} textColor={"#000000"} hideText />
                <Heading>{Number.parseFloat(pom4).toFixed(2)} Kwh</Heading>
            </VStack>
            <VStack>
                <Heading>Load 2</Heading>
                <GaugeChart id="gauge-chart1" colors={["#5BE12C"]} nrOfLevels={1} percent={isNaN((parseFloat(pom5) / 4)) ? 0 : (parseFloat(pom5) / 4)} textColor={"#000000"} hideText />
                <Heading>{Number.parseFloat(pom5).toFixed(2)} Kwh</Heading>
            </VStack>
            <VStack>
                <Heading>Load 2</Heading>
                <GaugeChart id="gauge-chart1" colors={["#5BE12C"]} nrOfLevels={1} percent={isNaN((parseFloat(pom5) / 4)) ? 0 : (parseFloat(pom5) / 4)} textColor={"#000000"} hideText />
                <Heading>{Number.parseFloat(pom5).toFixed(2)} Kwh</Heading>
            </VStack>
        </SimpleGrid>
    )
}

Overview.Layout = Layout;
export default Overview;