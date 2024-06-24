import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

const Login = ({showButtons}) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const onFinish = (values) => {
        handleFormSubmit(values.username, values.password);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const registrationHandler = async (username, password, handleLoginSuccess, handleLoginError) => {
        try {
            if (!username || !password) {
                console.error('Please fill in both username and password fields');
                handleLoginError();
                return;
            }

            const response = await axios.post('http://localhost:3000/api/auth/login', {
                "email": username,
                "password": password
            });
            const token = response.data;
            handleLoginSuccess(token.access_token, token.id);

            console.log('Login successful! Received token:', token);

        } catch (error) {
            console.error('An error occurred:', error);

            handleLoginError();
        }
    };

    const handleFormSubmit = (username, password) => {
        registrationHandler(username, password, handleLoginSuccess, handleLoginError);
    };

    const handleLoginSuccess = (token, id) => {
        localStorage.setItem('id', id)
        localStorage.setItem('token', token);
        setUsername(username);
        setLoggedIn(true);
        message.success('Вход выполнен успешно!');
        console.log(    showButtons)
        showButtons();
    };

    const handleLoginError = () => {
        message.error('Ошибка входа. Пожалуйста, проверьте введенные данные.');
    };

    const handleLogout = () => {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        setLoggedIn(false);
        setUsername('');
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