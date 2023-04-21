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
import { Box, HStack, Text, Icon, VStack, Flex } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

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
        let additional = format(day, "yyyy-mm-d");
        const a = events.find((item) => {
          if (
            new Date(item.date).getDate() === new Date(day).getDate()
          ) {
            return item.data;
          } else {
            return null
          }
        });
        console.log(a, day);
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
            hours: recordedHours
          });
        } else {
          days.push({
            date: formattedDate,
            data: [],
            powerSum: 0,
            recordedHours: 0
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
              key={day}
            >
              <Text>{Math.round(day.powerSum / day.data.length * day.hours ) || 0} KWh</Text>
              <Text align="center" position="absolute" bottom={0} right={0}>
                {day.date}
              </Text>
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
