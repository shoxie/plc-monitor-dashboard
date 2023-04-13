import DataTable from "@/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Box, Text } from "@chakra-ui/react";
import { getData } from '@/lib/api';
import { Capacitor } from "@capacitor/core";
import Layout from "@/layouts/SignedIn";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("device", {
    cell: (info) => info.getValue(),
    header: "Device name",
    meta: {
      isNumeric: false,
    },
  }),
  columnHelper.accessor("voltage", {
    cell: (info) => info.getValue(),
    header: "Voltage", meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("ampere", {
    cell: (info) => info.getValue(),
    header: "Ampere", meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("freq", {
    cell: (info) => info.getValue(),
    header: "Frequency",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("power", {
    cell: (info) => info.getValue(),
    header: "Power",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("time", {
    cell: (info) => info.getValue(),
    header: "Record date",
    meta: {
      isNumeric: false,
    },
  }),
];


const Statistics = ({ url }) => {
  const [data, setData] = useState([])
  const [dataStatus, setDataStatus] = useState("loading")
  const [sortCondition, setSortCondition] = useState({
    device: "POM01",
    from: undefined,
    to: undefined
  })

  const isMobile = Capacitor.getPlatform() !== "web";

  useEffect(() => {
    console.log('sortCondition', sortCondition)
    async function run() {
      await getData(url, {
        where: {
          device: sortCondition.device,
          time: {
            gte: sortCondition.from ? sortCondition.from : undefined,
            lte: sortCondition.to ? sortCondition.to : undefined
          }
        },
        orderBy: {
          time: "desc",
        },
      }, isMobile, function (data) {
        if (data.length === 0) {
          setDataStatus("loaded")
          return
        }
        setData(data.map(item => {
          return {
            ...item,
            time: moment(item.time).format("DD-MM-YYYY HH:mm:ss")
          }
        }))
      })
    }
    run()
  }, [sortCondition])

  if (dataStatus === "loaded" && data.length === 0) {
    return (
      <Box>
        <Text>No data found</Text>
      </Box>
    )
  }

  return (
    <Box>
      <DataTable data={data} columns={columns} setSortCondition={setSortCondition} sortCondition={sortCondition} />
    </Box>
  )
}

Statistics.Layout = Layout;
export default Statistics