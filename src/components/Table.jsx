import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  chakra,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import moment from "moment";
import React, { useEffect } from "react";
import { CSVLink } from "react-csv";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from "react-icons/bi";
import Loading from "./Loading";

export default function DataTable({
  data,
  columns,
  sortCondition,
  setSortCondition,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [input, setInput] = React.useState({});
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    globalFilterFn: (rows, filters) => {
      const { from, to } = filters;
      return rows.filter((row) => {
        const date = moment(row.original.date).format("YYYY-MM-DD HH:mm:ss");
        return date >= from && date <= to;
      });
    },
  });

  const handleInputChange = (e, target) =>
    setInput({ ...input, [target]: e.target.value });

  useEffect(() => {
    setPageCount(table.getPageCount());
    setCurrentPage(table.getState().pagination.pageIndex + 1);
  }, [table]);

  if (data.length === 0) {
    return <Loading />;
  }

  return (
    <HStack justify={"start"} align="start" spacing={5}>
      <Box>
        <FormControl>
          <FormLabel>From</FormLabel>
          <Input
            type="datetime-local"
            onChange={(e) =>
              setSortCondition({
                ...sortCondition,
                from: new Date(e.target.value),
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>To</FormLabel>
          <Input
            type="datetime-local"
            onChange={(e) =>
              setSortCondition({
                ...sortCondition,
                to: new Date(e.target.value),
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Select a device</FormLabel>
          <Select
            placeholder="Select device"
            onChange={(e) =>
              setSortCondition({ ...sortCondition, device: e.target.value })
            }
          >
            <option value="POM01">POM01</option>
            <option value="POM02">POM02</option>
            <option value="POM03">POM03</option>
            <option value="POM04">POM04</option>
            <option value="POM05">POM05</option>
          </Select>
        </FormControl>
        <Box mt={5}>
          <CSVLink data={data} filename={`data.csv`}>
            <Button>Download</Button>
          </CSVLink>
        </Box>
      </Box>
      <Box>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta = header.column.columnDef.meta;
                  return (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <chakra.span pl="4">
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "desc" ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta = cell.column.columnDef.meta;
                  return (
                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <HStack justifyContent={"center"} mt={5}>
          <Button
            disabled={!table.getCanPreviousPage}
            onClick={() => table.setPageIndex(0)}
          >
            <BiChevronsLeft />
          </Button>
          <Button
            disabled={!table.getCanPreviousPage}
            onClick={() => table.previousPage()}
          >
            <BiChevronLeft />
          </Button>
          <Text>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </Text>
          <Button
            disabled={!table.getCanNextPage}
            onClick={() => table.nextPage()}
          >
            <BiChevronRight />
          </Button>
          <Button
            disabled={!table.getCanNextPage}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            <BiChevronsRight />
          </Button>
        </HStack>
      </Box>
    </HStack>
  );
}
