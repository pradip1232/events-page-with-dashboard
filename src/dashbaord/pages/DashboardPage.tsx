import React, { useState, useEffect } from 'react';
import './Style.css';

const Card = ({ title, count }: { title: string; count: string }) => (
    <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <p className="text-gray-300 text-lg">{title}</p>
        <p className="text-pink-500 text-2xl font-bold">{count}</p>
    </div>
);

const DashboardPage: React.FC = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');

    // Get username from cookies or local storage
    const getUsername = (): string => {
        // Check cookies
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('username='))
            ?.split('=')[1];
        if (cookieValue) {
            console.log(`Retrieved username from cookies: ${cookieValue}`);
            return cookieValue;
        }
        // Fallback to local storage
        const localStorageUsername = localStorage.getItem('username');
        if (localStorageUsername) {
            console.log(`Retrieved username from local storage: ${localStorageUsername}`);
            return localStorageUsername;
        }
        console.log('No username found in cookies or local storage');
        return '';
    };

    useEffect(() => {
        // Check if popup has already been shown in this session
        const hasShownPopup = sessionStorage.getItem('welcomePopupShown');
        if (hasShownPopup) {
            console.log('Welcome popup already shown in this session');
            return;
        }

        const user = getUsername();
        if (user) {
            setUsername(user);
            setShowPopup(true);
            sessionStorage.setItem('welcomePopupShown', 'true');

            // Auto-close after 10 seconds
            const timer = setTimeout(() => {
                setShowPopup(false);
                console.log('Welcome popup auto-closed after 10 seconds');
            }, 10000);

            return () => clearTimeout(timer);
        } else {
            console.log('No user logged in, skipping welcome popup');
        }
    }, []);

    const handleClosePopup = () => {
        setShowPopup(false);
        console.log('Welcome popup closed manually');
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Total Forms:" count="150" />
                <Card title="Total Registrations:" count="12,000" />
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-80 text-center animate-fade-in"
                    >
                        <p className="text-white text-lg mb-4">
                            Welcome back, {username || 'User'}!
                        </p>
                        <p className="text-gray-300 text-sm mb-4">
                            You're now in the Events Dashboard.
                        </p>
                        <button
                            onClick={handleClosePopup}
                            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// CSS for fade animation
const styles = `
@keyframes fadeIn {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
}
`;

export default DashboardPage;