import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, message } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, EnvironmentOutlined, LoginOutlined } from '@ant-design/icons';
import DemoAreaMap from "./map";
import Home from "./home";
import Login from "./Login";

const { Header, Sider, Content } = Layout;

const FullMenu = () => {
  const [token, setToken] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('login'); // Изменено начальное значение
  const [visibleButtons, setVisibleButtons] = useState(false)
  const {
    colorBgContainer,
    borderRadiusLG,
  } = theme.useToken();

  const items = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Погода',
    },
    {
      key: 'map',
      icon: <EnvironmentOutlined />,
      label: 'Карта',
    },
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: 'Вход',
    }
  ];

  useEffect(() => {
    const tokenFromData = localStorage.getItem('token') || '';
    setToken(tokenFromData);
  })  

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
  };

  const showButtons = ()=>{
    setVisibleButtons(true);
  }
  let contentComponent;
  switch (selectedMenuItem) {
    case 'home':
      contentComponent = <Home />;
      break;
    case 'map':
      contentComponent = <DemoAreaMap />;
      break;
    case 'login':
      contentComponent = <Login showButtons={showButtons}/>;
      break;
    default:
      contentComponent = <Home />;
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ width: '100%', maxWidth: '100%', height: '100vh', overflow: 'auto' }}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" selectedKeys={[selectedMenuItem]}>
          {items.map((item) => (
            <Menu.Item key={item.key} className={item.key !== "login" && !visibleButtons && !token ? "Disable": ""} icon={item.icon} onClick={() => handleMenuItemClick(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleMenu}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {contentComponent}
        </Content>
      </Layout>
    </Layout>
  );
};

export default FullMenu;