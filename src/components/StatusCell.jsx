import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { WIND_DIRECTIONS } from "../data";

const ArrowIcon = ({ windDirection, ...props }) => (
  <Box {...props}>
    {windDirection === "С" && "↑"}
    {windDirection === "СВ" && "↗"}
    {windDirection === "В" && "→"}
    {windDirection === "ЮВ" && "↘"}
    {windDirection === "Ю" && "↓"}
    {windDirection === "ЮЗ" && "↙"}
    {windDirection === "З" && "←"}
    {windDirection === "СЗ" && "↖"}
  </Box>
);

const StatusCell = ({ getValue, row, column, table }) => {
  const { name, direction } = getValue() || {};
  const { updateData } = table.options.meta;
  console.log(table.options);
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
        <ArrowIcon windDirection={direction} />
        {name}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => updateData(row.index, column.id, null)}>
          None
        </MenuItem>
        {WIND_DIRECTIONS.map((windDirection) => (
          <MenuItem
            onClick={() => updateData(row.index, column.id, windDirection)}
            key={windDirection.id}
          >
            <ArrowIcon windDirection={windDirection.name} />
            {windDirection.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default StatusCell;
