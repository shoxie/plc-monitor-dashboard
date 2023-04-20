import NotificationContainer from "@/components/Notification";
import { Box } from "@chakra-ui/react";

import cookies from "js-cookie";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { selectedDeviceAtom, userAtom } from "@/lib/atoms";
import { useRouter } from "next/router";

export default function DefaultLayout({ children }) {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter()
  useEffect(() => {
    const user = cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
      router.push("/tool/status");
    }
  }, []);

  return (
    <>
      <Box position="fixed" right="10" top="20" zIndex="100">
        <NotificationContainer />
      </Box>
      {children}
    </>
  );
}
