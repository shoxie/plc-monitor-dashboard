import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { createRef, forwardRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { FiMonitor } from "react-icons/fi";
import { BsChevronDown, BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { MdListAlt, MdOutlineBabyChangingStation } from "react-icons/md";
import Link from "next/link";
import { isAndroid } from "@/lib/utils";
import { SiHelpscout } from "react-icons/si";
import logo2 from "../../../public/images/logo-2.png";
import logo3 from "../../../public/images/logo-3.png";
import { useAtom } from "jotai";
import { selectedDeviceAtom, userAtom, weatherDataAtom } from "@/lib/atoms";
import { options } from "@/lib/constants";
import Avatar, { genConfig } from "react-nice-avatar";
import cookies from "js-cookie";
import { MacScrollbar } from "mac-scrollbar";
import { getWeatherData } from "@/lib/api";
import {
  WiCloud,
  WiDaySunny,
  WiFog,
  WiRain,
  WiRainMix,
  WiRainWind,
  WiThunderstorm,
} from "react-icons/wi";

const SidebarItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleClick = (href) => {
    setIsExpanded(!isExpanded);
    router.push(href);
  };
  if (!item) return null;
  return (
    <>
      <HStack
        justify="space-between"
        w="full"
        onClick={() => handleClick(item.href)}
        cursor="pointer"
        backgroundColor={router.pathname === item.href ? "gray.200" : "white"}
        rounded="md"
        px={2}
      >
        <Button href={item.href} key={item.name} variant="unstyled">
          {item.name}
        </Button>
        {item.children && (
          <Box
            maxW="max-content"
            as={motion.div}
            animate={{
              rotate: isExpanded ? 90 : 0,
            }}
          >
            <Icon as={BsChevronDown} />
          </Box>
        )}
      </HStack>
      <VStack
        style={{
          overflow: "hidden",
        }}
        as={motion.div}
        animate={{
          height: isExpanded ? "auto" : 0,
        }}
      >
        {item.children &&
          item.children.map((child) => (
            <Button
              variant="unstyled"
              onClick={child.action}
              pl="4"
              key={child.name}
            >
              {child.name}
            </Button>
          ))}
      </VStack>
    </>
  );
};

const Sidebar = forwardRef((props, ref) => {
  const [selectedDevice, setSelectedDevice] = useAtom(selectedDeviceAtom);
  const router = useRouter();

  const routes = [
    {
      name: "Home",
      href: "/tool/status",
      icon: MdOutlineBabyChangingStation,
    },
    {
      name: "Monitor",
      href: "/tool/overview",
      icon: FiMonitor,
      children: [
        {
          name: "GRID",
          action: () => {
            if (router.pathname !== "/tool/monitor") {
              router.push("/tool/monitor?device=0");
              setSelectedDevice(options[0]);
            }
          },
        },
        {
          name: "GRID + SOLA",
          action: () => {
            if (router.pathname !== "/tool/monitor?device=1") {
              router.push("/tool/monitor");
              setSelectedDevice(options[1]);
            }
          },
        },
        {
          name: "GEN",
          action: () => {
            if (router.pathname !== "/tool/monitor?device=2") {
              router.push("/tool/monitor");
              setSelectedDevice(options[2]);
            }
          },
        },
        {
          name: "LOAD 1",
          action: () => {
            if (router.pathname !== "/tool/monitor?device=3") {
              router.push("/tool/monitor");
              setSelectedDevice(options[3]);
            }
          },
        },
        {
          name: "LOAD 2",
          action: () => {
            if (router.pathname !== "/tool/monitor?device=4") {
              router.push("/tool/monitor");
              setSelectedDevice(options[4]);
            }
          },
        },
      ],
    },
    {
      name: "Statistics",
      href: "/tool/statistics",
      icon: MdListAlt,
    },
    {
      name: "Report",
      href: "/tool/report",
      icon: MdListAlt,
    },
  ];
  return (
    <Box
      p={5}
      ref={ref}
      h={{
        base: "auto",
        md: "100vh",
      }}
      minW={"80"}
      display={{
        base: "none",
        md: "block",
      }}
      transitionProperty="all"
      transitionTimingFunction="ease-in-out"
      transitionDuration={500}
      zIndex={10}
      borderRight={"1px"}
      borderColor="gray.200"
    >
      <Flex
        direction={{
          base: "row",
          md: "column",
        }}
        alignItems={{
          base: "center",
          md: "flex-start",
        }}
        justify="center"
      >
        <Box width={"full"}>
          <Heading
            fontSize={"md"}
            color="white"
            onClick={() => props.setIsExpanded(!props.isExpanded)}
          >
            {props.isExpanded ? "PLC monitoring" : "Hello"}
          </Heading>
        </Box>
        {routes.map((item) => (
          <SidebarItem item={item} key={item.name} />
        ))}
      </Flex>
    </Box>
  );
});

const Header = (props) => {
  const [user] = useAtom(userAtom);
  const [weatherData, setWeatherData] = useAtom(weatherDataAtom);

  useEffect(() => {
    async function run() {
      const data = await getWeatherData();
      console.log("data", data);
      setWeatherData(data);
    }

    run();
  }, []);

  function getWeatherIconByCode(code) {
    const config = {
      size: 36,
      color: "white",
    };

    let icon;

    switch (code) {
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
  }

  function getWeatherTextByCode(code) {
    const config = {
      size: 36,
      color: "black",
    };

    let icon;

    switch (code) {
      case 0:
        icon = "Trời quang";
        break;
      case 1:
      case 2:
      case 3:
        icon = "Trời quang, nhiều mây";
        break;
      case 45:
      case 48:
        icon = "Có sương mù";
        break;
      case 51:
      case 53:
      case 55:
        icon = "Mưa nhỏ";
        break;
      case 56:
      case 57:
        icon = "Nhiều mây, lạnh";
        break;
      case 61:
      case 63:
      case 65:
        icon = "Mưa vừa";
        break;
      case 66:
      case 67:
        icon = "Mưa lớn";
        break;
      case 80:
      case 81:
      case 82:
        icon = "Mưa nặng hạt";
        break;
      case 95:
      case 99:
      case 96:
        icon = "Có bão";
        break;
      default:
        icon = <WiDaySunny {...config} />;
        break;
    }
    const humid = weatherData?.hourly?.relativehumidity_2m?.[0] ?? 0;
    return icon + " Độ ẩm " + humid + "%";
  }

  return (
    <>
      <HStack justify="space-between" py="2">
        <Image src={logo2.src} alt="logo" width={150} height={135} />
        <VStack justify="center">
          <Text fontWeight={700} fontSize={"3xl"}>
            TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP. HỒ CHÍ MINH
          </Text>
          <Text fontWeight={700} fontSize={"3xl"}>
            FACULTY FOR HIGH QUALITY TRAINING
          </Text>
        </VStack>
        <Image src={logo3.src} alt="logo" width={150} height={140} />
      </HStack>

      <HStack px="5" py="2" bg="cyan.400" justify="space-between">
        <HStack>
          <Avatar
            style={{ width: "2.5rem", height: "2.5rem" }}
            {...genConfig(user?.username || "Anonymous")}
          />
          <Text>{user?.name || "Anonymous"}</Text>
        </HStack>
        <HStack>
          <Box>
            {getWeatherIconByCode(
              weatherData?.current_weather?.weatherCode ?? 0
            )}
          </Box>
          <Text color="black">
            {getWeatherTextByCode(
              weatherData?.current_weather?.weatherCode ?? 0
            )}
          </Text>
        </HStack>
      </HStack>
    </>
  );
};

const MobileNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box position="fixed" right="5" bottom="3">
      <VStack spacing={2} position="relative">
        {routes.map((item, idx) => (
          <Box
            key={idx}
            as={motion.div}
            position="absolute"
            animate={{
              bottom: isOpen ? (idx + 1) * 50 : 0,
              opacity: isOpen ? 1 : 0,
              transition: {
                delay: (idx + 1) * 0.3,
              },
            }}
          >
            <Box position={"relative"}>
              <Button
                variant="unstyled"
                rounded={"full"}
                bgColor={"red.200"}
                p={2}
                color="white"
              >
                <Link href={item.href}>
                  <Icon as={item.icon} size={20} />
                </Link>
              </Button>
            </Box>
          </Box>
        ))}
        <Button
          variant="unstyled"
          p={2}
          rounded="full"
          backgroundColor={"cyan.400"}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon as={SiHelpscout} size={20} color="white" />
        </Button>
      </VStack>
    </Box>
  );
};

const Layout = ({ children }) => {
  const ref = useRef();
  const [isExpanded, setIsExpanded] = useState(true);
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    if (ref.current) {
      setTimeout(() => {
        setWidth(ref.current.offsetWidth);
      }, 0);
    }
  }, [isExpanded]);

  function handleWindowSizeChange() {
    setIsMobile(window.innerWidth <= 768);
    setIsExpanded(true);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    const user = cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <MacScrollbar>
      {/* <MobileNavigator /> */}

      <Box w="full" id="content">
        <Header
          isExpanded={isExpanded}
          setIsExpanded={(state) => setIsExpanded(state)}
        />
        <HStack align={"start"}>
          <Sidebar
            ref={ref}
            isExpanded={isExpanded}
            setIsExpanded={(state) => setIsExpanded(state)}
          />
          <Box w="full" px={2} className="hide-scrollbar">
            {children}
          </Box>
        </HStack>
      </Box>
    </MacScrollbar>
  );
};

export default Layout;
