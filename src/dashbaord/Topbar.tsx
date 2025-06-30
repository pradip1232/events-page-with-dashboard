import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
    toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
    const [username, setUsername] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get username from cookies or local storage
    const getUsername = (): string => {
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('username='))
            ?.split('=')[1];
        if (cookieValue) {
            console.log(`Retrieved username from cookies: ${cookieValue}`);
            return cookieValue;
        }
        const localStorageUsername = localStorage.getItem('username');
        if (localStorageUsername) {
            console.log(`Retrieved username from local storage: ${localStorageUsername}`);
            return localStorageUsername;
        }
        console.log('No username found in cookies or local storage');
        return 'User';
    };

    // Handle logout
    const handleLogout = () => {
        console.log(`Logging out user: ${username}`);
        // Clear username from cookies
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        // Clear username from local storage
        localStorage.removeItem('username');
        // Clear session storage (e.g., welcome popup flag)
        sessionStorage.removeItem('welcomePopupShown');
        setIsDropdownOpen(false);
        navigate('/login');
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
        console.log(`Dropdown toggled: ${!isDropdownOpen}`);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                console.log('Dropdown closed due to outside click');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const user = getUsername();
        setUsername(user);
    }, []);

    return (
        <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden text-white text-2xl"
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                >
                    <i className="bi bi-list" />
                </button>
                <div className="text-white text-lg font-semibold truncate max-w-[150px] md:max-w-none">
                    Events Dashboard
                </div>
            </div>
            <div className="relative" ref={dropdownRef}>
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-pink-500 transition-colors"
                    onClick={toggleDropdown}
                >
                    <i className="bi bi-person-circle text-white text-xl md:text-2xl" />
                    <span className="text-white text-sm md:text-base">{username}</span>
                </div>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="flex items-center gap-2 p-3 border-b border-gray-700"
                            onClick={() => {
                                console.log(`Navigating to settings page for user: ${username}`);
                                setIsDropdownOpen(false);
                                navigate('/dashboard/profile');
                            }}
                        >
                            <i className="bi bi-person-circle text-white text-lg" />
                            <span className="text-white text-sm">Hey, {username}</span>
                        </div>
                        <button
                            className="w-full text-left p-3 hover:bg-gray-700 hover:text-pink-500 transition-colors flex items-center gap-2 text-white text-sm"
                            onClick={() => {
                                console.log(`Navigating to settings page for user: ${username}`);
                                setIsDropdownOpen(false);
                                navigate('/dashboard/settings');
                            }}
                        >
                            <i className="bi bi-gear text-lg" />
                            Settings
                        </button>
                        <button
                            className="w-full text-left p-3 hover:bg-gray-700 hover:text-pink-500 transition-colors flex items-center gap-2 text-white text-sm"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right text-lg" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Topbar;