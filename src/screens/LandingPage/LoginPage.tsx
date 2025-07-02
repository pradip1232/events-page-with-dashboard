import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Box,
    Typography,
    TextField,
    Button,
    Modal,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost';

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [resetEmail, setResetEmail] = useState<string>('');
    const [resetCode, setResetCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [resetErrors, setResetErrors] = useState<{
        resetEmail?: string;
        resetCode?: string;
        newPassword?: string;
        confirmNewPassword?: string;
    }>({});
    const [openEmailModal, setOpenEmailModal] = useState(false);
    const [openResetModal, setOpenResetModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // TextField styles
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

    // Modal style
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#2c2c2e',
        border: '2px solid white',
        boxShadow: 24,
        p: 4,
        color: 'white',
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
        } else if (location.state?.fromProtectedRoute) {
            console.log('Redirected from protected route:', location.state.from);
            toast.warning('You need to be logged in to access your dashboard', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progressStyle: { background: '#ff6b6b' },
            });
        }
    }, [location, navigate, getCookie]);

    // Validate login fields
    const validateField = useCallback(
        (field: 'email' | 'password', value: string) => {
            const newErrors = { ...errors };
            switch (field) {
                case 'email':
                    if (!value.trim()) {
                        newErrors.email = 'Email is required';
                    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                        newErrors.email = 'Invalid email format';
                    } else {
                        delete newErrors.email;
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
            }
            setErrors(newErrors);
        },
        [errors]
    );

    // Validate reset fields
    const validateResetField = useCallback(
        (field: 'resetEmail' | 'resetCode' | 'newPassword' | 'confirmNewPassword', value: string) => {
            const newErrors = { ...resetErrors };
            switch (field) {
                case 'resetEmail':
                    if (!value.trim()) {
                        newErrors.resetEmail = 'Email is required';
                    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                        newErrors.resetEmail = 'Invalid email format';
                    } else {
                        delete newErrors.resetEmail;
                    }
                    break;
                case 'resetCode':
                    if (!value.trim()) {
                        newErrors.resetCode = 'Code is required';
                    } else if (!/^\d{6}$/.test(value)) {
                        newErrors.resetCode = 'Code must be exactly 6 digits';
                    } else {
                        delete newErrors.resetCode;
                    }
                    break;
                case 'newPassword':
                    if (!value) {
                        newErrors.newPassword = 'New password is required';
                    } else if (value.length < 8) {
                        newErrors.newPassword = 'New password must be at least 8 characters';
                    } else {
                        delete newErrors.newPassword;
                    }
                    break;
                case 'confirmNewPassword':
                    if (!value) {
                        newErrors.confirmNewPassword = 'Confirm password is required';
                    } else if (value !== newPassword) {
                        newErrors.confirmNewPassword = 'Passwords do not match';
                    } else {
                        delete newErrors.confirmNewPassword;
                    }
                    break;
            }
            setResetErrors(newErrors);
        },
        [resetErrors, newPassword]
    );

    // Handle input changes
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateField('email', value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        validateField('password', value);
    };

    const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setResetEmail(value);
        validateResetField('resetEmail', value);
    };

    const handleResetCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setResetCode(value);
        validateResetField('resetCode', value);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        validateResetField('newPassword', value);
    };

    const handleConfirmNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmNewPassword(value);
        validateResetField('confirmNewPassword', value);
    };

    // Validate login form
    const validateForm = useCallback(() => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [email, password]);

    // Validate reset email form
    const validateResetEmailForm = useCallback(() => {
        const newErrors: { resetEmail?: string } = {};
        if (!resetEmail.trim()) {
            newErrors.resetEmail = 'Email is required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(resetEmail)) {
            newErrors.resetEmail = 'Invalid email format';
        }
        setResetErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [resetEmail]);

    // Validate reset code form
    const validateResetCodeForm = useCallback(() => {
        const newErrors: { resetCode?: string; newPassword?: string; confirmNewPassword?: string } = {};
        if (!resetCode.trim()) {
            newErrors.resetCode = 'Code is required';
        } else if (!/^\d{6}$/.test(resetCode)) {
            newErrors.resetCode = 'Code must be exactly 6 digits';
        }
        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'New password must be at least 8 characters';
        }
        if (!confirmNewPassword) {
            newErrors.confirmNewPassword = 'Confirm password is required';
        } else if (confirmNewPassword !== newPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }
        setResetErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [resetCode, newPassword, confirmNewPassword]);

    // Handle login
    const handleLogin = useCallback(async () => {
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

        console.log('Attempting login with:', { email, password });

        try {
            const response = await axios.post(
                `${API_BASE_URL}/events/login.php`,
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                }
            );

            console.log('Login response:', {
                status: response.status,
                data: response.data,
            });

            if (response.data.status === 'success') {
                const { user, token } = response.data;
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                const userCookie = JSON.stringify(user);
                document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
                document.cookie = `user=${encodeURIComponent(userCookie)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
                console.log('Login successful, stored user:', user, 'token:', token);
                toast.success('Login successful', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progressStyle: { background: '#4caf50' },
                });
                navigate('/dashboard', { replace: true });
            } else {
                throw new Error(response.data.error || 'Login failed');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Login failed';
            console.error('Login error:', errorMessage);
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
    }, [email, password, navigate, getCookie, errors, validateForm]);

    // Handle reset password request
    const handleResetPasswordRequest = useCallback(async () => {
        if (!validateResetEmailForm()) {
            Object.values(resetErrors).forEach((error) => {
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

        console.log('Requesting password reset for:', { email: resetEmail });

        try {
            const response = await axios.post(
                `${API_BASE_URL}/events/reset_password.php`,
                { email: resetEmail },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                }
            );

            console.log('Reset password response:', {
                status: response.status,
                data: response.data,
            });

            if (response.data.status === 'success') {
                toast.success('Reset code sent to your email', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progressStyle: { background: '#4caf50' },
                });
                setOpenEmailModal(false);
                setOpenResetModal(true);
            } else {
                throw new Error(response.data.error || 'Failed to send reset code');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to send reset code';
            console.error('Reset password error:', errorMessage);
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
    }, [resetEmail, resetErrors, getCookie]);

    // Handle reset code verification and password update
    const handleResetPassword = useCallback(async () => {
        if (!validateResetCodeForm()) {
            Object.values(resetErrors).forEach((error) => {
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

        // console.log('Verifying reset code for:', { email: resetEmail, code: resetCode });

        try {
            const response = await axios.post(
                `${API_BASE_URL}/events/verify_reset_code.php`,
                { email: resetEmail, code: resetCode, newPassword },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                }
            );

            console.log('Verify reset code response:', {
                status: response.status,
                data: response.data,
            });

            if (response.data.status === 'success') {
                toast.success('Password reset successful! Please log in.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progressStyle: { background: '#4caf50' },
                });
                setOpenResetModal(false);
                setResetEmail('');
                setResetCode('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                throw new Error(response.data.error || 'Failed to reset password');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to reset password';
            console.error('Reset password error:', errorMessage);
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
    }, [resetEmail, resetCode, newPassword, resetErrors, getCookie]);

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
                Login
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                    sx={textFieldStyles}
                    margin="normal"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    sx={textFieldStyles}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password || 'At least 8 characters'}
                />
                <Button
                    variant="outlined"
                    onClick={handleLogin}
                    sx={{ mt: 2, color: 'white', borderColor: 'white', width: '100%' }}
                    disabled={!email.trim() || !password.trim()}
                    startIcon={
                        <i
                            className="bi bi-box-arrow-in-right"
                            style={{ color: 'white', fontSize: '24px', border: '1px solid white' }}
                        />
                    }
                >
                    Login
                </Button>
                <Typography
                    variant="h6"
                    sx={{ color: 'white', mt: 2, textAlign: 'center' }}
                >
                    Need to register?{' '}
                    <Link to="/signup" style={{ color: 'white', textDecoration: 'underline' }}>
                        Sign Up
                    </Link>
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ color: 'white', mt: 1, textAlign: 'center' }}
                >
                    <Link
                        to="#"
                        onClick={() => setOpenEmailModal(true)}
                        style={{ color: 'white', textDecoration: 'underline' }}
                    >
                        Forgot Password?
                    </Link>
                </Typography>
            </Box>

            {/* Email Input Modal */}
            <Modal
                open={openEmailModal}
                onClose={() => setOpenEmailModal(false)}
                aria-labelledby="reset-email-modal"
            >
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="reset-email-modal" variant="h6">
                            Reset Password
                        </Typography>
                        <IconButton onClick={() => setOpenEmailModal(false)}>
                            <CloseIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                    <TextField
                        fullWidth
                        label="Email"
                        value={resetEmail}
                        onChange={handleResetEmailChange}
                        sx={textFieldStyles}
                        margin="normal"
                        type="email"
                        error={!!resetErrors.resetEmail}
                        helperText={resetErrors.resetEmail}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleResetPasswordRequest}
                        sx={{ mt: 2, color: 'white', borderColor: 'white', width: '100%' }}
                        disabled={!resetEmail.trim()}
                    >
                        Send Reset Code
                    </Button>
                </Box>
            </Modal>

            {/* Reset Code and New Password Modal */}
            <Modal
                open={openResetModal}
                onClose={() => setOpenResetModal(false)}
                aria-labelledby="reset-code-modal"
            >
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="reset-code-modal" variant="h6">
                            Enter Reset Code
                        </Typography>
                        <IconButton onClick={() => setOpenResetModal(false)}>
                            <CloseIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                    <TextField
                        fullWidth
                        label="Reset Code"
                        value={resetCode}
                        onChange={handleResetCodeChange}
                        sx={textFieldStyles}
                        margin="normal"
                        error={!!resetErrors.resetCode}
                        helperText={resetErrors.resetCode || 'Enter the 6-digit code sent to your email'}
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        sx={textFieldStyles}
                        margin="normal"
                        error={!!resetErrors.newPassword}
                        helperText={resetErrors.newPassword || 'At least 8 characters'}
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={handleConfirmNewPasswordChange}
                        sx={textFieldStyles}
                        margin="normal"
                        error={!!resetErrors.confirmNewPassword}
                        helperText={resetErrors.confirmNewPassword}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleResetPassword}
                        sx={{ mt: 2, color: 'white', borderColor: 'white', width: '100%' }}
                        disabled={!resetCode.trim() || !newPassword.trim() || !confirmNewPassword.trim()}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default LoginPage;