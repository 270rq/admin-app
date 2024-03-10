import {  Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";

const weatherTypes = [
  { id: 1, name: "Солнечно", icon: "☀️" },
  { id: 2, name: "Пасмурно", icon: "☁️" },
  { id: 3, name: "Дождь", icon: "🌧️" },
  { id: 4, name: "Снег", icon: "❄️" },
  { id: 5, name: "Туман", icon: "🌫️" },
  { id: 6, name: "Ветрено", icon: "🌬️" },
  { id: 7, name: "Гроза", icon: "⛈️" }
];

const StatusWeather = ({ getValue, row, column, table }) => {
  const { name, type } = getValue() || {};
  const { updateData } = table.options.meta;
  
  return (
    <Menu isLazy offset={[0, 0]} flip={false} autoSelect={false}>
      <MenuButton
        h="100%"
        w="100%"
        textAlign="left"
        p={1.5}
        bg="transparent"
        color="gray.900"
      >
        {type && weatherTypes.find(weather => weather.id === type).icon}
        {name}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => updateData(row.index, column.id, null)}>
          None
        </MenuItem>
        {weatherTypes.map((weather) => (
          <MenuItem
            onClick={() => updateData(row.index, column.id, weather.id)}
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
