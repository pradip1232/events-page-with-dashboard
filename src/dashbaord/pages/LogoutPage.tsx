import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Typography, CircularProgress } from '@mui/material';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Logging out, clearing auth token and user data');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
        toast.success('Logged out successfully', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progressStyle: { background: '#4caf50' },
        });
        setTimeout(() => {
            navigate('/login', { replace: true });
        }, 1000); // Delay to show toast
    }, [navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#18181c',
            }}
        >
            <Typography sx={{ color: 'white', mb: 2 }}>Logging out...</Typography>
            <CircularProgress sx={{ color: 'white' }} />
        </Box>
    );
};

export default LogoutPage;