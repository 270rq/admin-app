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
      citys.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const handleSearchReg = (value) => {
    setRegions(
      regions.filter((region) =>
        region.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const onChangeReg = (value) => {
    console.log(citys);
    console.log(value);
    citys = regionsWithCitys
      .filter((region) => region.id === value)
      .flatMap((reg) =>
        reg.city.map((city) => ({ name: city.name, id: city.id }))
      );
    console.log(citys);
    setCitys(citys);
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
          value: d.id,
          label: d.name,
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
      >
        {regionsCell.map((option) => {
          return (
            <Select.Option key={option.name} value={option.id}>
              {option.name}
            </Select.Option>
          );
        })}
      </Select>
    ) : inputType === "positiveNumber" ? (
      <InputNumber onKeyDown={handleKeyDown} min={0} />
    ) : inputType === "date" ? (
      <DatePicker format={"DD MM YYYY"} />
    ) : inputType === "createdAt" ? (
      <DatePicker showTime format={"DD MM YYYY HH:mm :ss"} />
    ) : inputType === "sunrise" || "sunset" ? (
      <DatePicker showTime format={"HH:mm :ss"} />
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
};

const SunTable = () => {
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/sun");
      console.log(response.data);
      if (response.data) {
        setTableData(
          response.data.map((item) => ({
            ...item,
            city: { name: item.city.name, id: item.city.id },
            region: { name: item.city.region.name, id: item.city.region.id },
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
          reg.city.map((city) => ({ id: city.id, name: city.name }))
        );
        regions = regionsWithCitys.map((reg) => ({
          name: reg.name,
          id: reg.id,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isEditing = (record) => {
    return record && record.id === editingKey;
  };

  const edit = (record) => {
    // Проверяем наличие прав перед разрешением на редактирование


    const adjustDate = (dateString) => {
      const date = new Date(dateString);
      return dayjs(new Date(date.getTime() + date.getTimezoneOffset() * 60000));
  };
    setEditingKey(record.id);
    console.log(record);
    form.setFieldsValue({
      region: { label: record.region.name, value: record.region.id },
      city: { label: record.city.name, value: record.city.id },
      date: adjustDate(record.date),
      sunrise: adjustDate(record.sunrise),
      sunset: adjustDate(record.sunset),
    });
  };

  const handleDelete = async (record) => {
    try {
      const id = localStorage.getItem("id");

      const response = await axios.delete(
        `http://localhost:3000/api/sun/${record.id}`,
        {
          data: { createrUserId: id },
        }
      );
      console.log("Data deleted successfully:", response.data);
      message.success("Запись успешно удалена!");

      fetchData();
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
        console.log("update");
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTableData(newData);
        setEditingKey("");
      } else {
        console.log("add");
        // newData.push(row);
        setTableData(newData);
        setEditingKey("");
      }
      console.log(row);

      let date = new Date(row.date);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Преобразование в часовой пояс UTC

      let sunrise = new Date(row.sunrise);
      sunrise.setMinutes(sunrise.getMinutes() - sunrise.getTimezoneOffset()); // Преобразование в часовой пояс UTC

      let sunset = new Date(row.sunset);
      console.log(sunset);
      sunset.setMinutes(sunset.getMinutes() - sunset.getTimezoneOffset()); // Преобразование в часовой пояс UTC
      const cityId = row.city.label ? row.city.value : row.city;

      console.log(cityId);
      axios
        .post("http://localhost:3000/api/sun", {
          createdAt: new Date(),
          date: date,
          cityId: cityId,
          sunrise: sunrise,
          sunset: sunset,
          createrUserId: Number(localStorage.getItem("id")),
        })
        .then(() => {
          message.success("Успешное сохранение!");
          fetchData();
        });
      console.log(row);
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
    }) => {
      const handleReset = () => {
        clearFilters();
        setSelectedKeys([]);
        confirm(); // Подтверждаем изменения, чтобы фильтр сбросился
      };

      const handleSearch = () => {
        confirm();
      };

      return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder={`Поиск ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={handleSearch}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Поиск
            </Button>
            <Button onClick={handleReset} size="small" style={{ width: 90 }}>
              Сброс
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text, record) =>
        record.createdAt ? new Date(record.createdAt).toLocaleString() : "",
    },
    {
      title: "Регион",
      dataIndex: "region",
      width: "25%",
      editable: true,
      filters: [{}],
      filterSearch: true,
      ...getColumnSearchProps("region"),
      sorter: (a, b) => a.region.name.localeCompare(b.region.name),
      render: (text, record) => {
        if (record.region) {
          return typeof record.region === "number"
            ? regionsWithCitys.find((reg) => reg.id === record.region).name
            : record.region.name;
        }
        return "";
      },
    },
    {
      title: "Город",
      dataIndex: "city",
      width: "25%",
      editable: true,
      filters: [{}],
      filterSearch: true,
      ...getColumnSearchProps("city"),
      sorter: (a, b) => a.city.name.localeCompare(b.city.name),
      render: (text, record) => {
        if (record.city) {
          return typeof record.city === "number"
            ? citys.find((city) => city.id === record.city).name
            : record.city.name;
        }
        return "";
      },
    },
    {
      title: "Дата",
      dataIndex: "date",
      width: "100%",
      editable: true,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (text, record) =>
        record.date
          ? `${new Date(record.date).toISOString().split("T")[0]}`
          : "",
    },
    {
      title: "Восход",
      dataIndex: "sunrise",
      width: "100%",
      editable: true,
      sorter: (a, b) => new Date(a.sunrise) - new Date(b.sunrise),
      render: (text, record) =>
        record.sunrise
          ? new Date(record.sunrise).toLocaleString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            })
          : "",
    },
    {
      title: "Заход",
      dataIndex: "sunset",
      width: "100%",
      editable: true,
      sorter: (a, b) => new Date(a.sunset) - new Date(b.sunset),
      render: (text, record) =>
        record.sunset
          ? new Date(record.sunset).toLocaleString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            })
          : "",
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
              onClick={() => {
                edit(record);
              }}
            >
              <EditTwoTone />
            </Typography.Link>
            <Popconfirm
              title="Хотите удалить?"
              onConfirm={() => handleDelete(record)}
            >
              <DeleteTwoTone style={{ color: "red", marginLeft: 12 }} />
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
          } else if (col.dataIndex === "createdAt") {
            return "createdAt";
          } else if (col.dataIndex === "city") {
            return "city";
          } else if (col.dataIndex === "region") {
            return "region";
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
export default SunTable;
