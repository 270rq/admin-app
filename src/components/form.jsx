import React, { useState, useEffect } from 'react';
import { Button, Cascader, ColorPicker, DatePicker, Form,Checkbox, InputNumber } from 'antd';

const { RangePicker } = DatePicker;

const FormDisabledDemo = () => {
  const [flowerOptions, setFlowerOptions] = useState([]);

  const [isPeriodSelected, setIsPeriodSelected] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsPeriodSelected(e.target.checked);
  };
  const handleKeyDown = (e) => {
    if (!(e.key >= '0' && e.key <= '9')) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mapResponse = await fetch('http://localhost:3000/api/map');
        if (!mapResponse.ok) {
          throw new Error('Network response for map data was not ok');
        }
        const mapData = await mapResponse.json();

        const response = await fetch('http://localhost:3000/api/family');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedData = data.map(family => ({
          value: family.name,
          label: family.name,
          children: family.flower.map((flower)=>({  value: flower.name,
            label: flower.name,}))
        }));
        setFlowerOptions(formattedData);
      } catch (error) {
        console.error('Error fetching flower data:', error.message);
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
            options=
              {flowerOptions}
          />
        </Form.Item>
        <Form.Item label="Период цветения">

     {isPeriodSelected? <RangePicker disabled={!isPeriodSelected} />: <DatePicker/>}
      <Checkbox checked={isPeriodSelected} onChange={handleCheckboxChange}>
        Разрешить выбор периода
      </Checkbox>
    </Form.Item>
   

  return (
    <Form>
    <Form.Item label="Количество частиц" name="particles" rules={[{ type: 'number', message: 'Пожалуйста, введите число' }]}>
        <InputNumber onKeyDown={handleKeyDown} />
      </Form.Item>
    </Form>
  );
        <Form.Item label="Уровень цветения" wrapperCol={{ span: 16 }}> 
          <ColorPicker />
          <div style={{ textAlign: 'center', marginTop: 16 }}> 
            <Button>Сохранить</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  ); 
};

export default FormDisabledDemo;