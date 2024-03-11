import React, { useState, useRef } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Space,Button, DatePicker, Select} from 'antd';
import { EditTwoTone,SearchOutlined, CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
const originData = [];
const windDirectionOptions = ['Север', 'Северо-запад', 'Запад', 'Юго-запад', 'Юг', 'Юго-восток', 'Восток', 'Северо-восток'];
const weatherDirectionOptions = ['Север', 'Северо-запад', 'Запад', 'Юго-запад', 'Юг', 'Юго-восток', 'Восток', 'Северо-восток'];


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
    const handleKeyDown = (e) => {
        if (!(e.key >= '0' && e.key <= '9')) {
          e.preventDefault();
        }
      };

  const inputNode = inputType === 'number' ? <InputNumber  onKeyDown={handleKeyDown} /> 
  :inputType ==="date" ? <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
  :inputType ==="windType" ? (
    <Select>
      {windDirectionOptions.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  ) :inputType==="weatherType"?  (
    <Select>
      {weatherDirectionOptions.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  ) : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Введите ${title}!`,
            },
            {
                type: 'number',
                message: `${title} должен быть числом`,
              },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const MenuTable = () => {
    const searchInput = useRef(null);
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/menu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const fetchedData = await response.json();
        
        const menuData = fetchedData.map((data)=>{
          return{
            city:data.city.name,
            date: new Date(data.date),
            temperature: data.temperature,
            humidity: data.humidity,
            uv_index: data.uv,
            wind_speed: data.windSpeed,
            wind_type: data.windType,
            pressure: data.pressure,
            weather_type: data.weatherType,
          }
        })
        console.log(menuData,fetchedData);
        setData(menuData);
      } catch (error) {
        console.error('Error fetching data from backend:', error.message);
      }
    };

    fetchData();
  }, []);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Валидация провалена:', errInfo);
    }
  };

  const handleAdd = () => {
    const newData = [...data];
    newData.unshift({});
    setData(newData);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Поиск города`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Поиск
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Сброс
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: 'Город',
      dataIndex: 'city',
      width: '25%',
      editable: true,
      filters: [{}],
      filterSearch: true,
      ...getColumnSearchProps('city')
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      width: '15%',
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 't',
      dataIndex: 'temperature',
      width: '40%',
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Влажность',
      dataIndex: 'humidity',
      width: '40%',
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    { title: 'UV',
    dataIndex: 'uv',
    width: '40%',
    editable: true,
    render: (text, record) => {
      console.log(record.uv);
      return <div>{record.uv}</div>;
    }},
    {
      title: 'Скорость ветра',
      dataIndex: 'wind_speed',
      width: '40%',
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Направление ветра',
      dataIndex: 'wind_type',
      width: '40%',
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Давление',
      dataIndex: 'pressure',
      width: '40%',
        editable: true,
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Тип погоды',
        dataIndex: 'weather_type',
        width: '40%',
        editable: true,
        sorter: (a, b) => a.age - b.age,
      },
    {
      title: 'Операции',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            ><CheckCircleTwoTone /></Typography.Link> 
            <Popconfirm title="Хотите отменить?" onConfirm={cancel}><a><CloseCircleTwoTone /></a></Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}><EditTwoTone /></Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: (() => {
          if (col.dataIndex === 'date') {
            return 'date';
          } else if (col.dataIndex === 'city') {
            return 'text';
          } else if (col.dataIndex === 'temperature' || col.dataIndex === 'humidity' || col.dataIndex === 'pressure' || col.dataIndex === "uv" || col.dataIndex === "wind_speed") {
            return 'number';
          } else if (col.dataIndex === 'wind_type') {
            return 'windType';
        } else if (col.dataIndex === 'weather_type') {
            return 'weatherType';
          } else {
            return 'text';
          }
        })(),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
        <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >+</Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default MenuTable;
