import React, { useState, useEffect } from "react";
import {
  Button,
  Cascader,
  ColorPicker,
  DatePicker,
  Form,
  Checkbox,
  InputNumber,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const FormDisabledDemo = ({ onFormSubmit, onFlowerChange }) => {
  const [flowerOptions, setFlowerOptions] = useState([]);
  const [isPeriodSelected, setIsPeriodSelected] = useState(false);
  const [selectedAllergen, setSelectedAllergen] = useState(null);
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

  const handleSave = (data) => {
    onFormSubmit(data);
   
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
          value: family.name,
          label: family.name,
          children: family.flower.map((flower) => ({
            value: flower.name,
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
        onFinish={handleSave}
        onValuesChange={handleFormChange}
      >
        <Form.Item  label="Аллерген" name="TreeSelect" rules={[{ required: true, message: 'Пожалуйста, выберите аллерген!' }]}>
          <Cascader
            options={flowerOptions}
            placeholder="Выберите аллерген"
            onChange={(value) => setSelectedAllergen(value)}
            changeOnSelect
          />
        </Form.Item>
        {isPeriodSelected ? ( <Form.Item label="Период цветения" name="RangePicker"  rules={[{ required: true, message: 'Пожалуйста, выберите период цветения!' }]}>
         
            <RangePicker
              onChange={(value) => setSelectedPeriod(value)}
              disabled={!isPeriodSelected}
            /> </Form.Item>
          ) : (<Form.Item label="Период цветения" name="RangePicker"  rules={[{ required: true, message: 'Пожалуйста, выберите период цветения!' }]}>
            <DatePicker /></Form.Item>
          )}
          <Checkbox checked={isPeriodSelected} onChange={handleCheckboxChange}>
            Разрешить выбор периода
          </Checkbox>
        
        <Form.Item label="Количество частиц" name="particles" rules={[{ required: true, message: 'Пожалуйста, выберите количество частиц!' }]}>
          <InputNumber onChange={handleParticlesChange} />
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