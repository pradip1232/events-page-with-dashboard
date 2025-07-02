import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Style.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

interface TokenMetrics {
    total: number;
    remaining: number;
    purchased: number;
    used: number;
}

interface PurchaseRecord {
    id: number;
    date: string;
    tokens: number;
    subtotal: number;
    gst: number;
    total: number;
    status: string;
}

const YourTokenPage: React.FC = () => {
    // State for token metrics
    const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics>({
        total: 0,
        remaining: 0,
        purchased: 0,
        used: 0,
    });

    // State for purchase history
    const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customTokens, setCustomTokens] = useState<string>('');
    const [inputError, setInputError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    // Price calculations
    const perTokenCost = 5;
    const tokens = customTokens ? parseInt(customTokens) || 0 : 0;
    const subtotal = tokens * perTokenCost;
    const gst = subtotal * 0.18; // 18% GST
    const finalTotal = subtotal + gst;

    // Get CSRF token from cookies
    const getCookie = (name: string) => {
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

    // Fetch user_id from local storage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                if (parsedData.user_id) {
                    setUserId(parsedData.user_id);
                    console.log('Fetched user_id from local storage:', parsedData.user_id);
                } else {
                    setError('No user_id found in local storage');
                    toast.error('No user_id found in local storage');
                }
            } catch (err) {
                console.error('Error parsing user data from local storage:', err);
                setError('Invalid user data in local storage');
                toast.error('Invalid user data in local storage');
            }
        } else {
            setError('No user data found in local storage');
            toast.error('No user data found in local storage');
        }
    }, []);

    // Fetch CSRF token
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events/login.php`);
                console.log('CSRF token response:', response.data);
                document.cookie = `csrftoken=${response.data.csrf_token}; path=/`;
            } catch (err) {
                console.error('Error fetching CSRF token:', err);
                toast.error('Failed to fetch CSRF token');
            }
        };
        fetchCsrfToken();
    }, []);

    // Fetch token metrics and purchase history
    useEffect(() => {
        if (!userId) return; // Wait until user_id is set

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch token metrics
                console.log('Fetching token metrics from:', `${API_BASE_URL}/events/get_token_metrics.php?user_id=${userId}`);
                const metricsResponse = await axios.get(`${API_BASE_URL}/events/get_token_metrics.php`, {
                    params: { user_id: userId },
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken') || '',
                    },
                });
                console.log('Token metrics response:', metricsResponse.data);
                if (metricsResponse.data.status === 'success') {
                    setTokenMetrics(metricsResponse.data.metrics);
                } else {
                    throw new Error(metricsResponse.data.message || 'Failed to fetch token metrics');
                }

                // Fetch purchase history
                console.log('Fetching purchase history from:', `${API_BASE_URL}/events/get_token_history.php?user_id=${userId}`);
                const historyResponse = await axios.get(`${API_BASE_URL}/events/get_token_history.php`, {
                    params: { user_id: userId },
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken') || '',
                    },
                });
                console.log('Purchase history response:', historyResponse.data);
                if (historyResponse.data.status === 'success') {
                    setPurchaseHistory(historyResponse.data.history);
                } else {
                    throw new Error(historyResponse.data.message || 'Failed to fetch purchase history');
                }
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load data');
                toast.error(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // Handle modal open/close
    const handleOpenModal = () => {
        setIsModalOpen(true);
        setCustomTokens('');
        setInputError('');
        console.log('Opened Add Tokens modal');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCustomTokens('');
        setInputError('');
        console.log('Closed Add Tokens modal');
    };

    // Handle custom token input
    const handleCustomTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomTokens(value);
        if (value && (!/^\d+$/.test(value) || parseInt(value) <= 0)) {
            setInputError('Please enter a positive integer');
        } else {
            setInputError('');
        }
    };

    // Handle token purchase
    const handlePurchase = async () => {
        if (inputError || tokens === 0) {
            toast.error('Please enter a valid number of tokens');
            return;
        }
        if (!userId) {
            toast.error('User not authenticated');
            return;
        }
        try {
            console.log(`Initiating purchase of ${tokens} tokens for user_id ${userId}. Subtotal: ₹${subtotal.toFixed(2)}, GST: ₹${gst.toFixed(2)}, Total: ₹${finalTotal.toFixed(2)}`);
            const response = await axios.post(
                `${API_BASE_URL}/events/add_tokens.php`,
                {
                    user_id: userId,
                    tokens,
                    subtotal,
                    gst,
                    total: finalTotal,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken') || '',
                    },
                }
            );
            console.log('Purchase response:', response.data);
            if (response.data.status === 'success') {
                // Update token metrics
                setTokenMetrics((prev) => ({
                    total: prev.total + tokens,
                    remaining: prev.remaining + tokens,
                    purchased: prev.purchased + tokens,
                    used: prev.used,
                }));
                // Add to purchase history
                setPurchaseHistory((prev) => [
                    {
                        id: response.data.purchase_id || prev.length + 1,
                        date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                        tokens,
                        subtotal,
                        gst,
                        total: finalTotal,
                        status: 'Completed',
                    },
                    ...prev,
                ]);
                toast.success(`Successfully purchased ${tokens} tokens!`);
                handleCloseModal();
            } else {
                throw new Error(response.data.message || 'Purchase failed');
            }
        } catch (err: any) {
            console.error('Purchase error:', err);
            toast.error(err.message || 'Purchase failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl font-semibold text-white text-center mb-6">Your Tokens</h1>
            {/* Add New Tokens Button */}
            <div className="text-right mb-4">
                <button
                    onClick={handleOpenModal}
                    className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                    disabled={!userId}
                >
                    Add New Tokens
                </button>
            </div>
            {/* Token Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-6">
                <div className="bg-blue-800 border border-gray-700 rounded-lg p-4 text-center flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h2 className="text-lg font-medium text-gray-300">Total Tokens</h2>
                        <p className="text-2xl font-bold text-white">{tokenMetrics.total}</p>
                    </div>
                </div>
                <div className="bg-green-800 border border-gray-700 rounded-lg p-4 text-center flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                        <h2 className="text-lg font-medium text-gray-300">Remaining Tokens</h2>
                        <p className="text-2xl font-bold text-white">{tokenMetrics.remaining}</p>
                    </div>
                </div>
                <div className="bg-purple-800 border border-gray-700 rounded-lg p-4 text-center flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                        <h2 className="text-lg font-medium text-gray-300">Total Purchased Tokens</h2>
                        <p className="text-2xl font-bold text-white">{tokenMetrics.purchased}</p>
                    </div>
                </div>
                <div className="bg-orange-800 border border-gray-700 rounded-lg p-4 text-center flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div>
                        <h2 className="text-lg font-medium text-gray-300">Used Tokens</h2>
                        <p className="text-2xl font-bold text-white">{tokenMetrics.used}</p>
                    </div>
                </div>
            </div>

            {/* Purchase History Table */}
            <div className="max-w-6xl mx-auto mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Purchase History</h2>
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="p-3">Date</th>
                                <th className="p-3">Tokens Purchased</th>
                                <th className="p-3">Subtotal</th>
                                <th className="p-3">GST</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseHistory.length > 0 ? (
                                purchaseHistory.map((record) => (
                                    <tr key={record.id} className="border-t border-gray-700">
                                        <td className="p-3">{record.date}</td>
                                        <td className="p-3">{record.tokens}</td>
                                        <td className="p-3">₹{record.subtotal.toFixed(2)}</td>
                                        <td className="p-3">₹{record.gst.toFixed(2)}</td>
                                        <td className="p-3">₹{record.total.toFixed(2)}</td>
                                        <td className="p-3">{record.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-3 text-center text-gray-300">
                                        No purchase history available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-3xl animate-fade-in">
                        <h2 className="text-xl font-semibold text-white mb-4">Add New Tokens</h2>
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            {/* Left Side: Token Input Form */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">Enter Number of Tokens</label>
                                    <input
                                        type="text"
                                        value={customTokens}
                                        onChange={handleCustomTokensChange}
                                        placeholder="Enter number of tokens"
                                        className={`w-full p-2 rounded bg-gray-700 text-white border ${inputError ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                                    />
                                    {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Total Price</label>
                                    <input
                                        type="text"
                                        value={tokens > 0 ? `₹${subtotal.toFixed(2)}` : '₹0.00'}
                                        readOnly
                                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    />
                                </div>
                            </div>
                            {/* Right Side: Checkout Summary */}
                            <div className="flex-1 mt-4 md:mt-0">
                                <h3 className="text-lg font-medium text-white mb-2">Checkout Summary</h3>
                                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                    <p className="text-gray-300 mb-1">
                                        <strong>Per Token Cost:</strong> ₹{perTokenCost.toFixed(2)}
                                    </p>
                                    <p className="text-gray-300 mb-1">
                                        <strong>Selected Tokens:</strong> {tokens || 0}
                                    </p>
                                    <p className="text-gray-300 mb-1">
                                        <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
                                    </p>
                                    <p className="text-gray-300 mb-1">
                                        <strong>GST (18%):</strong> ₹{gst.toFixed(2)}
                                    </p>
                                    <p className="text-white font-bold mt-2">
                                        <strong>Final Total:</strong> ₹{finalTotal.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={handlePurchase}
                                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
                                disabled={inputError || tokens === 0 || !userId}
                            >
                                Purchase
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YourTokenPage;