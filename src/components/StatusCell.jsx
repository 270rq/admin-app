import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { WIND_DIRECTIONS } from "../data";

const ArrowIcon = ({ windDirection, ...props }) => (
  <Box {...props}>
    {windDirection === "N" && "↑N"}
{windDirection ===     "NE" && "↗NE"}
{windDirection ===     "E" && "→E"}
{windDirection ===     "SE" && "↘SE"}
{windDirection ===     "S" && "↓ЮГ"}
{windDirection ===     "SW" && "↙SW"}
{windDirection ===     "W" && "←W"}
{windDirection ===     "NW" && "↖NW"}
  </Box>
);

const StatusCell = ({ getValue, row, column, table }) => {
  const value = getValue() || {};
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
        <ArrowIcon windDirection={value} />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => updateData(row.index, column.id, null)}>
          None
        </MenuItem>
        {WIND_DIRECTIONS.map((windDirection) => (
          <MenuItem
            onClick={() => updateData(row.index, column.id, windDirection.name)}
            key={windDirection.id}
          >
            <ArrowIcon windDirection={windDirection.name} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default StatusCell;
