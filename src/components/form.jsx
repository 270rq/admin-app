import React, { useState, useEffect } from "react";
import {
  Button,
  Cascader,
  ColorPicker,
  DatePicker,
  Form,
  InputNumber,
} from "antd";
import axios from "axios";

const { RangePicker } = DatePicker;

const FormDisabledDemo = ({ onFormSubmit, onFlowerChange, onDateChange }) => {
  const [flowerOptions, setFlowerOptions] = useState([]);
  const [isPeriodSelected, setIsPeriodSelected] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [particles, setParticles] = useState(0);
  const [colorLevel, setColorLevel] = useState("#ffffff");
  const [formData, setFormData] = useState({});

  const handleCheckboxChange = (e) => {
    setIsPeriodSelected(e.target.checked);
  };

  const handleParticlesChange = (value) => {
    setParticles(value);
    updateColorLevel(value);
  };

  const updateColorLevel = (value) => {
    let color = "#ffffff";

    if (value >= 1 && value <= 10) {
      color = "#00ff00";
    } else if (value >= 11 && value <= 100) {
      color = "#ffff00";
    } else if (value >= 101 && value <= 1000) {
      color = "#ffa500";
    } else if (value >= 1001) {
      color = "#ff0000";
    }

    setColorLevel(color);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/family");
        if (!response.data) {
          throw new Error("Network response for family data was not valid");
        }
        const data = response.data;
        const newFlowerOptions = data.map((family) => ({
          value: family.id,
          label: family.name,
          children: family.flower.map((flower) => ({
            value: flower.id,
            label: flower.name,
          })),
        }));

        setFlowerOptions(newFlowerOptions);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);
  const handleFormChange = (changedValues) => {
    setFormData({
      ...formData,
      ...changedValues,
    });
  };
  return (
    <div>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
        onFinish={onFormSubmit}
        onValuesChange={handleFormChange}
      >
        <Form.Item  label="Аллерген" name="TreeSelect" rules={[{ required: true, message: 'Пожалуйста, выберите аллерген!' }]}>
          <Cascader
            options={flowerOptions}
            placeholder="Выберите аллерген"
            onChange={(value) => onFlowerChange(value)}
            changeOnSelect
          />
        </Form.Item>
        <Form.Item label="Период цветения" name="RangePicker"  rules={[{ required: true, message: 'Пожалуйста, выберите период цветения!' }]}>
            <DatePicker onChange={(value)=>onDateChange(value.format("YYYY-MM-DD"))} /></Form.Item>
          
            <Form.Item
  label="Количество частиц"
  name="particles"
  rules={[{ required: true, message: 'Пожалуйста, выберите количество частиц!' }]}
>
  <InputNumber
    onChange={handleParticlesChange}
    onKeyPress={(e) => {
      if (isNaN(Number(e.key))) {
        e.preventDefault();
      }
    }}
  />
</Form.Item>
        <Form.Item label="Уровень цветения" wrapperCol={{ span: 16 }} rules={[{ required: true, message: 'Пожалуйста, выберите уровень цветения!' }]}>
          <ColorPicker value={colorLevel} disabled />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button type="primary"  htmlType="submit">Сохранить</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormDisabledDemo;
