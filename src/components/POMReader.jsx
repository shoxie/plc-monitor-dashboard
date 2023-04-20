import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import Loading from "./Loading";
import { CapacitorHttp } from "@capacitor/core";
import { getData, reader } from "@/lib/api";
import useDeviceDetect from "./../lib/useDevicDetect";
import { getServerConfig } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function getArr(arr, newVal) {
  if (arr.length === 0 && !newVal) return [];

  const newArr = [...arr, newVal];
  // limit array to 10 items
  if (newArr.length > 10) {
    newArr.shift();
  }
  return newArr;
}

export const data = {
  labels: [],
  datasets: [
    {
      fill: true,
      label: "Ampere",
      data: [0],
      borderColor: "red",
      backgroundColor: "transparent",
    },
    {
      fill: true,
      label: "Voltage",
      data: [0],
      borderColor: "green",
      backgroundColor: "transparent",
    },
    {
      fill: true,
      label: "Frequency",
      data: [0],
      borderColor: "blue",
      backgroundColor: "transparent",
    },
  ],
};

export const POMReader = ({ addresses, url, onUrlError }) => {
  const [voltageData, setVoltageData] = React.useState(null);
  const [freqData, setFreqData] = React.useState(null);
  const [ampereData, setAmpereData] = React.useState(null);
  const [powerData, setPowerData] = React.useState(0);
  const [controlStates, setControlStates] = React.useState({
    prevState: false,
    currentState: true,
  });
  const [config, setConfig] = React.useState(null);
  const [chartOptions, setChartOptions] = React.useState({
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: addresses.device,
      },
    },
  });
  const [currentStat, setCurrentStat] = React.useState({
    ampere: 0,
    voltage: 0,
    frequency: 0,
    power: 0,
  })
  const voltageChartRef = React.useRef(null);
  const freqChartRef = React.useRef(null);
  const ampereChartRef = React.useRef(null);
  const powerChartRef = React.useRef(null);

  const [test, settest] = React.useState(null);

  const isMobile = Capacitor.getPlatform() !== "web";

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!config) {
        const serverConfig = await getServerConfig()
        setConfig(serverConfig)
        return
      }
      if (!freqData || !voltageData || !ampereData || !powerData) {
        await getData(
          config.url,
          {
            where: {
              device: addresses.device,
            },
            orderBy: {
              time: "desc",
            },
            take: 10,
          },
          isMobile,
          function (data) {
            const labels = data.map((item) =>
              moment(item.time).format("HH:mm:ss")
            );
            const ampere = data.map((item) => item.ampere);
            const voltage = data.map((item) => item.voltage);
            const frequency = data.map((item) => item.freq);
            const power = data.map((item) => item.power);

            // const labels = []
            // const ampere = []
            // const voltage = []
            // const frequency = []
            // const power = []

            setAmpereData({
              labels,
              datasets: [
                {
                  fill: false,
                  label: "Ampere",
                  data: ampere,
                  borderColor: "red",
                  backgroundColor: "transparent",
                },
              ],
            });
            setVoltageData({
              labels,
              datasets: [
                {
                  fill: false,
                  label: "Voltage",
                  data: voltage,
                  borderColor: "green",
                  backgroundColor: "transparent",
                },
              ],
            });
            setFreqData({
              labels,
              datasets: [
                {
                  fill: false,
                  label: "Frequency",
                  data: frequency,
                  borderColor: "blue",
                  backgroundColor: "transparent",
                },
              ],
            });
            setPowerData({
              labels,
              datasets: [
                {
                  fill: false,
                  label: "Power",
                  data: power,
                  borderColor: "red",
                  backgroundColor: "transparent",
                },
              ],
            });

            setCurrentStat({
              ampere: ampere[ampere.length - 1],
              voltage: voltage[voltage.length - 1],
              frequency: frequency[frequency.length - 1],
              power: power[power.length - 1],
            })
          }
        );
      }

      if (!voltageChartRef.current || !voltageChartRef.current.config) return;
      if (!freqChartRef.current || !freqChartRef.current.config) return;
      if (!ampereChartRef.current || !ampereChartRef.current.config) return;
      if (!powerChartRef.current || !powerChartRef.current.config) return;

      const readerData = await reader(
        config.url,
        addresses,
        true,
        isMobile,
        function (readerData) {
          console.log(data);
        }
      );
      const values = readerData.values;

      setControlStates({
        currentState: readerData.state,
      });

      const ampere = getArr(
        ampereChartRef.current.config.data.datasets[0].data,
        values.ampere
      );
      const voltage = getArr(
        voltageChartRef.current.config.data.datasets[0].data,
        values.voltage
      );
      const freq = getArr(
        freqChartRef.current.config.data.datasets[0].data,
        values.freq
      );
      const power = getArr(
        powerChartRef.current.config.data.datasets[0].data,
        values.power
      );
      const labels = getArr(
        freqChartRef.current.config.data.labels,
        moment(readerData.time).format("HH:mm:ss")
      );

      ampereChartRef.current.config.data.datasets[0].data = ampere;
      voltageChartRef.current.config.data.datasets[0].data = voltage;
      freqChartRef.current.config.data.datasets[0].data = freq;
      powerChartRef.current.config.data.datasets[0].data = power;

      ampereChartRef.current.config.data.labels = labels;
      voltageChartRef.current.config.data.labels = labels;
      freqChartRef.current.config.data.labels = labels;
      powerChartRef.current.config.data.labels = labels;

      // set current stat for last data of chart
      setCurrentStat({
        ampere: ampere[ampere.length - 1],
        voltage: voltage[voltage.length - 1],
        frequency: freq[freq.length - 1],
        power: power[power.length - 1],
      })

      ampereChartRef.current.update();
      freqChartRef.current.update();
      voltageChartRef.current.update();
      powerChartRef.current.update();
    }, 2000);

    return () => {
      clearInterval(interval);
      if (voltageChartRef.current) {
        voltageChartRef.current.destroy();
        voltageChartRef.current = null;
      }
      if (freqChartRef.current) {
        freqChartRef.current.destroy();
        freqChartRef.current = null;
      }
      if (ampereChartRef.current) {
        ampereChartRef.current.destroy();
        ampereChartRef.current = null;
      }
      if (powerChartRef.current) {
        powerChartRef.current.destroy();
        powerChartRef.current = null;
      }
    };
  }, [freqData, config]);

  if (!freqData || !voltageData || !ampereData) {
    return <Loading />;
  }

  return (
    <Box>
      <>
      <SimpleGrid columns={2} spacing={10}>
        <Box bg={"gray.200"} rounded={"md"} p={3}>
          <Text>{`Công suất: ${currentStat.power}`}</Text>
        </Box>
        <Box bg={"gray.200"} rounded={"md"} p={3}>
          <Text>{`Điện áp: ${currentStat.voltage}`}</Text>
        </Box>
        <Box bg={"gray.200"} rounded={"md"} p={3}>
          <Text>{`Dòng điện: ${currentStat.ampere}`}</Text>
        </Box>
        <Box bg={"gray.200"} rounded={"md"} p={3}>
          <Text>{`PF: ${currentStat.frequency}`}</Text>
        </Box>
      </SimpleGrid>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={6}
        >
          <GridItem w="full">
            <Line
              ref={voltageChartRef}
              options={chartOptions}
              data={voltageData}
            />
          </GridItem>
          <GridItem w="full">
            <Line
              ref={ampereChartRef}
              options={chartOptions}
              data={ampereData}
            />
          </GridItem>
          <GridItem w="full">
            <Line ref={powerChartRef} options={chartOptions} data={powerData} />
          </GridItem>
          <GridItem w="full">
            <Line ref={freqChartRef} options={chartOptions} data={freqData} />
          </GridItem>
        </Grid>
      </>
      <div className="mt-20">
        <h2 className="font-bold text-xl">Controls</h2>
        <HStack>
          <Button
            disabled={
              controlStates === "interrupt" || controlStates === "tripped"
            }
          >
            On
          </Button>
          <Button disabled={controlStates === "closed"}>Off</Button>
        </HStack>
      </div>
      <div>{JSON.stringify(test)}</div>
    </Box>
  );
};
