import React from 'react';

const SettingsPage: React.FC = () => {
    const username = document.cookie
        .split('; ')
        .find((row) => row.startsWith('username='))
        ?.split('=')[1] || localStorage.getItem('username') || 'User';

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-white">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p>Username: {username}</p>
        </div>
    );
};

export default SettingsPage;