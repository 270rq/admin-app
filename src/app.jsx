import React from "react";
import { ConfigProvider, theme } from 'antd';
import FullMenu from "./components/fullMenu";

function App() {
  return (
    <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
        borderRadius: 5,
      },
    }}
  >
    <div className="App">
      <FullMenu></FullMenu>
    </div>
  </ConfigProvider>

  );
}

export default App;