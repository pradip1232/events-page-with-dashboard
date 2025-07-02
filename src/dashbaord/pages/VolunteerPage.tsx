import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Style.css';

// Volunteer type
interface Volunteer {
  volunteer_id: number;
  name: string;
  email: string;
  level: string;
  password?: string;
  sent: boolean;
  checkpoint: string | null;
}

// Event type
interface Event {
  event_id: number;
  event_name: string;
  volunteers: Volunteer[];
}

// Modal state for adding volunteer
interface VolunteerModalState {
  open: boolean;
  event_id: number | null;
  volunteer: Omit<Volunteer, 'volunteer_id' | 'checkpoint'>;
}

const levelOptions = ['Beginner', 'Intermediate', 'Expert'];

const VolunteerPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [modalState, setModalState] = useState<VolunteerModalState>({
    open: false,
    event_id: null,
    volunteer: { name: '', email: '', level: 'Beginner', password: '', sent: true },
  });


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

  // Get CSRF token
  const getCookie = useCallback((name: string): string => {
    const value = `; ${document.cookie}`;
    console.log('Cookies available:', document.cookie);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift() || '';
      console.log(`Retrieved CSRF token: ${cookieValue || 'none'}`);
      return cookieValue;
    }
    console.log('No CSRF token found');
    return '';
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {


      const userData = localStorage.getItem('user');
      let user_id = null;

      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          user_id = parsedData.user_id || null;
          console.log("User id ", user_id);
          if (!user_id) {
            toast.error('No user_id found in local storage');
            return;
          }
        } catch (error) {
          console.error('Error parsing user data from local storage:', error);
          toast.error('Invalid user data in local storage');
          return;
        }
      } else {
        toast.error('No user data found in local storage');
        return;
      }

      try {
        setLoading(true);
        console.log('Initiating fetch request to:', `${API_BASE_URL}/events/get_volunteer_data.php`);
        const response = await axios.get(`${API_BASE_URL}/events/get_volunteer_data.php`, {
          params: { user_id },

          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });

        console.log('Server response:', {
          status: response.status,
          data: response.data,
        });

        if (response.data.status === 'success') {
          console.log('Events fetched successfully:', response.data.events);
          setEvents(response.data.events);
          setError(null);
        } else {
          throw new Error(response.data.error || 'Failed to fetch events');
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          (typeof err.response?.data === 'string' ? 'Server error: Invalid response' : err.message) ||
          'Server error';
        console.error('Fetch error:', {
          message: errorMessage,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        console.log('Fetch completed. Loading:', false);
      }
    };

    fetchEvents();
  }, [getCookie]);

  // Handle accordion toggle
  const handleAccordionChange = useCallback(
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      console.log(`Accordion ${panel} ${isExpanded ? 'expanded' : 'collapsed'}`);
    },
    []
  );

  // Open add volunteer modal
  const handleOpenModal = useCallback((event_id: number) => {
    setModalState({
      open: true,
      event_id,
      volunteer: { name: '', email: '', level: 'Beginner', password: '', sent: true },
    });
    console.log(`Opened add volunteer modal for event ID ${event_id}`);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalState({
      open: false,
      event_id: null,
      volunteer: { name: '', email: '', level: 'Beginner', password: '', sent: true },
    });
    setApiError(null);
    console.log('Closed modal');
  }, []);

  // Handle volunteer field change
  const handleVolunteerChange = useCallback(
    (field: keyof Omit<Volunteer, 'volunteer_id' | 'checkpoint'>, value: string) => {
      setModalState((prev) => ({
        ...prev,
        volunteer: { ...prev.volunteer, [field]: value },
      }));
    },
    []
  );

  // Validate email
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Add volunteer
  const handleAddVolunteer = useCallback(async () => {
    if (!modalState.event_id || !modalState.volunteer.name.trim() || !modalState.volunteer.email.trim()) {
      console.error('Event ID, name, or email missing');
      setApiError('Please enter name and email');
      toast.error('Please enter name and email');
      return;
    }

    if (!isValidEmail(modalState.volunteer.email)) {
      console.error('Invalid email format');
      setApiError('Invalid email format');
      toast.error('Invalid email format');
      return;
    }

    if (modalState.volunteer.password && modalState.volunteer.password.length < 8) {
      console.error('Password too short');
      setApiError('Password must be at least 8 characters');
      toast.error('Password must be at least 8 characters');
      return;
    }

    const payload = {
      event_id: modalState.event_id,
      volunteer: { ...modalState.volunteer, sent: true },
    };

    console.log(`Adding volunteer for event ID ${modalState.event_id}:`, payload);

    try {
      const response = await axios.post(`${API_BASE_URL}/events/add_volunteer.php`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });

      console.log('Add volunteer response:', {
        status: response.status,
        data: response.data,
      });

      if (response.data.status === 'success') {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.event_id === modalState.event_id
              ? {
                ...event,
                volunteers: [
                  ...event.volunteers,
                  { ...payload.volunteer, volunteer_id: response.data.volunteer_id, checkpoint: '1' },
                ],
              }
              : event
          )
        );
        setApiError(null);
        toast.success('Volunteer added successfully!');
        handleCloseModal();
      } else {
        throw new Error(response.data.error || 'Failed to add volunteer');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' ? 'Server error: Invalid response' : err.message) ||
        'Server error';
      console.error('Add volunteer error:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
      });
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  }, [modalState.event_id, modalState.volunteer, getCookie, handleCloseModal]);

  // Remove volunteer
  const handleRemoveVolunteer = useCallback(
    async (event_id: number, volunteer_id: number, email: string) => {
      const payload = {
        event_id,
        volunteer_id,
        email,
      };

      console.log(`Removing volunteer from event ID ${event_id}:`, payload);

      try {
        const response = await axios.post(`${API_BASE_URL}/events/remove_volunteer.php`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });

        console.log('Remove volunteer response:', {
          status: response.status,
          data: response.data,
        });

        if (response.data.status === 'success') {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.event_id === event_id
                ? {
                  ...event,
                  volunteers: event.volunteers.filter((vol) => vol.volunteer_id !== volunteer_id),
                }
                : event
            )
          );
          setApiError(null);
          toast.success('Volunteer removed successfully!');
        } else {
          throw new Error(response.data.error || 'Failed to remove volunteer');
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          (typeof err.response?.data === 'string' ? 'Server error: Invalid response' : err.message) ||
          'Server error';
        console.error('Remove volunteer error:', {
          message: errorMessage,
          status: err.response?.status,
          data: err.response?.data,
        });
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [getCookie]
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-semibold text-white text-center mb-6">Volunteers</h1>
      {loading ? (
        <div className="flex justify-center mt-6">
          <svg
            className="animate-spin h-8 w-8 text-pink-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center mt-6">Error: {error}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-300 text-center mt-6">No events found.</p>
      ) : (
        <div className="max-w-2xl mx-auto">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="mb-4 bg-gray-800 rounded-lg shadow-md border border-gray-700"
            >
              <button
                onClick={() => handleAccordionChange(`event-${event.event_id}`)({} as any, expanded !== `event-${event.event_id}`)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <h2 className="text-xl font-medium text-white">{event.event_name}</h2>
                <svg
                  className={`w-6 h-6 text-white transition-transform ${expanded === `event-${event.event_id}` ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {expanded === `event-${event.event_id}` && (
                <div className="p-4">
                  {event.volunteers.length > 0 ? (
                    <div className="space-y-2">
                      {event.volunteers.map((volunteer) => (
                        <div
                          key={`${event.event_id}-${volunteer.volunteer_id}`}
                          className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-white"><strong>Name:</strong> {volunteer.name}</p>
                            <p className="text-gray-300"><strong>Email:</strong> {volunteer.email}</p>
                            <p className="text-gray-300"><strong>Level:</strong> {volunteer.level}</p>
                            <p className="text-gray-300"><strong>Checkpoint:</strong> {volunteer.checkpoint || 'N/A'}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveVolunteer(event.event_id, volunteer.volunteer_id, volunteer.email)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-300">No volunteers for this event.</p>
                  )}
                  <button
                    onClick={() => handleOpenModal(event.event_id)}
                    className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 inline-block mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                    Add Volunteer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalState.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-4">Add Volunteer</h2>
            {apiError && <p className="text-red-500 mb-4">Error: {apiError}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={modalState.volunteer.name}
                  onChange={(e) => handleVolunteerChange('name', e.target.value)}
                  className={`w-full p-2 rounded bg-gray-700 text-white border ${modalState.volunteer.name && !modalState.volunteer.name.trim() ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                  placeholder="Enter name"
                />
                {modalState.volunteer.name && !modalState.volunteer.name.trim() && (
                  <p className="text-red-500 text-sm mt-1">Name is required</p>
                )}
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={modalState.volunteer.email}
                  onChange={(e) => handleVolunteerChange('email', e.target.value)}
                  className={`w-full p-2 rounded bg-gray-700 text-white border ${modalState.volunteer.email && !isValidEmail(modalState.volunteer.email) ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                  placeholder="Enter email"
                />
                {modalState.volunteer.email && !isValidEmail(modalState.volunteer.email) && (
                  <p className="text-red-500 text-sm mt-1">Invalid email format</p>
                )}
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Level</label>
                <select
                  value={modalState.volunteer.level}
                  onChange={(e) => handleVolunteerChange('level', e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                >
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Password (optional)</label>
                <input
                  type="password"
                  value={modalState.volunteer.password}
                  onChange={(e) => handleVolunteerChange('password', e.target.value)}
                  className={`w-full p-2 rounded bg-gray-700 text-white border ${modalState.volunteer.password && modalState.volunteer.password.length < 8 ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                  placeholder="Enter password"
                />
                {modalState.volunteer.password && modalState.volunteer.password.length < 8 && (
                  <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleAddVolunteer}
                disabled={!modalState.volunteer.name.trim() || !isValidEmail(modalState.volunteer.email)}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Add
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

export default VolunteerPage;