import axios from "axios";
import { reader } from "./api";

export const transform = (obj, predicate) => {
  return Object.keys(obj).reduce((memo, key) => {
    if (predicate(obj[key], key)) {
      memo[key] = obj[key]
    }
    return memo
  }, {})
}

export const omit = (obj, items) => transform(obj, (value, key) => !items.includes(key))

export const isAndroid = (navigator) => {
  return /Android/i.test(navigator.userAgent) ? "127.0.0.1" : "localhost";
};

export const getServerConfig = async () => {
  return await axios.get("/api/getServerConfig").then(res => res.data)
}

export const getStatuses = async () => {
  const serverConfig = await getServerConfig()
  // const isOnline = await axios.get(serverConfig.url).then(res => {
  //   return true
  // }).catch(err => {
  //   return false
  // })

  // if (isOnline) {
    const readerData = await reader(
      serverConfig.url,
      {
        power1: "DB23,R2172",
        power2: "DB23,R2688",
      },
      false,
      false,
      function (readerData) {
        console.log(readerData);
      }
    );
  // }

  return {
    isOnline: readerData.values ? true : false,
    onlineDevices: Math.round(readerData.values.power1 + readerData.values.power2) > 0 ? 5 : 0,
    power: Math.round(readerData.values.power1 + readerData.values.power2),
  }
}