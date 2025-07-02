import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Typography,
  StepConnector,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  MenuItem,
  FormHelperText,
  Checkbox,
  Grid,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { stepConnectorClasses } from '@mui/material/StepConnector';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

// Interfaces
interface SavedForm {
  id: number;
  formName: string;
  price?: number;
  fields: string[];
}

interface Volunteer {
  name: string;
  email: string;
  level: string;
  password: string;
  sent: boolean;
}

interface FormValues {
  eventType: string;
  eventName: string;
  startDateTime: string | null;
  endDateTime: string | null;
  checkpoints: string;
  guestRegistrationType: string;
  eventDescription: string;
  eventCategory: string;
  venueLocation: string;
  organizationName: string;
  organizationEmail: string;
  organizationPhone: string;
  maxAttendance: string;
  registrationDeadline: string | null;
  formName: string;
  price: number | null;
  selectedFields: string[];
  customFields: { name: string; type: string }[];
  templateType: string;
  emailContent: string;
  brandingAssets: File | null;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  volunteers: { [key: string]: Volunteer[] };
  sendingInvitations: { [key: string]: boolean };
}

// Step labels
const steps = ['Event Type', 'Event Details', 'Additional Details', 'Form Creation', 'Email Template', 'Volunteer Invitation', 'Submission'];

// Custom styled connectors and step icons
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundImage: 'linear-gradient(95deg, #f27121 0%, #e94057 50%, #8a2387 100%)',
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundImage: 'linear-gradient(95deg, #f27121 0%, #e94057 50%, #8a2387 100%)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

const ColorlibStepIcon = (props: any) => {
  const { active, completed, className, icon } = props;

  const icons: Record<string, React.ReactElement> = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
    4: <SettingsIcon />,
    5: <GroupAddIcon />,
    6: <VideoLabelIcon />,
    7: <SettingsIcon />,
  };

  return (
    <ColorlibStepIconRoot
      className={className}
      style={{
        backgroundImage:
          active || completed
            ? 'linear-gradient(136deg, #f27121 0%, #e94057 50%, #8a2387 100%)'
            : undefined,
        boxShadow: active ? '0 4px 10px 0 rgba(0,0,0,.25)' : undefined,
      }}
    >
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
};

// Constants
const predefinedFields = ['Name', 'Email', 'Date of Birth', 'State', 'Gender', 'Phone Number'];
const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
];
const indianStates = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'];
const genderOptions = ['Male', 'Female', 'Other'];
const templateTypes = ['Normal', 'Graphical'];

const volunteerLevels = ['Beginner', 'Intermediate', 'Expert'];

// Common styles
const textFieldStyles = {
  input: { color: 'white' },
  label: { color: 'white' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'white' },
    '&:hover fieldset': { borderColor: 'white' },
    '&.Mui-focused fieldset': { borderColor: 'white' },
  },
  '& .MuiFormHelperText-root': { color: 'white' },
  '& .MuiSelect-icon': { color: 'white' },
};

