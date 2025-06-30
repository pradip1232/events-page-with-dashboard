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

interface SupportTicket {
    ticket_id: number;
    user_id: number;
    title: string;
    description: string;
    status: 'Pending' | 'Resolved';
    created_at: string;
    updated_at: string;
}

interface FormData {
    title: string;
    description: string;
}

const SupportPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
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

    // Fetch support tickets
    const fetchTickets = async (userId: number) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/events/get_support_tickets.php?user_id=${userId}`, {
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
            });
            if (response.data.status === 'success') {
                setTickets(response.data.tickets);
                console.log('Fetched support tickets:', response.data.tickets);
            } else {
                throw new Error(response.data.error || 'Failed to fetch tickets');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch tickets';
            console.error('Fetch tickets error:', errorMessage);
            toast.error(errorMessage);
        }
    };

    // Validate form
    const validateForm = (data: FormData): Partial<Record<keyof FormData, string>> => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!data.title.trim()) newErrors.title = 'Title is required';
        if (!data.description.trim()) newErrors.description = 'Description is required';
        return newErrors;
    };

    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('User not logged in');
            return;
        }
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix the errors before submitting');
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/events/submit_support.php`,
                { user_id: user.user_id, ...formData },
                { headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') } }
            );
            if (response.data.status === 'success') {
                setFormData({ title: '', description: '' });
                toast.success('Issue submitted successfully!');
                console.log('Support ticket submitted:', response.data);
                fetchTickets(user.user_id); // Refresh tickets
            } else {
                throw new Error(response.data.error || 'Failed to submit issue');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to submit issue';
            console.error('Submit error:', errorMessage);
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        const userData = getUserData();
        setUser(userData);
        if (userData?.user_id) {
            fetchTickets(userData.user_id);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-white">
            {/* <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Support</h1> */}
            {user ? (
                <div className="max-w-4xl mx-auto animate-fade-in">
                    {/* Support Form */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                            <i className="bi bi-headset text-pink-500 text-2xl" />
                            Submit a Support Issue
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-gray-300 text-sm md:text-base">Issue Title</label>
                                <input
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter issue title"
                                />
                                {errors.title && <span className="text-pink-500 text-xs mt-1">{errors.title}</span>}
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-300 text-sm md:text-base">Description</label>
                                <textarea
                                    className="text-white bg-gray-700 border border-gray-600 rounded p-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe your issue"
                                    rows={4}
                                />
                                {errors.description && (
                                    <span className="text-pink-500 text-xs mt-1">{errors.description}</span>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <i className="bi bi-send text-lg" />
                                Submit Issue
                            </button>
                        </form>
                    </div>
                    {/* Support Tickets */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                            <i className="bi bi-ticket text-pink-500 text-2xl" />
                            Your Support Tickets
                        </h2>
                        {tickets.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm md:text-base">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="p-2 text-gray-300">Ticket ID</th>
                                            <th className="p-2 text-gray-300">Title</th>
                                            <th className="p-2 text-gray-300 hidden md:table-cell">Description</th>
                                            <th className="p-2 text-gray-300">Status</th>
                                            <th className="p-2 text-gray-300">Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((ticket) => (
                                            <tr key={ticket.ticket_id} className="border-b border-gray-700 animate-fade-in">
                                                <td className="p-2 text-white">{ticket.ticket_id}</td>
                                                <td className="p-2 text-white">{ticket.title}</td>
                                                <td className="p-2 text-white hidden md:table-cell">{ticket.description}</td>
                                                <td className="p-2">
                                                    <span
                                                        className={`px-2 py-1 rounded ${ticket.status === 'Resolved'
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-yellow-500 text-black'
                                                            }`}
                                                    >
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-white">
                                                    {new Date(ticket.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-300 text-center">No support tickets found.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-300 animate-fade-in">
                    Please log in to access support.
                </div>
            )}
        </div>
    );
};

export default SupportPage;