import React from 'react';
import { Button, Form, Input } from 'antd';

const Login = () => {
  const registrationHandler = async (e) => {
    try{
      e.preventDefault()
      const data = await
    }
    catch(error){}  }

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