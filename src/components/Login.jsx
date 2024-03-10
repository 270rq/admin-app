import React from 'react';
import { Button, Form, Input } from 'antd';

const Login = ({ showMessage }) => {
  const onFinish = (values) => {
    console.log('Success:', values);
    const { username, password } = values;
    if (username === 'admin' && password === 'admin') {
      showMessage('success', 'Успешный вход!');
    } else {
      showMessage('error', 'Неверные учетные данные');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль!' }]}
      >
        <Input.Password />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Вход
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;