import React, { useState, useEffect } from 'react';
import { HomeOutlined, EnvironmentOutlined,SunOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import MenuTable from './MenuTable';
import axios from "axios";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Погода', '1', <HomeOutlined />),
  getItem('Солнечный цикл', '2', <SunOutlined />),
  getItem('Карта', '3', <EnvironmentOutlined />),
];

const Home = () => {
  const [database, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/region");
        const regionData = response.data.reduce((acc,region) => (
          { ...acc,
            [region.name]: region.city.map((city) => city.name)
          }
        ),{});
        setData(regionData)
        console.log(regionData);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <MenuTable />
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      </Col>
    </Row>
  );
};

export default Home;