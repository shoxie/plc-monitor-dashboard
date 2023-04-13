import axios from "axios";

export const isAndroid = (navigator) => {
  return /Android/i.test(navigator.userAgent) ? "127.0.0.1" : "localhost";
};

export const getStatuses = async () => {
  const serverConfig = await axios.get("/api/getServerConfig").then(res => res.data)
  const isOnline = await axios.get(serverConfig.url).then(res => {
    return true
  }).catch(err => {
    return false
  })

  if (isOnline) {
    const readerData = await reader(
      serverConfig.url,
      {
        power1: "DB23,R2172",
        power2: "DB23,R2688",
      },
      false,
      function (readerData) {
        console.log(readerData);
      }
    );
  }

  return {
    isOnline,
    onlineDevices: 0,
    power: 0,
  }
}