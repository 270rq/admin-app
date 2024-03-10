import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Icon, Text } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditableCell from "./EditableCell";
import StatusCell from "./StatusCell";
import Filters from "./Filters";
import SortIcon from "./icons/SortIcon";
import NumericCell from "./NumericCell";
import DateTimeCell from "./DateTimeCell";
import StatusWeather from "./StatusWeather";

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
    cell: DateTimeCell,
  },
  {
    accessorKey: "temperature",
    header: "t",
    size: 100,
    cell: NumericCell
  },
  {
    accessorKey: "humidity",
    header: "Влажность",
    size: 100,
    cell: NumericCell
  },
  {
    accessorKey: "uv_index",
    header: "UV index",
    size: 100,
    cell: NumericCell
  },
  {
    accessorKey: "wind_speed",
    header: "Скорость ветра",
    size: 100,
    cell: NumericCell
  },
  {
    accessorKey: "wind_type",
    header: "Направление ветра",
    size: 100,
    cell: StatusCell
  },
  {
    accessorKey: "pressure",
    header: "Давление",
    size: 110,
    cell: NumericCell
  },
  {
    accessorKey: "weather_type",
    header: "Тип погоды",
    size: 110,
    cell: StatusWeather
  }
];

const TaskTable = ({ database }) => {
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/menu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const fetchedData = await response.json();
        
        const menuData = fetchedData.map((data)=>{
          return{
            city:data.city.name,
            date: new Date(data.date),
            temperature: data.temperature,
            humidity: data.humidity,
            uv_index: data.uv,
            wind_speed: data.windSpeed,
            wind_type: data.windType,
            pressure: data.pressure,
            weather_type: data.weatherType,
          }
        })
        console.log(menuData,fetchedData);
        setData(menuData);
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
    meta:{
      
    },
  });


  const addNewRow = (index) => {
    const newRow = {}; 
    
setData((prevData) =>{ 
  console.log([
    newRow,
    ...prevData,
  ])
  return [
  newRow,
  ...prevData,
]});
console.log(data);
  };
  useEffect(()=>{
setData(data);
  },[data])

  const removeRow = (index) => {
    const rowData = data[index];
    console.log(rowData);
    const textInCell = rowData && rowData.text;
  
    if (rowData.date || rowData.city || rowData.sunset || rowData.sunrise) {
      const confirmation = window.confirm(`Вы уверены, что хотите удалить строку?`);
      
      if (confirmation) {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
      }
    } else {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    }
  };

  return (
    <Box>
      <Filters
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <Button colorScheme="blue" mb={4}> Сохранить</Button>
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
      <Button onClick={() => addNewRow(data.length)}>+</Button>
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
export default TaskTable;