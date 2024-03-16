import React, { useState, useEffect } from 'react';
import { Button, Cascader, ColorPicker, DatePicker, Form, Checkbox, InputNumber } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

const FormDisabledDemo = () => {
  const [flowerOptions, setFlowerOptions] = useState([]);
  const [isPeriodSelected, setIsPeriodSelected] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsPeriodSelected(e.target.checked);
  };

  const handleKeyDown = (e) => {
    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
    }
};

  const [particles, setParticles] = useState(0);
const [colorLevel, setColorLevel] = useState("#ffffff");



const handleParticlesChange = (value) => {
  setParticles(value);

  let color = "#ffffff"; // По умолчанию белый цвет

  if (value >= 1 && value <= 10) {
    color = "#00ff00"; // Зеленый цвет для значений от 1 до 10
  } else if (value >= 11 && value <= 100) {
    color = "#ffff00"; // Желтый цвет для значений от 11 до 100
  } else if (value >= 101 && value <= 1000) {
    color = "#ffa500"; // Оранжевый цвет для значений от 101 до 1000
  } else if (value >= 1001) {
    color = "#ff0000"; // Красный цвет для значений от 1001 и выше
  }

  setColorLevel(color);
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/family');
        if (!response.data) {
          throw new Error('Network response for family data was not valid');
        }
        const data = response.data;

        const newFlowerOptions = data.map(family => ({
          value: family.name,
          label: family.name,
          children: family.flower.map(flower => ({
            value: flower.name,
            label: flower.name
          }))
        }));

        setFlowerOptions(newFlowerOptions);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

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
      >
       <Form.Item label="Аллерген">
  <Cascader
    options={flowerOptions}
    placeholder="Выберите аллерген"
    changeOnSelect
  />
</Form.Item>
        <Form.Item label="Период цветения">
          {isPeriodSelected ? <RangePicker disabled={!isPeriodSelected} /> : <DatePicker />}
          <Checkbox checked={isPeriodSelected} onChange={handleCheckboxChange}>
            Разрешить выбор периода
          </Checkbox>
        </Form.Item>
        <Form.Item label="Количество частиц" name="particles">
    <InputNumber onChange={handleParticlesChange} onKeyDown={(event) => handleKeyDown(event)} />
</Form.Item>
<Form.Item label="Уровень цветения" wrapperCol={{ span: 16 }}>
    <ColorPicker value={colorLevel} disabled />
    <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button disabled>Сохранить</Button>
    </div>
</Form.Item>
      </Form>
    </div>
  );
};

export default FormDisabledDemo;