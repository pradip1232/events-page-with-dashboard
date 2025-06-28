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
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  IconButton,
} from '@mui/material';

// Environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

// Form field type
interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

// Form data
interface Form {
  form_id: number;
  form_name: string;
  price: number | null;
  fields: FormField[];
}

// Event with forms
interface Event {
  event_id: number;
  event_name: string;
  forms: Form[];
}

// Modal state
interface ModalState {
  open: boolean;
  type: 'view' | 'modify';
  form: Form | null;
  fields: FormField[];
}

// Predefined options for State and Gender
const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const genderOptions = ['Male', 'Female', 'Other'];

const YourFormsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    type: 'view',
    form: null,
    fields: [],
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
    marginBottom: 2,
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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

  // Fetch forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        console.log('Initiating fetch request to:', `${API_BASE_URL}/events/get_form_data.php`);
        const response = await axios.get(`${API_BASE_URL}/events/get_form_data.php`, {
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
          console.log('Forms fetched successfully:', response.data.events);
          setEvents(response.data.events);
          setError(null);
        } else {
          throw new Error(response.data.error || 'Failed to fetch forms');
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

    fetchForms();
  }, [getCookie]);

  // Handle accordion toggle
  const handleAccordionChange = useCallback(
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      console.log(`Accordion ${panel} ${isExpanded ? 'expanded' : 'collapsed'}`);
    },
    []
  );

  // Open modal
  const handleOpenModal = useCallback((type: 'view' | 'modify', form: Form) => {
    setModalState({
      open: true,
      type,
      form,
      fields: form.fields || [],
    });
    console.log(`Opened ${type} modal for form ID ${form.form_id}`);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalState({
      open: false,
      type: 'view',
      form: null,
      fields: [],
    });
    setApiError(null);
    console.log('Closed modal');
  }, []);

  // Handle field change
  const handleFieldChange = useCallback((index: number, field: FormField) => {
    setModalState((prev) => {
      const updatedFields = [...(prev.fields || [])];
      updatedFields[index] = field;
      return { ...prev, fields: updatedFields };
    });
    console.log(`Updated field at index ${index}:`, field);
  }, []);

  // Add new field
  const handleAddField = useCallback(() => {
    setModalState((prev) => {
      const newField: FormField = {
        id: `field-${prev.fields.length}`,
        label: '',
        type: 'text',
        required: false,
      };
      return { ...prev, fields: [...prev.fields, newField] };
    });
    console.log('Added new field');
  }, []);

  // Remove field
  const handleRemoveField = useCallback((index: number) => {
    setModalState((prev) => {
      const updatedFields = prev.fields.filter((_, i) => i !== index);
      return { ...prev, fields: updatedFields };
    });
    console.log(`Removed field at index ${index}`);
  }, []);

  // Save fields
  const handleSaveFields = useCallback(async () => {
    if (!modalState.form) {
      console.error('No form selected for update');
      setApiError('No form selected');
      toast.error('No form selected');
      return;
    }

    // Validate fields
    const validFields = modalState.fields.filter((field) => field.label.trim() !== '');
    if (validFields.length === 0 && modalState.fields.length > 0) {
      console.error('All fields are empty');
      setApiError('At least one field must have a non-empty label');
      toast.error('At least one field must have a non-empty label');
      return;
    }

    const payload = {
      form_id: modalState.form.form_id,
      fields: validFields.map((field) => field.label),
    };

    console.log(`Saving fields for form ID ${modalState.form.form_id}:`, payload);

    try {
      const response = await axios.post(`${API_BASE_URL}/events/update_form_data.php`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });

      console.log('Update response:', {
        status: response.status,
        data: response.data,
      });

      if (response.data.status === 'success') {
        setEvents((prevEvents) =>
          prevEvents.map((event) => ({
            ...event,
            forms: event.forms.map((form) =>
              form.form_id === modalState.form!.form_id
                ? { ...form, fields: validFields }
                : form
            ),
          }))
        );
        setApiError(null);
        toast.success('Form fields updated successfully!');
        handleCloseModal();
      } else {
        throw new Error(response.data.error || 'Failed to update form fields');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' ? 'Server error: Invalid response' : err.message) ||
        'Server error';
      console.error('Update error:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
      });
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  }, [modalState.form, modalState.fields, getCookie, handleCloseModal]);

  return (
    <Box sx={{ padding: 4, backgroundColor: '#18181c', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 600, color: 'white', mb: 3 }}
      >
        Your Forms
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
          No forms found.
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
                {event.forms.length > 0 ? (
                  event.forms.map((form) => (
                    <Card key={form.form_id} sx={cardStyles}>
                      <CardContent>
                        <Typography sx={{ color: 'white' }}>
                          <strong>Form Name:</strong> {form.form_name}
                        </Typography>
                        <Typography sx={{ color: 'white' }}>
                          <strong>Price:</strong> {form.price ?? 'Free'}
                        </Typography>
                        <Typography sx={{ color: 'white' }}>
                          <strong>Fields:</strong>{' '}
                          {form.fields.length > 0
                            ? form.fields.map((field) => field.label).join(', ')
                            : 'No fields defined'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenModal('view', form)}
                            sx={{ color: 'white', borderColor: 'white' }}
                          >
                            View Form
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenModal('modify', form)}
                            sx={{ color: 'white', borderColor: 'white' }}
                          >
                            Modify Form Fields
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography color="text.secondary" sx={{ color: 'white' }}>
                    No forms for this event.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      <Dialog
        open={modalState.open}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        aria-labelledby="form-dialog-title"
        sx={{ '& .MuiDialog-paper': { backgroundColor: '#2c2c2e', color: 'white' } }}
      >
        <DialogTitle id="form-dialog-title" sx={{ color: 'white' }}>
          {modalState.type === 'view' ? 'View Form' : 'Modify Form Fields'} -{' '}
          {modalState.form?.form_name || 'Unknown'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: '#2c2c2e', color: 'white' }}>
          {apiError && (
            <Typography color="error" sx={{ mb: 2, color: '#ff6b6b' }}>
              Error: {apiError}
            </Typography>
          )}
          {modalState.fields.length > 0 ? (
            modalState.type === 'view' ? (
              <>
                <Typography sx={{ color: 'white', mb: 2 }}>
                  <strong>Form Name:</strong> {modalState.form?.form_name}
                </Typography>
                {modalState.form?.price !== null && (
                  <Typography sx={{ color: 'white', mb: 2 }}>
                    <strong>Price:</strong> {modalState.form?.price}
                  </Typography>
                )}
                <Grid container spacing={2}>
                  {modalState.fields.map((field, index) => (
                    <Grid item xs={12} key={field.id || index}>
                      {field.label === 'State' ? (
                        <TextField
                          fullWidth
                          label="State"
                          select
                          value=""
                          sx={textFieldStyles}
                          disabled
                        >
                          {indianStates.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : field.label === 'Gender' ? (
                        <TextField
                          fullWidth
                          label="Gender"
                          select
                          value=""
                          sx={textFieldStyles}
                          disabled
                        >
                          {genderOptions.map((gender) => (
                            <MenuItem key={gender} value={gender}>
                              {gender}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : field.label === 'Phone Number' ? (
                        <TextField
                          fullWidth
                          label={field.label}
                          type="tel"
                          value=""
                          sx={textFieldStyles}
                          disabled
                        />
                      ) : (
                        <TextField
                          fullWidth
                          label={`${field.label} (${field.type})`}
                          type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                          value=""
                          sx={textFieldStyles}
                          disabled
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <Grid container spacing={1}>
                  {modalState.fields.map((field, index) => (
                    <Grid container spacing={1} key={field.id || index} sx={{ mb: 1, alignItems: 'center' }}>
                      <Grid item xs={4}>
                        <TextField
                          label="Field Name"
                          value={field.label || ''}
                          onChange={(e) => handleFieldChange(index, { ...field, label: e.target.value })}
                          fullWidth
                          margin="dense"
                          sx={textFieldStyles}
                          error={field.label.trim() === '' && field.label !== ''}
                          helperText={field.label.trim() === '' && field.label !== '' ? 'Field name is required' : ''}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          select
                          label="Field Type"
                          value={field.type || 'text'}
                          onChange={(e) => handleFieldChange(index, { ...field, type: e.target.value })}
                          fullWidth
                          margin="dense"
                          sx={textFieldStyles}
                        >
                          {['text', 'number', 'email', 'tel'].map((type) => (
                            <MenuItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Required"
                          value={field.required ? 'Yes' : 'No'}
                          onChange={(e) =>
                            handleFieldChange(index, { ...field, required: e.target.value === 'Yes' })
                          }
                          select
                          SelectProps={{ native: true }}
                          fullWidth
                          margin="dense"
                          sx={textFieldStyles}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          onClick={() => handleRemoveField(index)}
                          sx={{ color: 'white' }}
                        >
                          <i
                            className="bi bi-trash"
                            style={{ color: 'white', fontSize: '24px', border: '1px solid white' }}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <IconButton
                    color="primary"
                    onClick={handleAddField}
                    disabled={
                      modalState.fields.length > 0 &&
                      modalState.fields[modalState.fields.length - 1].label.trim() === ''
                    }
                    sx={{ color: 'white' }}
                  >
                    <i
                      className="bi bi-plus"
                      style={{ color: 'white', fontSize: '24px', border: '1px solid white' }}
                    />
                  </IconButton>
                </Grid>
              </>
            )
          ) : (
            <Typography color="text.secondary" sx={{ color: 'white' }}>
              No fields to display.{' '}
              {modalState.type === 'modify' && (
                <Button
                  onClick={handleAddField}
                  sx={{ color: 'white', borderColor: 'white', ml: 1 }}
                >
                  Add Field
                </Button>
              )}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#2c2c2e' }}>
          {modalState.type === 'modify' && (
            <Button
              onClick={handleSaveFields}
              sx={{ color: 'white', borderColor: 'white' }}
              disabled={
                modalState.fields.length > 0 &&
                modalState.fields[modalState.fields.length - 1].label.trim() === ''
              }
            >
              Save
            </Button>
          )}
          <Button onClick={handleCloseModal} sx={{ color: 'white', borderColor: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default YourFormsPage;