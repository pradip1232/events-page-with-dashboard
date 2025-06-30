import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
    user_id: number;
    name: string;
    email: string;
    phone_number: string;
    address: string;
    city: string;
    state: string;
    country: string;
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<User | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

    // Get CSRF token
    const getCookie = (name: string): string => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift() || '';
            console.log(`Retrieved CSRF token: ${cookieValue || 'none'}`);
            return cookieValue;
        }
        console.log('No CSRF token found');
        return '';
    };

    // Fetch user data from local storage
    const getUserData = (): User | null => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                console.log('Retrieved user data from local storage:', parsedData);
                return parsedData as User;
            } catch (error) {
                console.error('Error parsing user data from local storage:', error);
                return null;
            }
        }
        console.log('No user data found in local storage');
        return null;
    };

    // Validate form data
    const validateForm = (data: User): Partial<Record<keyof User, string>> => {
        const newErrors: Partial<Record<keyof User, string>> = {};
        if (!data.name.trim()) newErrors.name = 'Name is required';
        if (!data.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!data.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
        return newErrors;
    };

    // Handle input changes
    const handleInputChange = (field: keyof User, value: string) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // Save changes
    const handleSave = async () => {
        if (!formData) return;
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix the errors before saving');
            return;
        }

        try {
            // Update local storage
            localStorage.setItem('user', JSON.stringify(formData));
            console.log('Updated user data in local storage:', formData);

            // Update backend (optional)
            const response = await axios.post(`${API_BASE_URL}/events/update_user.php`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (response.data.status === 'success') {
                setUser(formData);
                setEditMode(false);
                toast.success('Profile updated successfully!');
                console.log('Profile updated in backend:', response.data);
            } else {
                throw new Error(response.data.error || 'Failed to update profile');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to update profile';
            console.error('Update error:', errorMessage);
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        const userData = getUserData();
        setUser(userData);
        setFormData(userData);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">User Profile</h1>
            {user ? (
                <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <i className="bi bi-person-circle text-pink-500 text-4xl" />
                            <h2 className="text-xl md:text-2xl font-semibold text-white">Hey, {user.name}</h2>
                        </div>
                        <button
                            className="flex items-center gap-2 text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg transition-colors"
                            onClick={() => {
                                setEditMode(!editMode);
                                setErrors({});
                                console.log(`Toggled edit mode: ${!editMode}`);
                            }}
                        >
                            <i className={`bi ${editMode ? 'bi-save' : 'bi-pencil'} text-lg`} />
                            {editMode ? 'Save' : 'Edit Profile'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm md:text-base">User ID</span>
                            <span className="text-white font-medium">{user.user_id}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm md:text-base">Name</span>
                            {editMode ? (
                                <input
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData?.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            ) : (
                                <span className="text-white font-medium">{user.name}</span>
                            )}
                            {errors.name && <span className="text-pink-500 text-xs mt-1">{errors.name}</span>}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm md:text-base">Email</span>
                            {editMode ? (
                                <input
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData?.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                            ) : (
                                <span className="text-white font-medium">{user.email}</span>
                            )}
                            {errors.email && <span className="text-pink-500 text-xs mt-1">{errors.email}</span>}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm md:text-base">Phone Number</span>
                            {editMode ? (
                                <input
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData?.phone_number || ''}
                                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                />
                            ) : (
                                <span className="text-white font-medium">{user.phone_number}</span>
                            )}
                            {errors.phone_number && (
                                <span className="text-pink-500 text-xs mt-1">{errors.phone_number}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm md:text-base">Address</span>
                            {editMode ? (
                                <input
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData?.address || ''}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                />
                            ) : (
                                <span className="text-white font-medium">{user.address}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm md:text-base">City</span>
                            {editMode ? (
                                <input
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData?.city || ''}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                />
                            ) : (
                                <span className="text-white font-medium">{user.city}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm md:text-base">State</span>
                            {editMode ? (
                                <input
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData?.state || ''}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                />
                            ) : (
                                <span className="text-white font-medium">{user.state}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm md:text-base">Country</span>
                            {editMode ? (
                                <input
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData?.country || ''}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                />
                            ) : (
                                <span className="text-white font-medium">{user.country}</span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-300 animate-fade-in">
                    No user data available.
                </div>
            )}
        </div>
    );
};

export default ProfilePage;