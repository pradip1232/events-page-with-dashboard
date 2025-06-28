import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';

// Environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        country: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
    const navigate = useNavigate();

    // TextField styles to match LoginPage
    const textFieldStyles = {
        '& .MuiInputBase-input': { color: 'white' },
        '& .MuiInputLabel-root': { color: 'white' },
        '& .MuiInputBase-root': {
            backgroundColor: '#2c2c2e',
            '&:hover': { backgroundColor: '#3a3a3c' },
        },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
        '& .MuiFormHelperText-root': { color: '#ff6b6b' },
    };

    // Get CSRF token
    const getCookie = useCallback((name: string): string => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift() || '';
            console.log(`Retrieved CSRF token: ${cookieValue || 'none'}`);
            return cookieValue;
        }
        console.log('No CSRF token found');
        return '';
    }, []);

    // Check if already logged in
    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem('authToken') || !!getCookie('authToken');
        if (isAuthenticated) {
            console.log('User already logged in, redirecting to dashboard');
            toast.info('You are already logged in', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progressStyle: { background: '#ff6b6b' },
            });
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, getCookie]);

    // Validate form fields
    const validateField = useCallback(
        (field: keyof typeof formData, value: string) => {
            const newErrors: Partial<Record<keyof typeof formData, string>> = { ...errors };

            switch (field) {
                case 'name':
                    if (!value.trim()) {
                        newErrors.name = 'Name is required';
                    } else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) {
                        newErrors.name = 'Name must be 2-50 characters, letters and spaces only';
                    } else {
                        delete newErrors.name;
                    }
                    break;
                case 'email':
                    if (!value.trim()) {
                        newErrors.email = 'Email is required';
                    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                        newErrors.email = 'Invalid email format';
                    } else {
                        delete newErrors.email;
                    }
                    break;
                case 'phone_number':
                    if (!value.trim()) {
                        newErrors.phone_number = 'Phone number is required';
                    } else if (!/^\d{10}$/.test(value)) {
                        newErrors.phone_number = 'Phone number must be exactly 10 digits';
                    } else {
                        delete newErrors.phone_number;
                    }
                    break;
                case 'address':
                    if (!value.trim()) {
                        newErrors.address = 'Address is required';
                    } else if (value.length < 5 || value.length > 100) {
                        newErrors.address = 'Address must be 5-100 characters';
                    } else {
                        delete newErrors.address;
                    }
                    break;
                case 'city':
                    if (!value.trim()) {
                        newErrors.city = 'City is required';
                    } else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) {
                        newErrors.city = 'City must be 2-50 characters, letters and spaces only';
                    } else {
                        delete newErrors.city;
                    }
                    break;
                case 'state':
                    if (!value.trim()) {
                        newErrors.state = 'State is required';
                    } else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) {
                        newErrors.state = 'State must be 2-50 characters, letters and spaces only';
                    } else {
                        delete newErrors.state;
                    }
                    break;
                case 'country':
                    if (!value.trim()) {
                        newErrors.country = 'Country is required';
                    } else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) {
                        newErrors.country = 'Country must be 2-50 characters, letters and spaces only';
                    } else {
                        delete newErrors.country;
                    }
                    break;
                case 'password':
                    if (!value) {
                        newErrors.password = 'Password is required';
                    } else if (value.length < 8) {
                        newErrors.password = 'Password must be at least 8 characters';
                    } else {
                        delete newErrors.password;
                    }
                    break;
                case 'confirmPassword':
                    if (!value) {
                        newErrors.confirmPassword = 'Confirm Password is required';
                    } else if (value !== formData.password) {
                        newErrors.confirmPassword = 'Passwords do not match';
                    } else {
                        delete newErrors.confirmPassword;
                    }
                    break;
            }

            setErrors(newErrors);
        },
        [errors, formData.password]
    );

    // Handle input change with live validation
    const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    // Validate all fields before submission
    const validateForm = useCallback(() => {
        const newErrors: Partial<Record<keyof typeof formData, string>> = {};
        const { name, email, phone_number, address, city, state, country, password, confirmPassword } = formData;

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
            newErrors.name = 'Name must be 2-50 characters, letters and spaces only';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!/^\d{10}$/.test(phone_number)) {
            newErrors.phone_number = 'Phone number must be exactly 10 digits';
        }

        if (!address.trim()) {
            newErrors.address = 'Address is required';
        } else if (address.length < 5 || address.length > 100) {
            newErrors.address = 'Address must be 5-100 characters';
        }

        if (!city.trim()) {
            newErrors.city = 'City is required';
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(city)) {
            newErrors.city = 'City must be 2-50 characters, letters and spaces only';
        }

        if (!state.trim()) {
            newErrors.state = 'State is required';
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(state)) {
            newErrors.state = 'State must be 2-50 characters, letters and spaces only';
        }

        if (!country.trim()) {
            newErrors.country = 'Country is required';
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(country)) {
            newErrors.country = 'Country must be 2-50 characters, letters and spaces only';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle signup
    const handleSignUp = useCallback(async () => {
        if (!validateForm()) {
            Object.values(errors).forEach((error) => {
                if (error) {
                    toast.error(error, {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progressStyle: { background: '#ff6b6b' },
                    });
                }
            });
            return;
        }

        console.log('Attempting signup with:', {
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number,
        });

        try {
            const response = await axios.post(
                `${API_BASE_URL}/events/signup.php`,
                {
                    Name: formData.name,
                    Email: formData.email,
                    Phone_number: formData.phone_number,
                    Address: formData.address,
                    City: formData.city,
                    State: formData.state,
                    Country: formData.country,
                    Password: formData.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                }
            );

            console.log('Signup response:', {
                status: response.status,
                data: response.data,
            });

            if (response.data.status === 'success') {
                toast.success('Signup successful! Please log in.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progressStyle: { background: '#4caf50' },
                });
                navigate('/login', { replace: true });
            } else if (response.data.error === 'Email or phone number already registered') {
                toast.warning('This email or phone number is already registered in our database', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progressStyle: { background: '#ff6b6b' },
                });
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 1000);
            } else {
                throw new Error(response.data.error || 'Signup failed');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Signup failed';
            console.error('Signup error:', errorMessage);
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progressStyle: { background: '#ff6b6b' },
            });
        }
    }, [formData, errors, navigate, getCookie]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#18181c',
                padding: 4,
            }}
        >
            <Typography
                variant="h4"
                sx={{ color: 'white', fontWeight: 600, mb: 4 }}
            >
                Sign Up
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    sx={textFieldStyles}
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    sx={textFieldStyles}
                    margin="normal"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange('phone_number')}
                    sx={textFieldStyles}
                    margin="normal"
                    type="tel"
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                />
                <TextField
                    fullWidth
                    label="Address"
                    value={formData.address}
                    onChange={handleChange('address')}
                    sx={textFieldStyles}
                    margin="normal"
                    error={!!errors.address}
                    helperText={errors.address}
                />
                <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={handleChange('city')}
                    sx={textFieldStyles}
                    margin="normal"
                    error={!!errors.city}
                    helperText={errors.city}
                />
                <TextField
                    fullWidth
                    label="State"
                    value={formData.state}
                    onChange={handleChange('state')}
                    sx={textFieldStyles}
                    margin="normal"
                    error={!!errors.state}
                    helperText={errors.state}
                />
                <TextField
                    fullWidth
                    label="Country"
                    value={formData.country}
                    onChange={handleChange('country')}
                    sx={textFieldStyles}
                    margin="normal"
                    error={!!errors.country}
                    helperText={errors.country}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    sx={textFieldStyles}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password || 'At least 8 characters'}
                />
                <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    sx={textFieldStyles}
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                />
                <Button
                    variant="outlined"
                    onClick={handleSignUp}
                    sx={{ mt: 2, color: 'white', borderColor: 'white', width: '100%' }}
                    disabled={
                        !formData.name.trim() ||
                        !formData.email.trim() ||
                        !formData.phone_number.trim() ||
                        !formData.address.trim() ||
                        !formData.city.trim() ||
                        !formData.state.trim() ||
                        !formData.country.trim() ||
                        !formData.password.trim() ||
                        !formData.confirmPassword.trim()
                    }
                    startIcon={
                        <i
                            className="bi bi-person-plus"
                            style={{ color: 'white', fontSize: '24px', border: '1px solid white' }}
                        />
                    }
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
};

export default SignUpPage;