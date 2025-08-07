import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://clickngo.in';

const indianStates = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Ladakh', label: 'Ladakh' },
    { value: 'Lakshadweep', label: 'Lakshadweep' },
    { value: 'Puducherry', label: 'Puducherry' },
];

const stateCities = {
    'Andhra Pradesh': [
        { value: 'Visakhapatnam', label: 'Visakhapatnam' },
        { value: 'Vijayawada', label: 'Vijayawada' },
        { value: 'Guntur', label: 'Guntur' },
        { value: 'Nellore', label: 'Nellore' },
    ],
    'Arunachal Pradesh': [
        { value: 'Itanagar', label: 'Itanagar' },
        { value: 'Naharlagun', label: 'Naharlagun' },
    ],
    'Assam': [
        { value: 'Guwahati', label: 'Guwahati' },
        { value: 'Dibrugarh', label: 'Dibrugarh' },
        { value: 'Silchar', label: 'Silchar' },
    ],
    'Bihar': [
        { value: 'Patna', label: 'Patna' },
        { value: 'Gaya', label: 'Gaya' },
        { value: 'Bhagalpur', label: 'Bhagalpur' },
    ],
    'Chhattisgarh': [
        { value: 'Raipur', label: 'Raipur' },
        { value: 'Bhilai', label: 'Bhilai' },
        { value: 'Bilaspur', label: 'Bilaspur' },
    ],
    'Goa': [
        { value: 'Panaji', label: 'Panaji' },
        { value: 'Margao', label: 'Margao' },
    ],
    'Gujarat': [
        { value: 'Ahmedabad', label: 'Ahmedabad' },
        { value: 'Surat', label: 'Surat' },
        { value: 'Vadodara', label: 'Vadodara' },
    ],
    'Haryana': [
        { value: 'Gurgaon', label: 'Gurgaon' },
        { value: 'Faridabad', label: 'Faridabad' },
        { value: 'Chandigarh', label: 'Chandigarh' },
    ],
    'Himachal Pradesh': [
        { value: 'Shimla', label: 'Shimla' },
        { value: 'Manali', label: 'Manali' },
    ],
    'Jharkhand': [
        { value: 'Ranchi', label: 'Ranchi' },
        { value: 'Jamshedpur', label: 'Jamshedpur' },
    ],
    'Karnataka': [
        { value: 'Bangalore', label: 'Bangalore' },
        { value: 'Mysore', label: 'Mysore' },
        { value: 'Hubli', label: 'Hubli' },
    ],
    'Kerala': [
        { value: 'Thiruvananthapuram', label: 'Thiruvananthapuram' },
        { value: 'Kochi', label: 'Kochi' },
        { value: 'Kozhikode', label: 'Kozhikode' },
    ],
    'Madhya Pradesh': [
        { value: 'Bhopal', label: 'Bhopal' },
        { value: 'Indore', label: 'Indore' },
        { value: 'Gwalior', label: 'Gwalior' },
    ],
    'Maharashtra': [
        { value: 'Mumbai', label: 'Mumbai' },
        { value: 'Pune', label: 'Pune' },
        { value: 'Nagpur', label: 'Nagpur' },
    ],
    'Manipur': [
        { value: 'Imphal', label: 'Imphal' },
    ],
    'Meghalaya': [
        { value: 'Shillong', label: 'Shillong' },
    ],
    'Mizoram': [
        { value: 'Aizawl', label: 'Aizawl' },
    ],
    'Nagaland': [
        { value: 'Kohima', label: 'Kohima' },
        { value: 'Dimapur', label: 'Dimapur' },
    ],
    'Odisha': [
        { value: 'Bhubaneswar', label: 'Bhubaneswar' },
        { value: 'Cuttack', label: 'Cuttack' },
    ],
    'Punjab': [
        { value: 'Amritsar', label: 'Amritsar' },
        { value: 'Ludhiana', label: 'Ludhiana' },
        { value: 'Chandigarh', label: 'Chandigarh' },
    ],
    'Rajasthan': [
        { value: 'Jaipur', label: 'Jaipur' },
        { value: 'Udaipur', label: 'Udaipur' },
        { value: 'Jodhpur', label: 'Jodhpur' },
    ],
    'Sikkim': [
        { value: 'Gangtok', label: 'Gangtok' },
    ],
    'Tamil Nadu': [
        { value: 'Chennai', label: 'Chennai' },
        { value: 'Coimbatore', label: 'Coimbatore' },
        { value: 'Madurai', label: 'Madurai' },
    ],
    'Telangana': [
        { value: 'Hyderabad', label: 'Hyderabad' },
        { value: 'Warangal', label: 'Warangal' },
    ],
    'Tripura': [
        { value: 'Agartala', label: 'Agartala' },
    ],
    'Uttar Pradesh': [
        { value: 'Lucknow', label: 'Lucknow' },
        { value: 'Kanpur', label: 'Kanpur' },
        { value: 'Noida', label: 'Noida' },
    ],
    'Uttarakhand': [
        { value: 'Dehradun', label: 'Dehradun' },
        { value: 'Haridwar', label: 'Haridwar' },
    ],
    'West Bengal': [
        { value: 'Kolkata', label: 'Kolkata' },
        { value: 'Howrah', label: 'Howrah' },
        { value: 'Siliguri', label: 'Siliguri' },
    ],
    'Andaman and Nicobar Islands': [
        { value: 'Port Blair', label: 'Port Blair' },
    ],
    'Chandigarh': [
        { value: 'Chandigarh', label: 'Chandigarh' },
    ],
    'Dadra and Nagar Haveli and Daman and Diu': [
        { value: 'Daman', label: 'Daman' },
        { value: 'Silvassa', label: 'Silvassa' },
    ],
    'Delhi': [
        { value: 'New Delhi', label: 'New Delhi' },
    ],
    'Jammu and Kashmir': [
        { value: 'Srinagar', label: 'Srinagar' },
        { value: 'Jammu', label: 'Jammu' },
    ],
    'Ladakh': [
        { value: 'Leh', label: 'Leh' },
    ],
    'Lakshadweep': [
        { value: 'Kavaratti', label: 'Kavaratti' },
    ],
    'Puducherry': [
        { value: 'Puducherry', label: 'Puducherry' },
    ],
};

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        city: '',
        custom_city: '',
        state: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
    const [availableCities, setAvailableCities] = useState<{ value: string; label: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            console.log('User already logged in, redirecting to dashboard');
            toast.info('You are already logged in', { position: 'top-right', autoClose: 3000 });
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        if (formData.state) {
            const cities = [...(stateCities[formData.state] || []), { value: 'Other', label: 'Other' }];
            setAvailableCities(cities);
            setFormData((prev) => ({ ...prev, city: '', custom_city: '' }));
        } else {
            setAvailableCities([]);
        }
    }, [formData.state]);

    const validateField = (field: keyof typeof formData, value: string) => {
        const newErrors: Partial<Record<keyof typeof formData, string>> = { ...errors };

        switch (field) {
            case 'name':
                if (!value.trim()) newErrors.name = 'Name is required';
                else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) newErrors.name = 'Name must be 2-50 characters, letters and spaces only';
                else delete newErrors.name;
                break;
            case 'email':
                if (!value.trim()) newErrors.email = 'Email is required';
                else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) newErrors.email = 'Invalid email format';
                else delete newErrors.email;
                break;
            case 'phone_number':
                if (!value.trim()) newErrors.phone_number = 'Phone number is required';
                else if (!/^\d{10}$/.test(value)) newErrors.phone_number = 'Phone number must be exactly 10 digits';
                else delete newErrors.phone_number;
                break;
            case 'state':
                if (!value) newErrors.state = 'State is required';
                else delete newErrors.state;
                break;
            case 'city':
                if (!value) newErrors.city = 'City is required';
                else delete newErrors.city;
                break;
            case 'custom_city':
                if (formData.city === 'Other' && !value.trim()) newErrors.custom_city = 'Custom city is required when "Other" is selected';
                else if (formData.city === 'Other' && !/^[a-zA-Z\s]{2,50}$/.test(value)) newErrors.custom_city = 'Custom city must be 2-50 characters, letters and spaces only';
                else delete newErrors.custom_city;
                break;
            case 'password':
                if (!value) newErrors.password = 'Password is required';
                else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters';
                else delete newErrors.password;
                break;
            case 'confirmPassword':
                if (!value) newErrors.confirmPassword = 'Confirm Password is required';
                else if (value !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
                else delete newErrors.confirmPassword;
                break;
        }

        setErrors(newErrors);
    };

    const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = event.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    const handleSignUp = async () => {
        const newErrors: Partial<Record<keyof typeof formData, string>> = {};
        Object.entries(formData).forEach(([field, value]) => {
            validateField(field as keyof typeof formData, value);
            if (errors[field as keyof typeof formData]) {
                newErrors[field as keyof typeof formData] = errors[field as keyof typeof formData];
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Object.values(newErrors).forEach((error) => {
                if (error) toast.error(error, { position: 'top-right', autoClose: 3000 });
            });
            return;
        }

        const cityToSubmit = formData.city === 'Other' ? formData.custom_city : formData.city;

        console.log('Attempting signup with:', {
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number,
            city: cityToSubmit,
            state: formData.state,
        });

        try {
            const response = await axios.post(
                `${API_BASE_URL}/events/signup.php`,
                {
                    name: formData.name,
                    email: formData.email,
                    phone_number: formData.phone_number,
                    city: cityToSubmit,
                    state: formData.state,
                    password: formData.password,
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.status === 'success') {
                localStorage.setItem('user', JSON.stringify({
                    user_id: response.data.user_id,
                    email: response.data.email,
                    name: response.data.name,
                    phone_number: response.data.phone_number,
                    city: response.data.city,
                    state: response.data.state,
                }));
                toast.success('Signup successful! Please log in.', { position: 'top-right', autoClose: 3000 });
                navigate('/login', { replace: true });
            } else {
                throw new Error(response.data.message || 'Signup failed');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
            console.error('Signup error:', errorMessage);
            toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h1 className="text-3xl font-semibold text-white text-center mb-6">Sign Up</h1>
                <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleChange('name')}
                            placeholder="Enter your name"
                            className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            placeholder="Enter your email"
                            className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.email ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={handleChange('phone_number')}
                            placeholder="Enter your phone number"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.phone_number ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                        />
                        {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={handleChange('password')}
                            placeholder="Enter your password"
                            className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.password ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        {!errors.password && <p className="text-gray-400 text-sm mt-1">At least 8 characters</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            placeholder="Confirm your password"
                            className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-gray-300 mb-2">State</label>
                            <select
                                value={formData.state}
                                onChange={handleChange('state')}
                                className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.state ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                            >
                                <option value="">Select a state</option>
                                {indianStates.map((state) => (
                                    <option key={state.value} value={state.value}>{state.label}</option>
                                ))}
                            </select>
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-300 mb-2">City</label>
                            <select
                                value={formData.city}
                                onChange={handleChange('city')}
                                className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.city ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                                disabled={!formData.state}
                            >
                                <option value="">Select a city</option>
                                {availableCities.map((city) => (
                                    <option key={city.value} value={city.value}>{city.label}</option>
                                ))}
                            </select>
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                    </div>
                    {formData.city === 'Other' && (
                        <div>
                            <label className="block text-gray-300 mb-2">Custom City</label>
                            <input
                                type="text"
                                value={formData.custom_city}
                                onChange={handleChange('custom_city')}
                                placeholder="Enter your city"
                                className={`w-full p-2 rounded bg-gray-700 text-white border ${errors.custom_city ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                            />
                            {errors.custom_city && <p className="text-red-500 text-sm mt-1">{errors.custom_city}</p>}
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors disabled:bg-gray-500"
                            disabled={
                                Object.keys(errors).length > 0 ||
                                !formData.name ||
                                !formData.email ||
                                !formData.phone_number ||
                                !formData.state ||
                                !formData.city ||
                                (formData.city === 'Other' && !formData.custom_city) ||
                                !formData.password ||
                                !formData.confirmPassword
                            }
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;