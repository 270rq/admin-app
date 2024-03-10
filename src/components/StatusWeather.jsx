import {  Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";


const weatherTypes = [
  { id: 1, name: "Sunny", icon: "☀️" },
  { id: 2, name: "Cloudy", icon: "☁️" },
  { id: 3, name: "Rainy", icon: "🌧️" },
  { id: 4, name: "Snowy", icon: "❄️" },
  { id: 5, name: "Foggy", icon: "🌫️" },
  { id: 6, name: "Windy", icon: "🌬️" },
  { id: 7, name: "Stormy", icon: "⛈️" }
];

const StatusWeather = ({ getValue, row, column, table }) => {
  const value = getValue() || {};
  console.log(value)
  const { updateData } = table.options.meta;
  
  return (
    <Menu isLazy offset={[0, 0]} flip={false} autoSelect={false}>
      <MenuButton
        h="100%"
        w="100%"
        textAlign="left"
        p={1.5}
        bg="transparent"
        color="gray.300"
      >
        {value && weatherTypes.find(weather => weather.name === value).icon + " "+ value}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => updateData(row.index, column.id, null)}>
          None
        </MenuItem>
        {weatherTypes.map((weather) => (
          <MenuItem
            onClick={() => updateData(row.index, column.id, weather.name)}
            key={weather.id}
          >
            {weather.icon}
            {weather.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
export default StatusWeather;
