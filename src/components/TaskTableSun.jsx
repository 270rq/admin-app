import React, { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Icon, Text } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DATA from "../data";
import EditableCell from "./EditableCell";
import DateCell from "./DateCell";
import Filters from "./Filters";
import SortIcon from "./icons/SortIcon";
import TimeCell from "./TimeCell";

const columns = [
  {
    accessorKey: "city",
    header: "Город",
    size: 100,
    cell: EditableCell,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "date",
    header: "Дата",
    cell: DateCell,
  },
  {
    accessorKey: "sunrise",
    header: "Восход",
    size: 100,
    cell: TimeCell
  },
  {
    accessorKey: "sunset",
    header: "Заход",
    size: 100,
    cell: TimeCell
  },
];

const TaskTableSun = ({ database }) => {
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState(DATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/sun', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const fetchedData = await response.json();
        const sunData = fetchedData.map((data)=>{
          const sunset =   new Date(data.sunset).toLocaleTimeString('en-US', {hour12: false});
          const sunrise =  new Date(data.sunrise).toLocaleTimeString('en-US', {hour12: false});
          return{
            city:data.city.name,
            date: new Date(data.date),
            sunset:sunset,
            sunrise:sunrise
          }
        })
        console.log(sunData,fetchedData);
        setData(sunData)
      } catch (error) {
        console.error('Error fetching data from backend:', error.message);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });
  const addNewRow = () => {
    const newRow = {
      city: "",
      date: "",
      sunrise: "",
      sunset: ""
    };
    setData((prevData) => [
      newRow,
      ...prevData,
    ]);
  };

  const saveDataSun = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/api/sun', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "date": "2024-03-09T20:18:13.279Z",
            "cityId": 0,
            "sunset": "2024-03-09T20:18:13.279Z",
            "sunrise": "2024-03-09T20:18:13.279Z"
          }),
      });
      const result = await response.text();
      console.log(result);
  } catch (error) {
      console.error(error);
  }
};


  const removeRow = async (index) => {
    const rowData = data[index];
    console.log(rowData);
    const textInCell = rowData && rowData.text;
  
    if (rowData.date || rowData.city || rowData.sunset || rowData.sunrise) {
      const confirmation = window.confirm(`Вы уверены, что хотите удалить строку?`);
  
      if (confirmation) {
        try {
          const response = await fetch(`http://localhost:3000/api/sun/${index}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: rowData.id }),
          });
          
          if (response.ok) {
            const newData = [...data];
            newData.splice(index, 1);
            setData(newData);
          } else {
            console.error('Ошибка при удалении данных');
          }
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    }
  };

  return (
    <Box overflowX="auto">
      <Button onClick = {saveDataSun} colorScheme="blue" mb={4}> Сохранить</Button>
      <Filters
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <Box className="table" w={table.getTotalSize()}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box className="tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Box className="th" w={header.getSize()} key={header.id}>
                {header.column.columnDef.header}
                {header.column.getCanSort() && (
                  <Icon
                    as={SortIcon}
                    mx={3}
                    fontSize={14}
                    onClick={header.column.getToggleSortingHandler()}
                  />
                )}
                {
                  {
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()]
                }
                <Box
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`resizer ${
                    header.column.getIsResizing() ? "isResizing" : ""
                  }`}
                />
              </Box>
            ))}
          </Box>
        ))}
        {table.getRowModel().rows.map((row, index) => (
          <Box className="tr" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Box className="td" w={cell.column.getSize()} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
            <Button onClick={() => removeRow(index)}>-</Button>
          </Box>
        ))}
      </Box>
      <Button onClick={addNewRow}>+</Button>
      <br />
      <Text mb={2}>
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </Text>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
      </ButtonGroup>
    </Box>
  );
};
export default TaskTableSun;
