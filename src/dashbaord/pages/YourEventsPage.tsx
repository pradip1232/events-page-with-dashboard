import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './Style.css';
import { toast } from 'react-toastify';


// Types for event data
interface Form {
  form_id: number;
  form_name: string;
  price: number | null;
  fields: string;
}

interface EmailTemplate {
  template_id: number;
  template_type: string;
  email_content: string;
  branding_assets: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
}

interface Volunteer {
  volunteer_id: number;
  checkpoint: string;
  volunteer_data: {
    name: string;
    email: string;
    level: string;
    password: string;
    sent?: boolean;
  } | null; // Allow null to handle invalid data
}

interface Event {
  event_id: number;
  event_type: string;
  event_name: string;
  start_datetime: string;
  end_datetime: string;
  checkpoints: number;
  guest_registration_type: string;
  event_description: string;
  event_category: string;
  venue_location: string;
  organization_name: string;
  organization_email: string;
  organization_phone: string;
  max_attendance: number;
  registration_deadline: string;
  forms: Form[];
  email_templates: EmailTemplate[];
  volunteers: Volunteer[];
}

const YourEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  // Handle accordion toggle
  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
    console.log(`Accordion ${panel} ${isExpanded ? 'expanded' : 'collapsed'}`);
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';


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

  // Fetch events on mount
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
        console.log('Initiating fetch request to:', `${API_BASE_URL}/events/get_events.php`);
        console.log('Request headers:', {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') || 'none',
        });

        const response = await axios.get(`${API_BASE_URL}/events/get_events.php`, {
          params: {user_id},
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') || '',
          },
        });

        console.log('Server response:', {
          status: response.status,
          data: response.data,
          headers: response.headers,
        });

        if (response.data.status === 'success') {
          console.log('Events fetched successfully:', response.data.events);
          // Validate volunteer_data before setting state
          const validatedEvents = response.data.events.map((event: Event) => ({
            ...event,
            volunteers: event.volunteers.map((volunteer: Volunteer) => {
              if (!volunteer.volunteer_data) {
                console.warn(`Invalid volunteer_data for volunteer ID ${volunteer.volunteer_id} in event ID ${event.event_id}`);
                return {
                  ...volunteer,
                  volunteer_data: {
                    name: 'Unknown',
                    email: 'Unknown',
                    level: 'Unknown',
                    password: 'Unknown',
                    sent: false,
                  },
                };
              }
              return volunteer;
            }),
          }));
          setEvents(validatedEvents);
          setError(null);
        } else {
          const errorMsg = response.data.error || 'Failed to fetch events';
          console.error('Server returned error:', errorMsg);
          throw new Error(errorMsg);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || 'Server error';
        console.error('Fetch error details:', {
          message: errorMessage,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers,
          } : null,
          request: err.request || null,
          error: err,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
        console.log('Fetch request completed. Loading state:', false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-semibold text-white text-center mb-6">Your Events</h1>
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
        <div className="max-w-4xl mx-auto">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="mb-4 bg-gray-800 rounded-lg shadow-md border border-gray-700"
            >
              <button
                onClick={() => handleChange(`event-${event.event_id}`)({} as any, expanded !== `event-${event.event_id}`)}
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
                <div className="p-4 bg-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-300"><strong>Event ID:</strong> {event.event_id}</p>
                      <p className="text-gray-300"><strong>Start Date:</strong> {new Date(event.start_datetime).toLocaleString()}</p>
                      <p className="text-gray-300"><strong>End Date:</strong> {new Date(event.end_datetime).toLocaleString()}</p>
                      <p className="text-gray-300"><strong>Type:</strong> {event.event_type}</p>
                      <p className="text-gray-300"><strong>Category:</strong> {event.event_category}</p>
                      <p className="text-gray-300"><strong>Location:</strong> {event.venue_location}</p>
                      <p className="text-gray-300"><strong>Description:</strong> {event.event_description}</p>
                    </div>
                    <div>
                      <p className="text-gray-300"><strong>Organization:</strong> {event.organization_name}</p>
                      <p className="text-gray-300"><strong>Email:</strong> {event.organization_email}</p>
                      <p className="text-gray-300"><strong>Phone:</strong> {event.organization_phone}</p>
                      <p className="text-gray-300"><strong>Max Attendance:</strong> {event.max_attendance}</p>
                      <p className="text-gray-300"><strong>Registration Deadline:</strong> {event.registration_deadline}</p>
                      <p className="text-gray-300"><strong>Checkpoints:</strong> {event.checkpoints}</p>
                      <p className="text-gray-300"><strong>Guest Registration Type:</strong> {event.guest_registration_type}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white mb-2">Forms</h3>
                    {event.forms.length > 0 ? (
                      <div className="space-y-2">
                        {event.forms.map((form) => (
                          <div
                            key={form.form_id}
                            className="bg-gray-700 p-3 rounded-lg border border-gray-600"
                          >
                            <p className="text-gray-300"><strong>Name:</strong> {form.form_name}</p>
                            <p className="text-gray-300"><strong>ID:</strong> {form.form_id}</p>
                            <p className="text-gray-300"><strong>Price:</strong> {form.price ? `₹${form.price.toFixed(2)}` : 'Free'}</p>
                            <p className="text-gray-300"><strong>Fields:</strong> {form.fields || 'None'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-300">None</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white mb-2">Email Templates</h3>
                    {event.email_templates.length > 0 ? (
                      <div className="space-y-2">
                        {event.email_templates.map((template) => (
                          <div
                            key={template.template_id}
                            className="bg-gray-700 p-3 rounded-lg border border-gray-600"
                          >
                            <p className="text-gray-300"><strong>Type:</strong> {template.template_type}</p>
                            <p className="text-gray-300"><strong>ID:</strong> {template.template_id}</p>
                            <p className="text-gray-300"><strong>Content:</strong> {template.email_content}</p>
                            {template.branding_assets && (
                              <p className="text-gray-300"><strong>Branding:</strong> {template.branding_assets}</p>
                            )}
                            {template.facebook_url && (
                              <p className="text-gray-300"><strong>Facebook:</strong> <a href={template.facebook_url} className="text-pink-500 hover:text-pink-600">{template.facebook_url}</a></p>
                            )}
                            {template.instagram_url && (
                              <p className="text-gray-300"><strong>Instagram:</strong> <a href={template.instagram_url} className="text-pink-500 hover:text-pink-600">{template.instagram_url}</a></p>
                            )}
                            {template.twitter_url && (
                              <p className="text-gray-300"><strong>Twitter:</strong> <a href={template.twitter_url} className="text-pink-500 hover:text-pink-600">{template.twitter_url}</a></p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-300">None</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white mb-2">Volunteers</h3>
                    {event.volunteers.length > 0 ? (
                      <div className="space-y-2">
                        {event.volunteers.map((volunteer) => (
                          <div
                            key={volunteer.volunteer_id}
                            className="bg-gray-700 p-3 rounded-lg border border-gray-600"
                          >
                            <p className="text-gray-300"><strong>ID:</strong> {volunteer.volunteer_id}</p>
                            <p className="text-gray-300"><strong>Checkpoint:</strong> {volunteer.checkpoint}</p>
                            <p className="text-gray-300"><strong>Name:</strong> {volunteer.volunteer_data?.name ?? 'Unknown'}</p>
                            <p className="text-gray-300"><strong>Email:</strong> {volunteer.volunteer_data?.email ?? 'Unknown'}</p>
                            <p className="text-gray-300"><strong>Level:</strong> {volunteer.volunteer_data?.level ?? 'Unknown'}</p>
                            <p className="text-gray-300"><strong>Sent:</strong> {volunteer.volunteer_data?.sent ? 'Yes' : 'No'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-300">None</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourEventsPage;