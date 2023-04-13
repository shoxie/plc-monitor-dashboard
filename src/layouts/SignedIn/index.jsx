import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    Text,
    VStack,
  } from "@chakra-ui/react";
  import { motion } from "framer-motion";
  import { createRef, forwardRef, useEffect, useRef, useState } from "react";
  import { useRouter } from "next/router";
  import { FiMonitor } from "react-icons/fi";
  import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
  import { MdListAlt } from "react-icons/md";
  import Link from "next/link";
  import { isAndroid } from "@/lib/utils";
  import { SiHelpscout } from "react-icons/si";
  
  const routes = [
    {
      name: "Home",
      href: "/tool/status",
      icon: FiMonitor,
    },
    {
      name: "Monitor",
      href: "/tool/monitor",
      icon: FiMonitor,
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
  
  const Sidebar = forwardRef((props, ref) => {
    return (
      <Box
        bg="cyan.400"
        p={5}
        ref={ref}
        h={{
          base: "auto",
          md: "100vh",
        }}
        w={{
          base: "full",
          md: "auto",
        }}
        position="fixed"
        top={{
          base: "auto",
          md: 0,
        }}
        bottom={{
          base: 0,
          md: "auto",
        }}
        display={{
          base: "none",
          md: "block",
        }}
        transitionProperty="all"
        transitionTimingFunction="ease-in-out"
        transitionDuration={500}
        zIndex={10}
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
            <Link href={item.href} key={item.name}>
              <HStack
                key={item.name}
                p={2}
                rounded={"md"}
                color={"white"}
                _hover={{
                  backgroundColor: "gray.200",
                }}
              >
                <Icon as={item.icon} size={10} />
                <Text
                  as={motion.span}
                  animate={{
                    width: props.isExpanded ? "auto" : 0,
                    display: props.isExpanded ? "block" : "none",
                    opacity: props.isExpanded ? 1 : 0,
                  }}
                  overflow={"auto"}
                >
                  {item.name}
                </Text>
              </HStack>
            </Link>
          ))}
        </Flex>
      </Box>
    );
  });
  
  const Header = (props) => {
    return (
      <HStack bg="cyan.400">
        <Button
          variant={"unstyled"}
          onClick={() => props.setIsExpanded(!props.isExpanded)}
        >
          <Icon as={BsLayoutSidebarInsetReverse} />
        </Button>
      </HStack>
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [width, setWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
  
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
  
    return (
      <>
        <Sidebar
          ref={ref}
          isExpanded={isExpanded}
          setIsExpanded={(state) => setIsExpanded(state)}
        />
  
        <MobileNavigator />
  
        <Box
          style={{
            marginLeft: isMobile ? 0 : `${width}px`,
            width: isMobile ? "auto" : `calc(100vw - ${width}px)`,
          }}
          w="full"
          id="content"
        >
          <Header
            isExpanded={isExpanded}
            setIsExpanded={(state) => setIsExpanded(state)}
          />
          <Box w="full" px={2} className="hide-scrollbar">
            {children}
          </Box>
        </Box>
      </>
    );
  };
  
  export default Layout;
  