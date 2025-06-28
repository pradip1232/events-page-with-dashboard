import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost';

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

const YourEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  // Handle accordion toggle
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
    console.log(`Accordion ${panel} ${isExpanded ? 'expanded' : 'collapsed'}`);
  };

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('Initiating fetch request to:', `${API_BASE_URL}/events/fetch_events.php`);
        console.log('Request headers:', {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') || 'none',
        });

        const response = await axios.get(`${API_BASE_URL}/events/get_events.php`, {
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

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Events
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      ) : events.length === 0 ? (
        <Typography sx={{ mt: 2 }}>
          No events found.
        </Typography>
      ) : (
        <Box>
          {events.map((event) => (
            <Accordion
              key={event.event_id}
              expanded={expanded === `event-${event.event_id}`}
              onChange={handleChange(`event-${event.event_id}`)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`event-${event.event_id}-content`}
                id={`event-${event.event_id}-header`}
              >
                <Typography variant="h6">{event.event_name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper sx={{ p: 2 }}>
                  <Table sx={{ minWidth: 650 }} aria-label={`event-${event.event_id}-details`}>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">Event ID</TableCell>
                        <TableCell>{event.event_id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Start Date</TableCell>
                        <TableCell>{new Date(event.start_datetime).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">End Date</TableCell>
                        <TableCell>{new Date(event.end_datetime).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Type</TableCell>
                        <TableCell>{event.event_type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Category</TableCell>
                        <TableCell>{event.event_category}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Location</TableCell>
                        <TableCell>{event.venue_location}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Description</TableCell>
                        <TableCell>{event.event_description}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Organization</TableCell>
                        <TableCell>{event.organization_name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Email</TableCell>
                        <TableCell>{event.organization_email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Phone</TableCell>
                        <TableCell>{event.organization_phone}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Max Attendance</TableCell>
                        <TableCell>{event.max_attendance}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Registration Deadline</TableCell>
                        <TableCell>{event.registration_deadline}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Checkpoints</TableCell>
                        <TableCell>{event.checkpoints}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Guest Registration Type</TableCell>
                        <TableCell>{event.guest_registration_type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Forms</TableCell>
                        <TableCell>
                          {event.forms.length > 0 ? (
                            <ul>
                              {event.forms.map((form) => (
                                <li key={form.form_id}>
                                  {form.form_name} (ID: {form.form_id}, Price: {form.price ?? 'Free'}, Fields: {form.fields})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'None'
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Email Templates</TableCell>
                        <TableCell>
                          {event.email_templates.length > 0 ? (
                            <ul>
                              {event.email_templates.map((template) => (
                                <li key={template.template_id}>
                                  {template.template_type} (ID: {template.template_id})
                                  <br />
                                  Content: {template.email_content}
                                  {template.branding_assets && <><br />Branding: {template.branding_assets}</>}
                                  {template.facebook_url && <><br />Facebook: {template.facebook_url}</>}
                                  {template.instagram_url && <><br />Instagram: {template.instagram_url}</>}
                                  {template.twitter_url && <><br />Twitter: {template.twitter_url}</>}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'None'
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Volunteers</TableCell>
                        <TableCell>
                          {event.volunteers.length > 0 ? (
                            <ul>
                              {event.volunteers.map((volunteer) => (
                                <li key={volunteer.volunteer_id}>
                                  ID: {volunteer.volunteer_id}, Checkpoint: {volunteer.checkpoint}
                                  <br />
                                  Name: {volunteer.volunteer_data?.name ?? 'Unknown'}
                                  <br />
                                  Email: {volunteer.volunteer_data?.email ?? 'Unknown'}
                                  <br />
                                  Level: {volunteer.volunteer_data?.level ?? 'Unknown'}
                                  <br />
                                  Sent: {volunteer.volunteer_data?.sent ? 'Yes' : 'No'}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'None'
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default YourEventsPage;