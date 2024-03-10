import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import TaskTable from "./components/TaskTable";
import TaskTableSun from "./components/TaskTableSun";
import { ConfigProvider, theme } from 'antd';
import MenuNavigation from "./components/home";
import DemoAreaMap from "./components/map";
import FullMenu from "./components/fullMenu";

function App() {
  return (
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <FullMenu></FullMenu>
      </ConfigProvider>

  );
}

export default App;