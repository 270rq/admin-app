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

const FormDisabledDemo = ({ onFormSubmit }) => {
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

  const handleSave = () => {
    const data = {
      x: 56,
      y: 56,
      day: dayjs(selectedPeriod),
      lvl:3,
      flower: 2,
      creater: 4
    };

    // Отправка данных на сервер
    axios
    .post("http://localhost:3000/api/map", data)
    .then((response) => {
      console.log("Data saved successfully:", response.data);
      onFormSubmit(true); // Обновление состояния в родительском компоненте
    })
    .catch((error) => {
      console.error("Error saving data:", error);
    });
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
        onValuesChange={handleFormChange}
      >
        <Form.Item label="Аллерген">
          <Cascader
            options={flowerOptions}
            placeholder="Выберите аллерген"
            onChange={(value) => setSelectedAllergen(value)}
            changeOnSelect
          />
        </Form.Item>
        <Form.Item label="Период цветения">
          {isPeriodSelected ? (
            <RangePicker
              onChange={(value) => setSelectedPeriod(value)}
              disabled={!isPeriodSelected}
            />
          ) : (
            <DatePicker />
          )}
          <Checkbox checked={isPeriodSelected} onChange={handleCheckboxChange}>
            Разрешить выбор периода
          </Checkbox>
        </Form.Item>
        <Form.Item label="Количество частиц" name="particles">
          <InputNumber onChange={handleParticlesChange} />
        </Form.Item>
        <Form.Item label="Уровень цветения" wrapperCol={{ span: 16 }}>
          <ColorPicker value={colorLevel} disabled />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormDisabledDemo;
