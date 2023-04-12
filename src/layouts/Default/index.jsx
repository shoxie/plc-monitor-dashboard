import NotificationContainer from "@/components/Notification";
import { Box } from "@chakra-ui/react";

export default function DefaultLayout({ children }) {
  return (
    <>
      <Box position="fixed" right="10" top="20" zIndex="100">
        <NotificationContainer />
      </Box>
      {children}
    </>
  );
}
