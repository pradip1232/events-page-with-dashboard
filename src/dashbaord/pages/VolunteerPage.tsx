import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  IconButton,
  MenuItem,
} from '@mui/material';

// Environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

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

const VolunteerPage = () => {
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

  // Card styles
  const cardStyles = {
    backgroundColor: '#2c2c2e',
    color: 'white',
    marginBottom: 1,
    border: '1px solid white',
  };

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
      try {
        setLoading(true);
        console.log('Initiating fetch request to:', `${API_BASE_URL}/events/get_volunteer_data.php`);
        const response = await axios.get(`${API_BASE_URL}/events/get_volunteer_data.php`, {
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
        const errorMessage = err.response?.data?.error || err.message || 'Server error';
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
      const errorMessage = err.response?.data?.error || err.message || 'Server error';
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
        const errorMessage = err.response?.data?.error || err.message || 'Server error';
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
    <Box sx={{ padding: 4, backgroundColor: '#18181c', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 600, color: 'white', mb: 3 }}
      >
        Volunteers
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 3, color: '#ff6b6b', textAlign: 'center' }}>
          Error: {error}
        </Typography>
      ) : events.length === 0 ? (
        <Typography sx={{ mt: 3, color: 'white', textAlign: 'center' }}>
          No events found.
        </Typography>
      ) : (
        <Box sx={{ maxWidth: 600, margin: 'auto' }}>
          {events.map((event) => (
            <Accordion
              key={event.event_id}
              expanded={expanded === `event-${event.event_id}`}
              onChange={handleAccordionChange(`event-${event.event_id}`)}
              sx={{
                mb: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#2c2c2e',
                color: 'white',
              }}
            >
              <AccordionSummary
                expandIcon={
                  <i
                    className="bi bi-chevron-down"
                    style={{ color: 'white', fontSize: '24px', border: '1px solid white' }}
                  />
                }
                aria-controls={`event-${event.event_id}-content`}
                id={`event-${event.event_id}-header`}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {event.event_name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {event.volunteers.length > 0 ? (
                  <Box>
                    {event.volunteers.map((volunteer) => (
                      <Card
                        key={`${event.event_id}-${volunteer.volunteer_id}`}
                        sx={cardStyles}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white' }}>
                              Name: {volunteer.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Email: {volunteer.email}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Level: {volunteer.level}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Checkpoint: {volunteer.checkpoint}
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={() => handleRemoveVolunteer(event.event_id, volunteer.volunteer_id, volunteer.email)}
                            sx={{ color: 'white' }}
                          >
                            <i
                              className="bi bi-trash"
                              style={{ color: 'white', fontSize: '24px', border: '1px solid white' }}
                            />
                          </IconButton>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: 'white' }}>No volunteers for this event.</Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModal(event.event_id)}
                    sx={{ color: 'white', borderColor: 'white' }}
                    startIcon={
                      <i
                        className="bi bi-plus"
                        style={{ color: 'white', fontSize: '24px', border: '1px solid white' }}
                      />
                    }
                  >
                    Add Volunteer
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      <Dialog
        open={modalState.open}
        onClose={handleCloseModal}
        maxWidth="sm">
        <DialogTitle id="add-volunteer-dialog-title" sx={{ color: 'white' }}>
          Add Volunteer
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: '#2c2c2e', color: 'white' }}>
          {apiError && (
            <Typography color="error" sx={{ mb: 2, color: '#ff6b6b' }}>
              Error: {apiError}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={modalState.volunteer.name}
              onChange={(e) => handleVolunteerChange('name', e.target.value)}
              sx={textFieldStyles}
              error={!modalState.volunteer.name.trim() && modalState.volunteer.name !== ''}
              helperText={!modalState.volunteer.name.trim() && modalState.volunteer.name !== '' ? 'Name is required' : ''}
            />
            <TextField
              fullWidth
              label="Email"
              value={modalState.volunteer.email}
              onChange={(e) => handleVolunteerChange('email', e.target.value)}
              sx={textFieldStyles}
              type="email"
              error={!isValidEmail(modalState.volunteer.email) && modalState.volunteer.email !== ''}
              helperText={!isValidEmail(modalState.volunteer.email) && modalState.volunteer.email !== '' ? 'Invalid email format' : ''}
            />
            <TextField
              fullWidth
              label="Level"
              select
              value={modalState.volunteer.level}
              onChange={(e) => handleVolunteerChange('level', e.target.value)}
              sx={textFieldStyles}
            >
              {levelOptions.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Password (optional)"
              value={modalState.volunteer.password}
              onChange={(e) => handleVolunteerChange('password', e.target.value)}
              sx={textFieldStyles}
              type="password"
              error={modalState.volunteer.password !== '' && modalState.volunteer.password.length < 8}
              helperText={modalState.volunteer.password !== '' && modalState.volunteer.password.length < 8 ? 'Password must be at least 8 characters' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#2c2c2e' }}>
          <Button
            onClick={handleAddVolunteer}
            sx={{ color: 'white', borderColor: 'white' }}
            disabled={!modalState.volunteer.name.trim() || !isValidEmail(modalState.volunteer.email)}
          >
            Add
          </Button>
          <Button onClick={handleCloseModal} sx={{ color: 'white', borderColor: 'white' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VolunteerPage;