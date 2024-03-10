import React, { useState, useEffect } from 'react';
import { HomeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import TaskTable from './TaskTable';
import TaskTableSun from './TaskTableSun';
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
  getItem('Карта', '2', <EnvironmentOutlined />),
];

const Home = () => {
  const [database, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/database");
        setData(response.database);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <TaskTable database={database} />
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <TaskTableSun database={database} />
      </Col>
    </Row>
  );
};

export default Home;