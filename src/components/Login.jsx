import React from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

const registrationHandler = async (e, username, password, handleLoginSuccess, handleLoginError) => {
  try {
      if (e) {
          e.preventDefault();
      }

      const response = await axios.post('http://localhost:3000/api/signIn', {
          username,
          password
      });

      const token = response.data.token;

      console.log('Login successful! Received token:', token);
      
      handleLoginSuccess();
      
  } catch (error) {
      console.error('An error occurred:', error);
      
      handleLoginError();
  }
};

const Login = () => {
  const onFinish = (values) => {
      handleFormSubmit(values.username, values.password);
  };

  const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
  };

  const handleFormSubmit = (username, password) => {
      registrationHandler(null, username, password, handleLoginSuccess, handleLoginError);
  };

  const handleLoginSuccess = () => {
    message.success('Вход выполнен успешно!');
  };

  const handleLoginError = () => {
    message.error('Ошибка входа. Пожалуйста, проверьте введенные данные.');
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