// Volunteer TextField Component
const VolunteerTextField = ({
  label,
  value,
  onChange,
  error,
  helperText,
  selectOptions,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  helperText: string;
  selectOptions?: string[];
  type?: string;
}) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    error={error}
    helperText={helperText}
    select={!!selectOptions}
    type={type}
    sx={{ ...textFieldStyles, flex: 1 }}
    fullWidth
  >
    {selectOptions?.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost';
// console.log("API BASE URL ", API_BASE_URL);

// Main Component
const EventsPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [savedForms, setSavedForms] = React.useState<SavedForm[]>([]);
  const [currentFormFields, setCurrentFormFields] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState(0);

  const formik = useFormik<FormValues>({
    initialValues: {
      eventType: '',
      eventName: '',
      startDateTime: null,
      endDateTime: null,
      checkpoints: '',
      guestRegistrationType: '',
      eventDescription: '',
      eventCategory: '',
      venueLocation: '',
      organizationName: '',
      organizationEmail: '',
      organizationPhone: '',
      maxAttendance: '',
      registrationDeadline: null,
      formName: '',
      price: null,
      selectedFields: [],
      customFields: [],
      templateType: '',
      emailContent: '',
      brandingAssets: null,
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      volunteers: {},
      sendingInvitations: {},
    },
    validationSchema: (() => {
      const validationSchemas = [
        Yup.object({
          eventType: Yup.string().required('Event type is required'),
        }),
        Yup.object({
          eventName: Yup.string().required('Event name is required'),
          startDateTime: Yup.date().required('Start date and time is required').nullable(),
          endDateTime: Yup.date()
            .required('End date and time is required')
            .nullable()
            .min(Yup.ref('startDateTime'), 'End date must be after start date'),
          checkpoints: Yup.number()
            .required('Number of checkpoints is required')
            .min(1, 'At least one checkpoint is required'),
          guestRegistrationType: Yup.string().required('Guest registration type is required'),
        }),
        Yup.object({
          eventDescription: Yup.string().required('Event description is required'),
          eventCategory: Yup.string().required('Event category is required'),
          venueLocation: Yup.string().required('Venue location is required'),
          organizationName: Yup.string().required('Organization name is required'),
          organizationEmail: Yup.string()
            .email('Invalid email format')
            .required('Organization email is required'),
          organizationPhone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be 10 digits')
            .required('Organization phone is required'),
          maxAttendance: Yup.number()
            .required('Maximum attendance is required')
            .min(1, 'At least one attendee is required'),
        }),
        Yup.object({
          formName: Yup.string().required('Form name is required'),
          price: Yup.number().when('eventType', {
            is: 'paid',
            then: Yup.number()
              .required('Price is required for paid events')
              .min(0, 'Price must be non-negative'),
            otherwise: Yup.number().nullable(),
          }),
          customFields: Yup.array().of(
            Yup.object({
              name: Yup.string().required('Field name is required'),
              type: Yup.string().required('Field type is required'),
            })
          ),
        }),
        Yup.object({
          templateType: Yup.string().required('Template type is required'),
          emailContent: Yup.string().required('Email content is required'),
          facebookUrl: Yup.string().url('Invalid URL format').nullable(),
          instagramUrl: Yup.string().url('Invalid URL format').nullable(),
          twitterUrl: Yup.string().url('Invalid URL format').nullable(),
        }),
        Yup.object({
          volunteers: Yup.object().test(
            'at-least-one-volunteer-per-checkpoint',
            'At least one valid volunteer is required for each checkpoint',
            (value) => {
              const checkpointCount = parseInt(formik.values.checkpoints) || 0;
              for (let i = 1; i <= checkpointCount; i++) {
                const checkpointVolunteers = value?.[i.toString()] || [];
                if (checkpointVolunteers.length === 0) {
                  return false;
                }
                for (const volunteer of checkpointVolunteers) {
                  if (
                    !volunteer.name ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(volunteer.email) ||
                    !['Beginner', 'Intermediate', 'Expert'].includes(volunteer.level) ||
                    volunteer.password.length < 8
                  ) {
                    return false;
                  }
                }
              }
              return true;
            }
          ),
        }),
        Yup.object({}),
      ];
      return validationSchemas[activeStep];
    })(),

    onSubmit: async (values) => {


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
      if (activeStep === steps.length - 1) {
        try {
          // Structure data according to stepper
          const formData = {
            user_id: user_id,
            step1: {
              eventType: values.eventType,
            },
            step2: {
              eventName: values.eventName,
              startDateTime: values.startDateTime || '',
              endDateTime: values.endDateTime || '',
              checkpoints: parseInt(values.checkpoints) || 0,
              guestRegistrationType: values.guestRegistrationType,
            },
            step3: {
              eventDescription: values.eventDescription,
              eventCategory: values.eventCategory,
              venueLocation: values.venueLocation,
              organizationName: values.organizationName,
              organizationEmail: values.organizationEmail,
              organizationPhone: values.organizationPhone,
              maxAttendance: parseInt(values.maxAttendance) || 0,
              registrationDeadline: values.registrationDeadline || '',
            },
            step4: {
              savedForms,
            },
            step5: {
              templateType: values.templateType,
              emailContent: values.emailContent,
              brandingAssets: values.brandingAssets ? values.brandingAssets.name : null,
              facebookUrl: values.facebookUrl || '',
              instagramUrl: values.instagramUrl || '',
              twitterUrl: values.twitterUrl || '',
            },
            step6: {
              volunteers: values.volunteers,
            },
          };

          // Log data to console
          console.log('Submitting Form Data:', JSON.stringify(formData, null, 2));
        
        
          const response = await axios.post(`${API_BASE_URL}/events/add_events.php`, formData, {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCookie('csrftoken') || '',
            },
          });

          // Log response for debugging
          console.log('Server Response:', response.data);

          // Check if message exists
          if (!response.data.message) {
            throw new Error('No message in server response');
          }

          alert('Event created successfully: Event ID ' + (response.data.event_id || 'N/A'));
          setActiveStep(0);
          formik.resetForm();
          setSavedForms([]);
          setCurrentFormFields([]);
        } catch (error: any) {
          console.error('Submission Error:', error);
          alert('Error creating event: ' + (error.response?.data?.error || error.message || 'Server error. Please try again.'));
        }
      } else if (activeStep === 3 && savedForms.length === 0) {
        alert('Please create one form then you can go to the next step');
      } else {
        setActiveStep((prev) => prev + 1);
      }
    },
  });

  const getCookie = React.useCallback((name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }, []);

  const handleBack = React.useCallback(() => {
    setActiveStep((prev) => prev - 1);
    if (activeStep === 3) {
      formik.setFieldValue('selectedFields', []);
      formik.setFieldValue('customFields', []);
      setCurrentFormFields([]);
    }
  }, [activeStep, formik]);

  const handleFieldSelection = React.useCallback(
    (field: string) => {
      const selected = formik.values.selectedFields.includes(field)
        ? formik.values.selectedFields.filter((f) => f !== field)
        : [...formik.values.selectedFields, field];
      formik.setFieldValue('selectedFields', selected);
    },
    [formik]
  );

  const handleCustomFieldChange = React.useCallback(
    (index: number, key: string, value: string) => {
      const updatedFields = [...formik.values.customFields];
      updatedFields[index] = { ...updatedFields[index], [key]: value };
      formik.setFieldValue('customFields', updatedFields);
    },
    [formik]
  );

  const addCustomField = React.useCallback(() => {
    const lastField = formik.values.customFields[formik.values.customFields.length - 1];
    if (lastField && lastField.name.trim() === '') return;
    formik.setFieldValue('customFields', [...formik.values.customFields, { name: '', type: 'text' }]);
  }, [formik]);

  const handleSubmitSelection = React.useCallback(() => {
    const allFields = [
      ...formik.values.selectedFields,
      ...formik.values.customFields.map((f) => f.name).filter((name) => name.trim() !== ''),
    ];
    setCurrentFormFields(allFields);
  }, [formik]);

  const handleSaveForm = React.useCallback(() => {
    const newForm = {
      id: savedForms.length + 1,
      formName: formik.values.formName,
      price: formik.values.eventType === 'paid' ? Number(formik.values.price) : undefined,
      fields: currentFormFields,
    };
    setSavedForms([...savedForms, newForm]);
    formik.setFieldValue('formName', '');
    formik.setFieldValue('price', null);
    formik.setFieldValue('selectedFields', []);
    formik.setFieldValue('customFields', []);
    setCurrentFormFields([]);
    alert('Form saved successfully!');
    if (savedForms.length === 0) {
      setActiveStep((prev) => prev + 1);
    }
  }, [formik, currentFormFields, savedForms]);

  const handleViewForm = React.useCallback(
    (form: SavedForm) => {
      setCurrentFormFields(form.fields);
      formik.setFieldValue('formName', form.formName);
      formik.setFieldValue('price', form.price || null);
      formik.setFieldValue('selectedFields', form.fields);
      formik.setFieldValue('customFields', []);
    },
    [formik]
  );

  const handleAddVolunteer = (checkpoint: string) => {
    const newVolunteer = { name: '', email: '', level: '', password: '', sent: false };
    formik.setFieldValue('volunteers', {
      ...formik.values.volunteers,
      [checkpoint]: [...(formik.values.volunteers[checkpoint] || []), newVolunteer],
    });
  };

  const handleVolunteerChange = (checkpoint: string, index: number, field: keyof Volunteer, value: string) => {
    const updatedVolunteers = [...(formik.values.volunteers[checkpoint] || [])];
    updatedVolunteers[index] = { ...updatedVolunteers[index], [field]: value };
    formik.setFieldValue('volunteers', {
      ...formik.values.volunteers,
      [checkpoint]: updatedVolunteers,
    });
  };

  const handleRemoveVolunteer = (checkpoint: string, index: number) => {
    const updatedVolunteers = (formik.values.volunteers[checkpoint] || []).filter((_, i) => i !== index);
    formik.setFieldValue('volunteers', {
      ...formik.values.volunteers,
      [checkpoint]: updatedVolunteers,
    });
    formik.setFieldValue('sendingInvitations', {
      ...formik.values.sendingInvitations,
      [`${checkpoint}_${index}`]: false,
    });
  };

  const handleSendInvitation = async (checkpoint: string, volIndex: number, volunteer: Volunteer) => {
    const key = `${checkpoint}_${volIndex}`;
    if (!formik.values.eventName || !formik.values.startDateTime || !formik.values.endDateTime) {
      alert('Please fill in event name, start date, and end date in Event Details step.');
      return;
    }

    formik.setFieldValue('sendingInvitations', {
      ...formik.values.sendingInvitations,
      [key]: true,
    });

    try {
      const payload = {
        eventName: formik.values.eventName,
        startDateTime: formik.values.startDateTime,
        endDateTime: formik.values.endDateTime,
        checkpoint,
        volunteer,
      };
      const response = await axios.post(`${API_BASE_URL}/events/send_mail_volunteer.php`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') || '',
        },
      });
      if (response.data.status === 'success') {
        const updatedVolunteers = [...(formik.values.volunteers[checkpoint] || [])];
        updatedVolunteers[volIndex] = { ...updatedVolunteers[volIndex], sent: true };
        formik.setFieldValue('volunteers', {
          ...formik.values.volunteers,
          [checkpoint]: updatedVolunteers,
        });
        alert('Invitation sent successfully!');
      } else {
        alert('Error sending invitation: ' + response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Server error. Please try again.';
      alert('Error sending invitation: ' + errorMessage);
    } finally {
      formik.setFieldValue('sendingInvitations', {
        ...formik.values.sendingInvitations,
        [key]: false,
      });
    }
  };

  const isVolunteerValid = (volunteer: Volunteer) => {
    return (
      volunteer.name &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(volunteer.email) &&
      ['Beginner', 'Intermediate', 'Expert'].includes(volunteer.level) &&
      volunteer.password.length >= 8
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box textAlign="center" mt={3}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Select Event Type
            </Typography>
            <FormControl component="fieldset" error={!!formik.errors.eventType}>
              <RadioGroup
                row
                name="eventType"
                value={formik.values.eventType}
                onChange={formik.handleChange}
                sx={{ justifyContent: 'center', gap: 2 }}
              >
                {['free', 'paid'].map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <Box
                        px={3}
                        py={1.5}
                        sx={{
                          borderRadius: '8px',
                          background:
                            formik.values.eventType === type
                              ? 'linear-gradient(92.51deg, #FF9898 0.48%, rgba(153, 24, 192, 0.533333) 100%)'
                              : '#f0f0f0',
                          color: formik.values.eventType === type ? '#fff' : '#000',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.3s',
                          border: '2px solid transparent',
                          '&:hover': {
                            background:
                              formik.values.eventType === type
                                ? 'linear-gradient(92.51deg, #FF9898 0.48%, rgba(153, 24, 192, 0.533333) 100%)'
                                : '#e0e0e0',
                          },
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
              {formik.errors.eventType && (
                <FormHelperText sx={{ color: 'white' }}>{formik.errors.eventType}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <TextField
              label="Event Name"
              name="eventName"
              value={formik.values.eventName}
              onChange={formik.handleChange}
              error={!!formik.errors.eventName}
              helperText={formik.errors.eventName}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              label="Start Date & Time"
              name="startDateTime"
              type="datetime-local"
              value={formik.values.startDateTime || ''}
              onChange={formik.handleChange}
              error={!!formik.errors.startDateTime}
              helperText={formik.errors.startDateTime}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              label="End Date & Time"
              name="endDateTime"
              type="datetime-local"
              value={formik.values.endDateTime || ''}
              onChange={formik.handleChange}
              error={!!formik.errors.endDateTime}
              helperText={formik.errors.endDateTime}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              label="Number of Checkpoints"
              name="checkpoints"
              type="number"
              value={formik.values.checkpoints}
              onChange={formik.handleChange}
              error={!!formik.errors.checkpoints}
              helperText={formik.errors.checkpoints}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              // select
              label="Guest Registration Type"
              name="guestRegistrationType"
              value={formik.values.guestRegistrationType}
              onChange={formik.handleChange}
              error={!!formik.errors.guestRegistrationType}
              helperText={formik.errors.guestRegistrationType}
              fullWidth
              sx={textFieldStyles}
            >
              {/* <MenuItem value="open">Open</MenuItem>
              <MenuItem value="invite-only">Invite Only</MenuItem> */}
            </TextField>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2}>
            <TextField
              label="Event Description"
              name="eventDescription"
              value={formik.values.eventDescription}
              onChange={formik.handleChange}
              error={!!formik.errors.eventDescription}
              helperText={formik.errors.eventDescription}
              multiline
              rows={4}
              fullWidth
              sx={{ ...textFieldStyles, textarea: { color: 'white' } }}
            />
            <TextField
              select
              label="Event Category"
              name="eventCategory"
              value={formik.values.eventCategory}
              onChange={formik.handleChange}
              error={!!formik.errors.eventCategory}
              helperText={formik.errors.eventCategory}
              fullWidth
              sx={textFieldStyles}
            >
              <MenuItem value="conference">Conference</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="social">Social</MenuItem>
            </TextField>
            <TextField
              label="Venue Location"
              name="venueLocation"
              value={formik.values.venueLocation}
              onChange={formik.handleChange}
              error={!!formik.errors.venueLocation}
              helperText={formik.errors.venueLocation}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              label="Organization Name"
              name="organizationName"
              value={formik.values.organizationName}
              onChange={formik.handleChange}
              error={!!formik.errors.organizationName}
              helperText={formik.errors.organizationName}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              label="Organization Email"
              name="organizationEmail"
              value={formik.values.organizationEmail}
              onChange={formik.handleChange}
              error={!!formik.errors.organizationEmail}
              helperText={formik.errors.organizationEmail}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              label="Organization Phone"
              name="organizationPhone"
              value={formik.values.organizationPhone}
              onChange={formik.handleChange}
              error={!!formik.errors.organizationPhone}
              helperText={formik.errors.organizationPhone}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              label="Maximum Attendance"
              name="maxAttendance"
              type="number"
              value={formik.values.maxAttendance}
              onChange={formik.handleChange}
              error={!!formik.errors.maxAttendance}
              helperText={formik.errors.maxAttendance}
              fullWidth
              sx={textFieldStyles}
            />
            <TextField
              label="Registration Deadline"
              name="registrationDeadline"
              type="datetime-local"
              value={formik.values.registrationDeadline || ''}
              onChange={formik.handleChange}
              error={!!formik.errors.registrationDeadline}
              helperText={formik.errors.registrationDeadline}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={textFieldStyles}
            />
          </Stack>
        );
      case 3:
        return (
          <CardContent sx={{ padding: 4, backgroundColor: '#18181c' }}>
            <Typography
              variant="h6"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: 600, color: 'white', marginBottom: 3 }}
            >
              Form Creation
            </Typography>
            <Box sx={{ maxWidth: 600, margin: 'auto' }}>
              <Stack spacing={2} mb={3}>
                <TextField
                  label="Form Name"
                  name="formName"
                  value={formik.values.formName}
                  onChange={formik.handleChange}
                  error={!!formik.errors.formName}
                  helperText={formik.errors.formName}
                  fullWidth
                  sx={textFieldStyles}
                />
                {formik.values.eventType === 'paid' && (
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formik.values.price || ''}
                    onChange={formik.handleChange}
                    error={!!formik.errors.price}
                    helperText={formik.errors.price}
                    fullWidth
                    sx={textFieldStyles}
                  />
                )}
              </Stack>
              {currentFormFields.length === 0 ? (
                <>
                  <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                    Select Fields for the Form
                  </Typography>
                  <Grid container spacing={1}>
                    {predefinedFields.map((field, index) => (
                      <Grid item xs={6} key={index}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.selectedFields.includes(field)}
                              onChange={() => handleFieldSelection(field)}
                              sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                            />
                          }
                          label={<Typography sx={{ color: 'white' }}>{field}</Typography>}
                        />
                      </Grid>
                    ))}
                    <Typography variant="h6" gutterBottom sx={{ width: '100%', mt: 2, color: 'white' }}>
                      Custom Fields
                    </Typography>
                    {formik.values.customFields.map((field, index) => (
                      <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                        <Grid item xs={6}>
                          <TextField
                            label="Field Name"
                            value={field.name}
                            onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                            error={!!formik.errors.customFields?.[index]?.name}
                            helperText={formik.errors.customFields?.[index]?.name}
                            fullWidth
                            sx={textFieldStyles}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            select
                            label="Field Type"
                            value={field.type}
                            onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
                            error={!!formik.errors.customFields?.[index]?.type}
                            helperText={formik.errors.customFields?.[index]?.type}
                            fullWidth
                            sx={textFieldStyles}
                          >
                            {fieldTypes.map((item) => (
                              <MenuItem key={item.value} value={item.value}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <IconButton
                        color="primary"
                        onClick={addCustomField}
                        disabled={
                          formik.values.customFields.length > 0 &&
                          formik.values.customFields[formik.values.customFields.length - 1].name.trim() === ''
                        }
                        sx={{ color: 'white' }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitSelection}
                    sx={{ mt: 2 }}
                  >
                    Generate Form
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                    Generated Form
                  </Typography>
                  <Typography sx={{ color: 'white', mb: 2 }}>
                    <strong>Form Name:</strong> {formik.values.formName}
                  </Typography>
                  {formik.values.eventType === 'paid' && (
                    <Typography sx={{ color: 'white', mb: 2 }}>
                      <strong>Price:</strong> {formik.values.price}
                    </Typography>
                  )}
                  <Grid container spacing={2}>
                    {currentFormFields.map((field, index) => {
                      const customField = formik.values.customFields.find((f) => f.name === field);
                      const label = customField ? `${field} (${customField.type})` : field;
                      return (
                        <Grid item xs={12} key={index}>
                          {field === 'State' ? (
                            <TextField
                              fullWidth
                              label="State"
                              select
                              value=""
                              sx={textFieldStyles}
                            >
                              {indianStates.map((state) => (
                                <MenuItem key={state} value={state}>
                                  {state}
                                </MenuItem>
                              ))}
                            </TextField>
                          ) : field === 'Gender' ? (
                            <TextField
                              fullWidth
                              label="Gender"
                              select
                              value=""
                              sx={textFieldStyles}
                            >
                              {genderOptions.map((gender) => (
                                <MenuItem key={gender} value={gender}>
                                  {gender}
                                </MenuItem>
                              ))}
                            </TextField>
                          ) : field === 'Phone Number' ? (
                            <TextField
                              fullWidth
                              label={label}
                              type="text"
                              value=""
                              sx={textFieldStyles}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              label={label}
                              type={customField?.type === 'number' ? 'number' : 'text'}
                              value=""
                              sx={textFieldStyles}
                            />
                          )}
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveForm}
                    sx={{ mt: 2, mr: 1 }}
                  >
                    Save Form
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setCurrentFormFields([]);
                      formik.setFieldValue('formName', '');
                      formik.setFieldValue('price', null);
                      formik.setFieldValue('selectedFields', []);
                      formik.setFieldValue('customFields', []);
                    }}
                    sx={{ mt: 2, color: 'white', borderColor: 'white' }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {savedForms.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                    Saved Forms
                  </Typography>
                  {savedForms.map((form) => (
                    <Card
                      key={form.id}
                      sx={{
                        mt: 2,
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        backgroundColor: '#2c2c2e',
                      }}
                    >
                      <CardContent>
                        <Typography sx={{ color: 'white' }}>
                          <strong>Form Name:</strong> {form.formName}
                        </Typography>
                        {form.price !== undefined && (
                          <Typography sx={{ color: 'white' }}>
                            <strong>Price:</strong> {form.price}
                          </Typography>
                        )}
                        <Typography sx={{ color: 'white' }}>
                          <strong>Fields:</strong> {form.fields.join(', ')}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleViewForm(form)}
                          sx={{ mt: 1, color: 'white', borderColor: 'white' }}
                        >
                          View Form
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Box>
          </CardContent>
        );
      case 4:
        return (
          <Box sx={{ maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
              Create Email Template
            </Typography>
            <Stack spacing={2}>
              <TextField
                select
                label="Template Type"
                name="templateType"
                value={formik.values.templateType}
                onChange={formik.handleChange}
                error={!!formik.errors.templateType}
                helperText={formik.errors.templateType}
                fullWidth
                sx={textFieldStyles}
              >
                {templateTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Email Content"
                name="emailContent"
                multiline
                rows={5}
                value={formik.values.emailContent}
                onChange={formik.handleChange}
                error={!!formik.errors.emailContent}
                helperText={formik.errors.emailContent}
                fullWidth
                sx={{ ...textFieldStyles, textarea: { color: 'white' } }}
              />
              <TextField
                label="Branding Assets"
                type="file"
                name="brandingAssets"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const files = event.target.files;
                  formik.setFieldValue('brandingAssets', files ? files[0] : null);
                }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={textFieldStyles}
              />
              <TextField
                label="Facebook URL"
                name="facebookUrl"
                value={formik.values.facebookUrl}
                onChange={formik.handleChange}
                error={!!formik.errors.facebookUrl}
                helperText={formik.errors.facebookUrl}
                fullWidth
                sx={textFieldStyles}
              />
              <TextField
                label="Instagram URL"
                name="instagramUrl"
                value={formik.values.instagramUrl}
                onChange={formik.handleChange}
                error={!!formik.errors.instagramUrl}
                helperText={formik.errors.instagramUrl}
                fullWidth
                sx={textFieldStyles}
              />
              <TextField
                label="Twitter URL"
                name="twitterUrl"
                value={formik.values.twitterUrl}
                onChange={formik.handleChange}
                error={!!formik.errors.twitterUrl}
                helperText={formik.errors.twitterUrl}
                fullWidth
                sx={textFieldStyles}
              />
            </Stack>
            <Typography variant="h6" sx={{ color: 'white', mt: 3, mb: 2 }}>
              Email Template Preview
            </Typography>
            <Card sx={{ backgroundColor: '#2c2c2e', borderRadius: '8px' }}>
              <CardContent>
                <Typography sx={{ color: 'white' }}>
                  <strong>Template Type:</strong> {formik.values.templateType || 'Not set'}
                </Typography>
                <Typography sx={{ color: 'white', mt: 1 }}>
                  <strong>Email Content:</strong> {formik.values.emailContent || 'No content'}
                </Typography>
                <Typography sx={{ color: 'white', mt: 1 }}>
                  <strong>Branding Assets:</strong> {formik.values.brandingAssets ? formik.values.brandingAssets.name : 'None'}
                </Typography>
                <Typography sx={{ color: 'white', mt: 1 }}>
                  <strong>Facebook URL:</strong> {formik.values.facebookUrl || 'None'}
                </Typography>
                <Typography sx={{ color: 'white', mt: 1 }}>
                  <strong>Instagram URL:</strong> {formik.values.instagramUrl || 'None'}
                </Typography>
                <Typography sx={{ color: 'white', mt: 1 }}>
                  <strong>Twitter URL:</strong> {formik.values.twitterUrl || 'None'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      case 5:
        const checkpointCount = parseInt(formik.values.checkpoints) || 0;
        const volunteerFields = [
          {
            key: 'name',
            label: 'Volunteer Name',
            validate: (value: string) => !value,
            errorText: 'Name is required',
            type: 'text',
          },
          {
            key: 'email',
            label: 'Volunteer Email',
            validate: (value: string) => value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            errorText: 'Invalid email format',
            type: 'email',
          },
          {
            key: 'level',
            label: 'Volunteer Level',
            validate: (value: string) => !['Beginner', 'Intermediate', 'Expert'].includes(value),
            errorText: 'Level is required',
            selectOptions: volunteerLevels,
            type: 'text',
          },
          {
            key: 'password',
            label: 'Volunteer Password',
            validate: (value: string) => value.length < 8,
            errorText: 'Password must be at least 8 characters',
            type: 'password',
          },
        ] as const;

        return (
          <Box sx={{ maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
              Volunteer Invitation
            </Typography>
            {checkpointCount > 0 ? (
              <>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  sx={{
                    mb: 3,
                    '& .MuiTab-root': { color: 'white' },
                    '& .Mui-selected': { color: 'white', fontWeight: 'bold' },
                    '& .MuiTabs-indicator': { backgroundColor: 'white' },
                  }}
                >
                  {Array.from({ length: checkpointCount }, (_, i) => (
                    <Tab key={i} label={`Checkpoint ${i + 1}`} />
                  ))}
                </Tabs>
                {Array.from({ length: checkpointCount }, (_, i) => i + 1).map((checkpoint, index) => (
                  <Box key={checkpoint} hidden={activeTab !== index}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddVolunteer(checkpoint.toString())}
                      sx={{ mb: 2 }}
                    >
                      Add Volunteer
                    </Button>
                    {(formik.values.volunteers[checkpoint.toString()] || []).map((volunteer, volIndex) => {
                      const isValid = isVolunteerValid(volunteer);
                      return (
                        <Stack
                          key={volIndex}
                          direction="column"
                          spacing={2}
                          sx={{ mb: 2, border: '1px solid #ffffff44', p: 2, borderRadius: 1 }}
                        >
                          <Grid container spacing={2}>
                            {volunteerFields.map(({ key, label, validate, errorText, selectOptions, type }) => (
                              <Grid item xs={12} sm={6} key={key}>
                                <VolunteerTextField
                                  label={label}
                                  value={volunteer[key]}
                                  onChange={(e) =>
                                    handleVolunteerChange(checkpoint.toString(), volIndex, key, e.target.value)
                                  }
                                  error={validate(volunteer[key]) && formik.touched.volunteers}
                                  helperText={
                                    validate(volunteer[key]) && formik.touched.volunteers ? errorText : ''
                                  }
                                  selectOptions={selectOptions}
                                  type={type}
                                />
                              </Grid>
                            ))}
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleSendInvitation(checkpoint.toString(), volIndex, volunteer)}
                                disabled={!isValid || formik.values.sendingInvitations[`${checkpoint}_${volIndex}`]}
                                startIcon={
                                  formik.values.sendingInvitations[`${checkpoint}_${volIndex}`] ? (
                                    <CircularProgress size={16} color="inherit" />
                                  ) : null
                                }
                              >
                                Send Invitation
                              </Button>
                              <IconButton
                                onClick={() => handleRemoveVolunteer(checkpoint.toString(), volIndex)}
                                sx={{ color: 'white' }}
                                aria-label="Delete volunteer"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Stack>
                      );
                    })}
                    <Typography variant="h6" sx={{ mt: 3, color: 'white' }}>
                      Volunteer Status for Checkpoint {index + 1}
                    </Typography>
                    <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: '#2c2c2e' }}>
                      <Table sx={{ minWidth: 650 }} aria-label="volunteer status table">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: 'white' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white' }}>Level</TableCell>
                            <TableCell sx={{ color: 'white' }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(formik.values.volunteers[checkpoint.toString()] || []).map((volunteer, volIndex) => (
                            <TableRow key={volIndex}>
                              <TableCell sx={{ color: 'white' }}>{volunteer.name || 'N/A'}</TableCell>
                              <TableCell sx={{ color: 'white' }}>{volunteer.email || ''}</TableCell>
                              <TableCell sx={{ color: 'white' }}>{volunteer.level || 'N/A'}</TableCell>
                              <TableCell sx={{ color: 'white' }}>
                                {volunteer.sent ? <CheckCircleIcon color="success" /> : 'Not Sent'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
                {formik.errors.volunteers && formik.touched.volunteers && (
                  <Typography color="error" sx={{ mt: 2, color: 'white' }}>
                    {typeof formik.errors.volunteers === 'string'
                      ? formik.errors.volunteers
                      : 'Please add at least one valid volunteer per checkpoint'}
                  </Typography>
                )}
              </>
            ) : (
              <Typography sx={{ color: 'white' }}>
                No checkpoints defined. Please go back to Event Details to set the number of checkpoints.
              </Typography>
            )}
          </Box>
        );
      case 6:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Submit Event
            </Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              Click Submit to create the event. All data, including forms, email template, and volunteer invitations, will be sent to the server.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#18181c' }}>
      <Box
        sx={{
          flex: '0 0 20%',
          backgroundColor: '#18181c',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px',
          px: '16px',
        }}
      >
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
          sx={{
            width: '100%',
            '& .MuiStepLabel-label': { color: 'white' },
            '& .MuiStepLabel-alternativeLabel': { color: 'white' },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box sx={{ flex: 1, backgroundColor: '#18181c', p: 3 }}>
        <form onSubmit={formik.handleSubmit} style={{ color: 'white' }}>
          <Box sx={{ minHeight: '60vh' }}>{renderStepContent(activeStep)}</Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                !formik.isValid ||
                (activeStep === 3 && savedForms.length === 0)
              }
              sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default EventsPage;