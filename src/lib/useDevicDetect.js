import React from "react";
import { Capacitor } from '@capacitor/core';

export default function useDeviceDetect() {
  const [isMobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    // const userAgent =
    //   typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    // const mobile = Boolean(
    //   userAgent.match(
    //     /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    //   )
    // );
    // setMobile(mobile);
    setMobile(Capacitor.getPlatform() !== 'web')
  }, []);

  return { isMobile };
}
