import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Space,
  Button,
  DatePicker,
  Select,
  message,
} from "antd";
import {
  EditTwoTone,
  SearchOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const windDirectionOptions = [
  { value: "Север", emoji: "⬆️" },
  { value: "Северо-запад", emoji: "↖️" },
  { value: "Запад", emoji: "⬅️" },
  { value: "Юго-запад", emoji: "↙️" },
  { value: "Юг", emoji: "⬇️" },
  { value: "Юго-восток", emoji: "↘️" },
  { value: "Восток", emoji: "➡️" },
  { value: "Северо-восток", emoji: "↗️" },
];
const weatherDirectionOptions = [
  { value: "Солнечно", emoji: "☀️" },
  { value: "Облачно", emoji: "☁️" },
  { value: "Дождь", emoji: "🌧️" },
  { value: "Снег", emoji: "❄️" },
  { value: "Туман", emoji: "🌫️" },
  { value: "Гроза", emoji: "⛈️" },
];
let regionsWithCitys = [];
let citys = [];
let regions = [];

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
  const [citysCell, setCitys] = useState([]);
  const [regionsCell, setRegions] = useState([]);
  const handleKeyDown = (e) => {
    if (
      !(
        (e.key >= "0" && e.key <= "9") ||
        e.key === "Backspace" ||
        e.key === "Delete"
      )
    ) {
      e.preventDefault();
    }
  };
  const handleSearchCity = (value) => {
    setCitys(
      citys.filter((city) => city.toLowerCase().includes(value.toLowerCase()))
    );
  };
  const handleSearchReg = (value) => {
    setRegions(
     regions.filter((region) =>
        region.toLowerCase().includes(value.toLowerCase())
     )
    );
  };
  
   
  
  const onChangeReg = (value) => {
   
    citys = regionsWithCitys
      .filter((region) => region.name === value)
      .flatMap((reg) =>
        reg.city.map((city) =>city.name  )
      );
      setCitys(
        citys);
       };
  const inputNode =
    inputType === "number" ? (
      <InputNumber onKeyDown={handleKeyDown} />
    ) : inputType === "city" ? (
      <Select
        showSearch
        placeholder={"Выбери город"}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        onSearch={handleSearchCity}
        notFoundContent={null}
        options={(citysCell || []).map((d) => ({
          value: d,
          label: d,
        }))}
      />
    ) : inputType === "region" ? (
      <Select
        showSearch
        placeholder={"Выбери регион"}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        onSearch={handleSearchReg}
        onChange={onChangeReg}
        notFoundContent={null}
        options={(regionsCell || []).map((d) => ({
          value: d,
          label: d,
        }))}
      />
    ) : inputType === "positiveNumber" ? (
      <InputNumber onKeyDown={handleKeyDown} min={0} />
    ) : inputType === "date" ? (
      <DatePicker showTime format={"DD MM YYYY HH"} />
    ) : inputType === "createdAt" ? (
      <DatePicker showTime format={"DD MM YYYY HH:mm:ss"} />
    ) : inputType === "windType" ? (
      <Select>
        {windDirectionOptions.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.emoji} {option.value}
          </Select.Option>
        ))}
      </Select>
    ) : inputType === "weatherType" ? (
      <Select>
        {weatherDirectionOptions.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.emoji} {option.value}
          </Select.Option>
        ))}
      </Select>
    ) : (
      <Input />
    );

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
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
      }

const MenuTable = () => {
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/menu/getAll"
        );
        if (response.data) {
          setTableData(
            response.data.map((item) => ({
              ...item,
              city: item.city.name,
              region: item.city.region.name,
              date: dayjs(item.date),
            }))
          );
        }
        const responseRegions = await axios.get(
          "http://localhost:3000/api/region"
        );
        if (responseRegions.data) {
          regionsWithCitys = responseRegions.data;
          citys = regionsWithCitys.flatMap((reg) =>
            reg.city.map((city) => city.name)
          );
          regions = regionsWithCitys.map((reg) => reg.name);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const isEditing = (record) => {
    return record && record.id === editingKey;
  };

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const updateData = async (record) => {
    try {
      const id = localStorage.getItem("id");

      const response = await axios.put(
        `http://localhost:3000/api/menu/${record.id}`,
        { ...record, createrUserId: id }
      );

      if (response.status === 200) {
        console.log("Data updated successfully:", response.data);
        message.success("Записи изменены успешно!");
      } else {
        throw new Error("Ошибка при обновлении данных");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      message.error(
        "Не удалось изменить запись, возможно у вас недостаточно прав"
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      const id = localStorage.getItem("id");

      const response = await axios.delete(
        `http://localhost:3000/api/menu/${record.id}`,
        {
          data: { createrUserId: id },
        }
      );
      console.log("Data deleted successfully:", response.data);
      message.success("Запись успешно удалена!");
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Ошибка при удалении записи");
    }
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTableData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Валидация провалена:", errInfo);
    }
  };

  const handleAdd = () => {
    const newData = [{ key: "new", id: "new" }, ...tableData];
    setTableData(newData);
    setEditingKey("new");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1677ff" : undefined,
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
  });
  const columns = [
    {
      title: "Время создания",
      dataIndex: "createdAt",
      width: "100%",
      editable: false,
      sorter: (a, b) => a.age - b.age,
      createdAt: new Date().toLocaleString(),
    },
    {
      title: "Регион",
      dataIndex: "region",
      width: "25%",
      editable: true,
      filters: [{}],
      filterSearch: true,
      ...getColumnSearchProps("region"),
    },
    {
      title: "Город",
      dataIndex: "city",
      width: "25%",
      editable: true,
      filters: [{}],
      filterSearch: true,
      ...getColumnSearchProps("city"),
    },
    {
      title: "Дата",
      dataIndex: "date",
      width: "100%",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "t",
      dataIndex: "temperature",
      width: "15%",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Влажность",
      dataIndex: "humidity",
      width: "10%",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "UV",
      dataIndex: "uv",
      width: "10%",
      editable: true,
      render: (text, record) => {
        return <div>{record.uv}</div>;
      },
    },
    {
      title: "Скорость ветра",
      dataIndex: "windSpeed",
      width: "10%",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Направление ветра",
      dataIndex: "windType",
      width: "10%",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Давление",
      dataIndex: "pressure",
      width: "10%",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Тип погоды",
      dataIndex: "weatherType",
      width: "40%",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Операции",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              <CheckCircleTwoTone />
            </Typography.Link>
            <Popconfirm title="Хотите отменить?" onConfirm={cancel}>
              <a>
                <CloseCircleTwoTone />
              </a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <EditTwoTone />
            </Typography.Link>
            <Popconfirm
              title="Хотите удалить?"
              onConfirm={() => handleDelete(record)}
            >
              <DeleteTwoTone />
            </Popconfirm>
          </>
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
          if (col.dataIndex === "date") {
            return "date";
          }else if (col.dataIndex === 'createdAt'){
            return 'createdAt';
          } else if (col.dataIndex === "city") {
            return "city";
          } else if (col.dataIndex === "region") {
            return "region";
          } else if (col.dataIndex === "temperature") {
            return "number";
          } else if (col.dataIndex === "windType") {
            return "windType";
          } else if (col.dataIndex === "weatherType") {
            return "weatherType";
          } else {
            return "positiveNumber";
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
      >
        +
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={tableData}
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

