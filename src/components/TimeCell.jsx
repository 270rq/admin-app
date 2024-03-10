import React from 'react';
import dayjs from 'dayjs';
import { ConfigProvider, TimePicker } from 'antd';

const format = 'HH:mm:ss';

const TimeCell = ({ getValue, row, column, table }) =>{
  const value = getValue();
  console.log(value);
return <ConfigProvider theme={{ components: {
  DatePicker: {
    colorBgContainer:"rgba(0, 0, 0, 0)",
    colorBorder: "rgba(0, 0, 0, 0)",
  },
},}}> <TimePicker defaultValue={dayjs(value?value:null, format)} onChange={(date) => updateData(row.index, column.id, date)} format={format} /></ConfigProvider>;}

export default TimeCell;