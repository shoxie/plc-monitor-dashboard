import React, { useEffect, useState } from "react";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parse,
  getDay,
  parseISO,
  getMonth,
} from "date-fns";
import {
  Box,
  HStack,
  Text,
  Icon,
  VStack,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { faker } from "@faker-js/faker";

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

function CalendarHeader({ currentMonth, setCurrentMonth }) {
  const dateFormat = "MMMM yyyy";

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <HStack justify="space-between">
      <Icon
        as={HiChevronLeft}
        onClick={prevMonth}
        boxSize={"12"}
        cursor="pointer"
      />
      <Text fontWeight="600" fontSize="xl">
        {format(currentMonth, dateFormat)}
      </Text>
      <Icon
        as={HiChevronRight}
        onClick={nextMonth}
        boxSize={"12"}
        cursor="pointer"
      />
    </HStack>
  );
}

function CalendarDays({ currentMonth }) {
  const [days, setDays] = useState([]);
  const dateFormat = "eeee";

  let startDate = startOfWeek(currentMonth);

  useEffect(() => {
    const tempDays = [];
    for (let i = 0; i < 7; i++) {
      tempDays.push(format(addDays(startDate, i), dateFormat));
    }
    setDays(tempDays);
  }, []);

  return (
    <HStack w="full">
      {days.map((content, idx) => (
        <Flex
          flexBasis={0}
          flexGrow={1}
          justify={"center"}
          align={"center"}
          key={idx}
        >
          <Text align="center" fontWeight="600">
            {content}
          </Text>
        </Flex>
      ))}
    </HStack>
  );
}

function PerDayModal({ day }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chartData, setChartData] = useState(null)
  const [options, setOptions] = useState(null)

  useEffect(() => {
    function fillMissingHours(hourlySum) {
      const filledHourlySum = [];
      for (let hour = 0; hour < 24; hour++) {
        const existingHourlySum = hourlySum.find((x) => x.hour === hour);
        if (existingHourlySum) {
          filledHourlySum.push(existingHourlySum);
        } else {
          filledHourlySum.push({
            hour,
            power: 0
          });
        }
      }
      return filledHourlySum;
    }

    function transformToChartJSFormat(data) {
      const labels = data.map((item) => item.hour.toString());
      const powers = data.map((item) => item.power);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Power',
            data: powers,
            backgroundColor: 'rgba(0, 123, 255, 0.5)', // Set your desired background color
            borderColor: 'rgba(0, 123, 255, 1)', // Set your desired border color
            borderWidth: 1
          }
        ]
      };
    }

    const hourlySum = [];
    day.data.forEach((obj) => {
      const createdDate = new Date(obj.created_at);
      const hour = createdDate.getHours();
    
      const existingHourlySum = hourlySum.find((x) => x.hour === hour);
    
      if (existingHourlySum) {
        existingHourlySum.power += obj.power1 + obj.power2;
        existingHourlySum.occurrences += 1;
      } else {
        const occurrences = obj.power1 === 0 && obj.power2 === 0 ? 0 : 1;
        hourlySum.push({
          hour,
          power: obj.power1 + obj.power2,
          occurrences: occurrences,
        });
      }
    });
    
    hourlySum.forEach((sum) => {
      if (sum.occurrences > 1) {
        sum.power = sum.power / sum.occurrences;
      }
    });
    const data = fillMissingHours(hourlySum);
    const chart = transformToChartJSFormat(data);
    setChartData(chart)

    setOptions({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: day.selectedDate,
        },
      },
    })

  }, [day]);

  const currentDate = new Date();
  const isSameMonth = currentDate.getMonth() === new Date(day.actualDate).getMonth();

  return (
    <>
      <Button onClick={onOpen} w="full" h="full" position="relative">
        <Text>
          {Math.round((day.powerSum / day.data.length) * day.hours) || 0} KWh
        </Text>
        <Text align="center" position="absolute" bottom={0} right={0}>
          {day.date}
        </Text>
        {new Date().getDate().toString() === day.date && isSameMonth && (
          <Box position="absolute" left={3} top={0} w="2" h="full" bg="cyan.400" />
        )}
      </Button>
      <Box position={"fixed"} top={0} left={0}>
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{options?.plugins?.title?.text ?? "Modal Title"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {
                chartData && options && (
                  <Bar options={options} data={chartData} />
                )
              }
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}

function CalendarCells({ currentMonth, selectedDate, events }) {
  const [days, setDays] = useState([]);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const dateFormat = "d";

  // events.map((item) => {
  //   if (isSameDay(new Date(item.date), currentMonth))
  //     console.log(new Date(item.date).getDate(), new Date(currentMonth).getDate());
  // });

  useEffect(() => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        if (getMonth(day) === new Date().getMonth()) {
          const a = events.find((item) => {
            if (new Date(item.date).getDate() === new Date(day).getDate()) {
              return item.data;
            } else {
              return null;
            }
          });
          if (a) {
            const powerSum = a.data.reduce((acc, curr) => {
              const totalPower = curr.power1 + curr.power2;
              return acc + totalPower;
            }, 0);
            const hours = a.data.map((obj) => {
              const hour = new Date(obj.created_at).getUTCHours();
              return hour;
            });

            // Calculate the number of unique hours recorded in the array
            const uniqueHours = new Set(hours);
            const recordedHours = uniqueHours.size;
            days.push({
              date: formattedDate,
              data: a.data,
              powerSum: powerSum,
              hours: recordedHours,
              selectedDate: format(selectedDate, "dd/MM/yyyy"),
              actualDate: format(day, "yyyy-MM-dd") // Modified the format to ISO 8601
            });
          } else {
            days.push({
              date: formattedDate,
              data: [],
              powerSum: 0,
              recordedHours: 0,
              selectedDate: format(selectedDate, "dd/MM/yyyy"),
              actualDate: format(day, "yyyy-MM-dd") // Modified the format to ISO 8601
            });
          }
        } else {
          // Push an empty object for days outside the current month
          days.push({
            date: formattedDate,
            data: [],
            powerSum: 0,
            recordedHours: 0,
            selectedDate: format(selectedDate, "dd/MM/yyyy"),
            actualDate: format(day, "yyyy-MM-dd") // Modified the format to ISO 8601
          });
        }
        day = addDays(day, 1);
      }

      rows.push(days);
      days = [];
    }
    setDays(rows);
  }, [currentMonth, events]);

  return (
    <Box>
      {days.map((row, index) => (
        <HStack w="full" key={index}>
          {row.map((day) => (
            <Flex
              flexGrow={0}
              justify={"center"}
              align={"center"}
              style={{
                height: "6rem",
                width: "calc(100%/7)",
                flexBasis: "calc(100%/7)",
                marginLeft: 0,
              }}
              position="relative"
              border={"1px"}
              maxW={"full"}
              key={day.date}
            >
              <PerDayModal day={day} />
            </Flex>
          ))}
        </HStack>
      ))}
    </Box>
  );
}

const Calendar = ({ events = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventData, setEvents] = useState([]);

  useEffect(() => {
    if (events.length === 0) return;
    const groups = events.reduce((groups, game) => {
      const date = game.created_at.split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        data: groups[date],
      };
    });

    setEvents(groupArrays);
  }, [events]);

  return (
    <Box>
      <CalendarHeader
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
      <CalendarDays currentMonth={currentMonth} />
      <CalendarCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        events={eventData}
      />
    </Box>
  );
};

export default Calendar;
