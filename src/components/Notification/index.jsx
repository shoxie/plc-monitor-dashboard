import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNoti } from "@/context/notification"; 

import {
  AiOutlineLoading as LoadingIcon,
  AiOutlineInfoCircle as InfoIcon,
  AiOutlineClose as CloseIcon,
} from "react-icons/ai";
import { BiErrorCircle as ErrorIcon } from "react-icons/bi";
import { BsCheckCircle as CheckIcon } from "react-icons/bs";
import { Box, VStack, HStack, Text, Button } from "@chakra-ui/react";

const NotificationItem = (item) => {
  const [progress, setProgress] = useState(0);
  const getIcon = (type) => {
    switch (type) {
      case "complete":
        return <CheckIcon size={16} className="text-2xl text-green-400" />;
      case "loading":
        return <LoadingIcon size={16} className="text-2xl animate-spin" />;
      case "info":
        return <InfoIcon size={16} className="text-2xl text-yellow-400" />;
      case "error":
        return <ErrorIcon size={16} className="text-2xl text-red-400" />;
    }
  };

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (progress + 1 < 100) {
        setProgress(progress + 2.2);
      }
    }, 100);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    if (progress + 1 >= 100) {
      item.action()
    }
  }, [progress])

  function getColor(type) {
    switch (type) {
      case "success":
        return "green.400";
      case "loading":
        return "blue.400";
      case "info":
        return "yellow.400";
      case "error":
        return "red.400";
    }
  }

  return (
    <>
      <Box
        as={motion.div}
        h="2"
        bgColor={getColor(item.type)}
        animate={{
          width: `${progress}%`,
        }}
      />
      <HStack px="3" py="2" gap="6" bgColor={"white"}>
        <HStack justify="center" align="center">
          {getIcon(item.type)}
        </HStack>
        <VStack alignItems="start">
          <Text>{item.title}</Text>
          <p className="line-clamp-3">{item.content}</p>
        </VStack>
      </HStack>
      {item.action && (
        <Box py="1" textAlign="center" bg={getColor(item.type)}>
          <Button
            fontWeight="bold"
            variant="unstyled"
            textColor="white"
            onClick={() => item.action()}
          >
            {item.actionText}
          </Button>
        </Box>
      )}

      <Box position="absolute" cursor="pointer" top="3" right="3">
        <CloseIcon />
      </Box>
    </>
  );
};

const NotificationContainer = () => {
  const { notis } = useNoti();
  const [shouldExpand, setShouldExpand] = useState(false);
  const [shouldUpdateExpand, setShouldUpdateExpand] = useState(false);

  const handleRemove = (id) => {
    const newArr = [...notis];
    newArr.shift();
    // setNotis(newArr);
  };

  useEffect(() => {
    if (shouldExpand && shouldUpdateExpand) {
      setTimeout(() => {
        setShouldExpand(false);
      }, 3000);
    }
  }, [shouldExpand, shouldUpdateExpand]);

  return (
    <>
      <Box as={motion.div} layout className="flex flex-col space-y-5">
        <AnimatePresence mode="wait">
          {notis.map((item, idx) => (
            <Box
              as={motion.div}
              key={item.id}
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
                marginTop: shouldExpand ? "0px" : "-35px",
                marginBottom: shouldExpand ? "10px" : "0px",
                transition: {
                  duration: 0.25,
                },
              }}
              exit={{
                opacity: 0,
                x: 100,
                transition: {
                  duration: 0.15,
                },
              }}
              onMouseEnter={() => {
                setShouldExpand(true);
                setShouldUpdateExpand(false);
              }}
              onMouseLeave={() => setShouldUpdateExpand(true)}
              onClick={() => handleRemove(item.id)}
              layout
              position="relative"
              w="80"
            >
              <NotificationItem {...item} />
            </Box>
          ))}
        </AnimatePresence>
      </Box>
    </>
  );
};

export default NotificationContainer;