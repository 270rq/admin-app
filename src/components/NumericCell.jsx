import { Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const NumericCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  // If the initialValue is changed externally, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Handler to only allow numeric input
  const handleNumericChange = (e) => {
    const inputValue = e.target.value;
    // Use regex to replace any non-numeric characters with an empty string
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    setValue(numericValue);
  };

  return (
    <Input
      value={value}
      onChange={handleNumericChange} // Use the numeric input handler
      onBlur={onBlur}
      variant="filled"
      size="sm"
      w="85%"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    />
  );
};

export default NumericCell;