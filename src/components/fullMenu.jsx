import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, EnvironmentOutlined, SunOutlined } from '@ant-design/icons';
import DemoAreaMap from "./map";
import Home from "./home";
import Login from "./Login";
import SunTable from './SunTable';

const { Header, Sider, Content } = Layout;

const FullMenu = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(token ? 'home' : 'login');

  const {
    colorBgContainer,
    borderRadiusLG,
  } = theme.useToken();

  const items = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Погода',
    }, {
      key: 'sun',
      icon: <SunOutlined />,
      label: 'Солнечный цикл',
    },
    {
      key: 'map',
      icon: <EnvironmentOutlined />,
      label: 'Карта',
    }
  ];

  useEffect(() => {
    if (!token) {
      setSelectedMenuItem('login');
    } else {
      setSelectedMenuItem('home'); 
    }
  }, [token]);

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
  };

  const handleLogout = () => {
    setToken('');
    setSelectedMenuItem('login');
    localStorage.removeItem('token');
  };

  const handleLoginSuccess = (token) => {
    setToken(token);
  };

  let contentComponent;
  switch (selectedMenuItem) {
    case 'home':
      contentComponent = <Home />;
      break;
    case 'sun':
      contentComponent = <SunTable />;
      break;
    case 'map':
      contentComponent = <DemoAreaMap />;
      break;
    case 'login':
      contentComponent = <Login setToken={handleLoginSuccess} setSelectedMenuItem={setSelectedMenuItem} showButtons={()=>{setToken(localStorage.getItem('token'))}} />
      break;
    default:
      contentComponent = <Home />;
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
  {token && (
    <Sider trigger={null} collapsible collapsed={collapsed} style={{ overflow: 'auto' }}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline" selectedKeys={[selectedMenuItem]}>
        {items.map((item) => (
          <Menu.Item key={item.key} icon={item.icon} onClick={() => handleMenuItemClick(item.key)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  )}
  <Layout>
    <Header style={{ padding: 0, background: colorBgContainer }}>
      {token && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleMenu}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
      )}
      {token && (
        <Button type="text" onClick={handleLogout}>
          Выйти
        </Button>
      )}
    </Header>
    <Content
      style={{
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        display: 'flex',
      }}
    >
      {contentComponent}
    </Content>
  </Layout>
</Layout>
  );
};

export default FullMenu;