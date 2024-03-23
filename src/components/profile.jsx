import React from 'react';
import { Button } from 'antd';

const UserProfile = ({ username, handleLogout }) => {
    return (
        <div>
            <h1>Добро пожаловать, {username}!</h1>
            <Button type="primary" onClick={handleLogout}>Выход</Button>
        </div>
    );
};

export default UserProfile;