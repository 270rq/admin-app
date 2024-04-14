import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, EnvironmentOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import DemoAreaMap from "./map";
import Home from "./home";
import Login from "./Login";

const { Header, Sider, Content } = Layout;

const FullMenu = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(token ? 'home' : 'login');
  const [visibleButtons, setVisibleButtons] = useState(!!token);

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
    }
  ];

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
  };

  const handleLogout = () => {
    setToken('');
    setSelectedMenuItem('login');
    setVisibleButtons(false);
    localStorage.removeItem('token');
  };

  const showButtons = () => {
    setVisibleButtons(true);
  };

  let contentComponent;
  switch (selectedMenuItem) {
    case 'home':
      contentComponent = <Home />;
      break;
    case 'map':
      contentComponent = <DemoAreaMap />;
      break;
    case 'login':
      contentComponent = <Login showButtons={showButtons} />;
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
            <Menu.Item key={item.key} className={item.key !== 'login' && !visibleButtons ? 'Disable' : ''} icon={item.icon} onClick={() => handleMenuItemClick(item.key)}>
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
          {token && (
            <Button type="text" onClick={handleLogout}>
              Выйти
            </Button>
          )}
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