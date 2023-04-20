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
  parseISO
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
      <Icon as={HiChevronLeft} onClick={prevMonth} boxSize={"12"} cursor="pointer" />
      <Text fontWeight="600" fontSize="xl">{format(currentMonth, dateFormat)}</Text>
      <Icon as={HiChevronRight} onClick={nextMonth} boxSize={"12"} cursor="pointer" />
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
          <Text align="center" fontWeight="600">{content}</Text>
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

  useEffect(() => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        days.push(formattedDate);
        day = addDays(day, 1);
      }
      rows.push(days);
      days = [];
    }
    setDays(rows);
  }, [currentMonth]);

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
                marginLeft: 0
              }}
              position="relative"
              border={'1px'}
              maxW={"full"}
              key={day}
            >
              <Text align="center" position="absolute" bottom={0} right={0}>{day}</Text>
            </Flex>
          ))}
        </HStack>
      ))}
    </Box>
  );
}

export const Calendar = ({ events = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventData, setEvents] = useState([])

  useEffect(() => {
    if (events.length === 0) return
    const result = []
    let date = events === [] ? 0 : parseISO(events[0]?.created_at).getDate()

    let temp = []
    const groups = events.reduce((groups, game) => {
      const date = game.created_at.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});
    
    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        data: groups[date]
      };
    });

    setEvents(groupArrays)
  }, [events])

  return (
    <Box>
      <CalendarHeader
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
      <CalendarDays currentMonth={currentMonth} />
      <CalendarCells currentMonth={currentMonth} selectedDate={selectedDate} events={eventData} />
    </Box>
  );
};

class CustomCalendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = (day) => {
    this.setState({
      selectedDate: day,
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1),
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: subMonths(this.state.currentMonth, 1),
    });
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

export default CustomCalendar;
