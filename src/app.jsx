import React from "react";
import { ConfigProvider, theme } from 'antd';
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