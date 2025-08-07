import React from 'react';
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
  Modal,
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

// Interfaces and Constants
interface SavedForm {
  id: number;
  formName: string;
  price?: number;
  fields: string[];
  image?: File | null;
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
  checkpointNames: { [key: string]: string };
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
  emailSubject: string;
  emailContent: string;
  emailHeader: string;
  emailFooter: string;
  emailLogo: File | null;
  emailTitle: string;
  brandingAssets: File | null;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  volunteers: { [key: string]: Volunteer[] };
  sendingInvitations: { [key: string]: boolean };
}

const steps = ['Event Type', 'Event Details', 'Form Creation', 'Email Template', 'Volunteer Invitation', 'Submission'];

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

const predefinedFields = ['Name', 'Email', 'Date of Birth', 'State', 'Gender', 'Phone Number'];
const fieldTypes = [
  { value: 'text', label: 'Short Answer' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
];
const indianStates = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'];
const genderOptions = ['Male', 'Female', 'Other'];
const templateTypes = ['Normal', 'Graphical'];
const volunteerLevels = ['Beginner', 'Intermediate', 'Expert'];

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

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: '#2c2c2e',
  border: '2px solid #ffffff44',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://clickngo.in';

// Main Component
const EventsPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [savedForms, setSavedForms] = React.useState<SavedForm[]>([]);
  const [currentFormFields, setCurrentFormFields] = React.useState<string[]>([]);
  const [activeFormTab, setActiveFormTab] = React.useState(0);
  const [formStates, setFormStates] = React.useState<
    Array<{ formName: string; price: number | null; selectedFields: string[]; customFields: { name: string; type: string }[]; image: File | null }>
  >([]);
  const [isFormSaved, setIsFormSaved] = React.useState<boolean[]>([]);
  const [isViewFormClicked, setIsViewFormClicked] = React.useState(false);
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      eventType: '',
      eventName: '',
      startDateTime: null,
      endDateTime: null,
      checkpoints: '',
      checkpointNames: {},
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
      emailSubject: '',
      emailContent: '',
      emailHeader: 'Welcome to Our Event',
      emailFooter: 'Thank you for participating!',
      emailLogo: null,
      emailTitle: 'Event Invitation',
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
          guestRegistrationType: Yup.number()
            .required('Number of forms is required')
            .min(1, 'At least one form is required'),
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
          checkpointNames: Yup.object().test(
            'checkpoint-names-length',
            'Checkpoint names must match the number of checkpoints',
            (value) => {
              const checkpointCount = parseInt(formik.values.checkpoints) || 0;
              return Object.keys(value).length === checkpointCount && Object.values(value).every((name) => name.trim() !== '');
            }
          ),
        }),
        Yup.object({
          formName: Yup.string().required('Form name is required'),
          price: Yup.number().when('eventType', {
            is: (eventType: string) => eventType === 'paid',
            then: (schema: any) =>
              schema
                .required('Price is required for paid events')
                .min(0, 'Price must be non-negative'),
            otherwise: (schema: any) => schema.nullable(),
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
          emailSubject: Yup.string().when('templateType', {
            is: 'Normal',
            then: (schema: any) => schema.required('Email subject is required'),
            otherwise: (schema: any) => schema.nullable(),
          }),
          emailContent: Yup.string().required('Email content is required'),
          emailHeader: Yup.string().when('templateType', {
            is: 'Graphical',
            then: (schema: any) => schema.required('Email header is required'),
            otherwise: (schema: any) => schema.nullable(),
          }),
          emailFooter: Yup.string().when('templateType', {
            is: 'Graphical',
            then: (schema: any) => schema.required('Email footer is required'),
            otherwise: (schema: any) => schema.nullable(),
          }),
          emailTitle: Yup.string().when('templateType', {
            is: 'Graphical',
            then: (schema: any) => schema.required('Email title is required'),
            otherwise: (schema: any) => schema.nullable(),
          }),
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
      console.log(`Submitting step ${activeStep + 1}. Values:`, JSON.stringify(values, null, 2));
      console.log(`Saved forms: ${savedForms.length}, Required forms: ${parseInt(values.guestRegistrationType)}`);
      console.log('Formik errors:', formik.errors);
      console.log('Formik touched:', formik.touched);
      console.log('Formik isValid:', formik.isValid);

      const userData = localStorage.getItem('user');
      let user_id = null;

      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          user_id = parsedData.user_id || null;
          console.log('User id:', user_id);
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

      const savedData = {
        activeStep,
        formikValues: { ...values, brandingAssets: null, emailLogo: null },
        savedForms,
        formStates,
        isFormSaved,
        isViewFormClicked,
      };
      localStorage.setItem('eventFormData', JSON.stringify(savedData));
      console.log('Saved to localStorage:', savedData);

      if (activeStep === steps.length - 1) {
        try {
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
              checkpointNames: values.checkpointNames,
              guestRegistrationType: parseInt(values.guestRegistrationType) || 0,
              eventDescription: values.eventDescription,
              eventCategory: values.eventCategory,
              venueLocation: values.venueLocation,
              organizationName: values.organizationName,
              organizationEmail: values.organizationEmail,
              organizationPhone: values.organizationPhone,
              maxAttendance: parseInt(values.maxAttendance) || 0,
              registrationDeadline: values.registrationDeadline || '',
            },
            step3: {
              savedForms,
            },
            step4: {
              templateType: values.templateType,
              emailSubject: values.emailSubject,
              emailContent: values.emailContent,
              emailHeader: values.emailHeader,
              emailFooter: values.emailFooter,
              emailLogo: values.emailLogo ? values.emailLogo.name : null,
              emailTitle: values.emailTitle,
              brandingAssets: values.brandingAssets ? values.brandingAssets.name : null,
              facebookUrl: values.facebookUrl || '',
              instagramUrl: values.instagramUrl || '',
              twitterUrl: values.twitterUrl || '',
            },
            step5: {
              volunteers: values.volunteers,
            },
          };

          console.log('Submitting Form Data:', JSON.stringify(formData, null, 2));

          const response = await axios.post(`${API_BASE_URL}/events/add_events.php`, formData, {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCookie('csrftoken') || '',
            },
          });

          console.log('Server Response:', response.data);

          if (!response.data.message) {
            throw new Error('No message in server response');
          }

          toast.success(`Event created successfully: Event ID ${response.data.event_id || 'N/A'}`, {
            position: 'top-right',
            autoClose: 3000,
          });
          setActiveStep(0);
          formik.resetForm();
          setSavedForms([]);
          setCurrentFormFields([]);
          setFormStates([]);
          setActiveFormTab(0);
          setIsFormSaved([]);
          setIsViewFormClicked(false);
          setOpenPreviewModal(false);
          localStorage.removeItem('eventFormData');
        } catch (error: any) {
          console.error('Submission Error:', error);
          toast.error(error.response?.data?.error || error.message || 'Server error. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } else if (activeStep === 2) {
        const requiredForms = parseInt(values.guestRegistrationType) || 0;
        console.log('Step 2 Submit - savedForms:', savedForms, 'requiredForms:', requiredForms, 'isFormSaved:', isFormSaved, 'isViewFormClicked:', isViewFormClicked);
        if (savedForms.length < requiredForms || !isFormSaved.every((saved) => saved)) {
          toast.error(`Please save all ${requiredForms} form(s) before proceeding.`, {
            position: 'top-right',
            autoClose: 3000,
          });
          return;
        }
        if (!isViewFormClicked) {
          toast.error('Please view at least one saved form before proceeding.', {
            position: 'top-right',
            autoClose: 3000,
          });
          return;
        }
        setActiveStep((prev) => prev + 1);
        formik.setValues({
          ...formik.values,
          formName: '',
          price: null,
          selectedFields: [],
          customFields: [],
        });
        setIsViewFormClicked(false);
        formik.setSubmitting(false);
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

  React.useEffect(() => {
    const savedData = localStorage.getItem('eventFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setActiveStep(parsedData.activeStep || 0);
        formik.setValues({
          ...formik.values,
          ...parsedData.formikValues,
          brandingAssets: null,
          emailLogo: null,
        });
        setSavedForms(parsedData.savedForms || []);
        setFormStates(parsedData.formStates || []);
        setIsFormSaved(parsedData.isFormSaved || []);
        setIsViewFormClicked(parsedData.isViewFormClicked || false);
        setCurrentFormFields(parsedData.formStates?.[0]?.selectedFields || []);
        console.log('Loaded from localStorage:', parsedData);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }, []);

  const handleBack = React.useCallback(() => {
    setActiveStep((prev) => prev - 1);
    if (activeStep === 2) {
      formik.setValues({
        ...formik.values,
        formName: '',
        price: null,
        selectedFields: [],
        customFields: [],
      });
      setCurrentFormFields([]);
      setIsViewFormClicked(false);
    }
    const savedData = {
      activeStep: activeStep - 1,
      formikValues: { ...formik.values, brandingAssets: null, emailLogo: null },
      savedForms,
      formStates,
      isFormSaved,
      isViewFormClicked,
    };
    localStorage.setItem('eventFormData', JSON.stringify(savedData));
    console.log('Saved to localStorage on back:', savedData);
  }, [activeStep, formik, savedForms, formStates, isFormSaved, isViewFormClicked]);

  const handleFieldSelection = React.useCallback(
    (field: string) => {
      const selected = formik.values.selectedFields.includes(field)
        ? formik.values.selectedFields.filter((f) => f !== field)
        : [...formik.values.selectedFields, field];
      formik.setFieldValue('selectedFields', selected);
      setFormStates((prev) =>
        prev.map((form, index) =>
          index === activeFormTab ? { ...form, selectedFields: selected } : form
        )
      );
    },
    [formik, activeFormTab]
  );

  const handleCustomFieldChange = React.useCallback(
    (index: number, key: string, value: string) => {
      const updatedFields = [...formik.values.customFields];
      updatedFields[index] = { ...updatedFields[index], [key]: value };
      formik.setFieldValue('customFields', updatedFields);
      setFormStates((prev) =>
        prev.map((form, i) =>
          i === activeFormTab ? { ...form, customFields: updatedFields } : form
        )
      );
    },
    [formik, activeFormTab]
  );

  const addCustomField = React.useCallback(() => {
    const lastField = formik.values.customFields[formik.values.customFields.length - 1];
    if (lastField && lastField.name.trim() === '') return;
    const newCustomFields = [...formik.values.customFields, { name: '', type: 'text' }];
    formik.setFieldValue('customFields', newCustomFields);
    setFormStates((prev) =>
      prev.map((form, i) =>
        i === activeFormTab ? { ...form, customFields: newCustomFields } : form
      )
    );
  }, [formik, activeFormTab]);

  const handleSubmitSelection = React.useCallback(() => {
    const allFields = [
      ...formik.values.selectedFields,
      ...formik.values.customFields.map((f) => f.name).filter((name) => name.trim() !== ''),
    ];
    setCurrentFormFields(allFields);
    setFormStates((prev) =>
      prev.map((form, i) =>
        i === activeFormTab ? { ...form, selectedFields: allFields } : form
      )
    );
    setOpenPreviewModal(true);
  }, [formik, activeFormTab]);

  const handleSaveForm = React.useCallback(() => {
    if (!formik.values.formName) {
      toast.error('Form name is required', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (formik.values.eventType === 'paid' && (formik.values.price === null || formik.values.price < 0)) {
      toast.error('Price is required for paid events', { position: 'top-right', autoClose: 3000 });
      return;
    }
    const newForm = {
      id: savedForms.length + 1,
      formName: formik.values.formName,
      price: formik.values.eventType === 'paid' ? Number(formik.values.price) : undefined,
      fields: currentFormFields,
      image: formStates[activeFormTab]?.image || null,
    };
    setSavedForms((prev) => {
      const updated = [...prev];
      if (updated[activeFormTab]) {
        updated[activeFormTab] = newForm;
      } else {
        updated.push(newForm);
      }
      return updated;
    });
    setIsFormSaved((prev) => {
      const updated = [...prev];
      updated[activeFormTab] = true;
      return updated;
    });
    setFormStates((prev) =>
      prev.map((form, i) =>
        i === activeFormTab
          ? { formName: '', price: null, selectedFields: [], customFields: [], image: null }
          : form
      )
    );
    formik.setValues({
      ...formik.values,
      formName: '',
      price: null,
      selectedFields: [],
      customFields: [],
    });
    setCurrentFormFields([]);
    const formUrl = `${API_BASE_URL}/forms/${newForm.id}`;
    console.log(`Generated Form URL: ${formUrl}`);
    console.log(`Creating database table for form: ${newForm.formName}`);
    toast.success('Form saved successfully!', { position: 'top-right', autoClose: 3000 });

    const savedData = {
      activeStep,
      formikValues: {
        ...formik.values,
        formName: '',
        price: null,
        selectedFields: [],
        customFields: [],
        brandingAssets: null,
        emailLogo: null,
      },
      savedForms: [...savedForms, ...(savedForms[activeFormTab] ? [] : [newForm])],
      formStates,
      isFormSaved: [...isFormSaved, ...(isFormSaved[activeFormTab] ? [] : [true])],
      isViewFormClicked,
    };
    localStorage.setItem('eventFormData', JSON.stringify(savedData));

    const requiredForms = parseInt(formik.values.guestRegistrationType) || 0;
    if (activeFormTab < requiredForms - 1) {
      const nextTab = activeFormTab + 1;
      setActiveFormTab(nextTab);
      const nextFormState = formStates[nextTab] || {
        formName: '',
        price: null,
        selectedFields: [],
        customFields: [],
        image: null,
      };
      formik.setValues({
        ...formik.values,
        formName: nextFormState.formName,
        price: nextFormState.price,
        selectedFields: nextFormState.selectedFields,
        customFields: nextFormState.customFields,
      });
      setCurrentFormFields(nextFormState.selectedFields);
    }
  }, [formik, currentFormFields, activeFormTab, savedForms, formStates, isFormSaved, isViewFormClicked]);

  const handleViewForm = React.useCallback(
    (form: SavedForm, index: number) => {
      setCurrentFormFields(form.fields);
      formik.setValues({
        ...formik.values,
        formName: form.formName,
        price: form.price || null,
        selectedFields: form.fields,
        customFields: formStates[index]?.customFields || [],
      });
      setActiveFormTab(index);
      setIsViewFormClicked(true);
    },
    [formik, formStates]
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
      toast.error('Please fill in event name, start date, and end date in Event Details step.', {
        position: 'top-right',
        autoClose: 3000,
      });
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
        checkpoint: formik.values.checkpointNames[checkpoint] || `Checkpoint ${checkpoint}`,
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
        toast.success('Invitation sent successfully!', { position: 'top-right', autoClose: 3000 });
      } else {
        toast.error('Error sending invitation: ' + response.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Server error. Please try again.';
      toast.error('Error sending invitation: ' + errorMessage, { position: 'top-right', autoClose: 3000 });
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

  const getFieldComponent = (field: string, index: number) => {
    const customField = formik.values.customFields.find((f) => f.name === field);
    const fieldType = customField ? customField.type : predefinedFields.includes(field) ? 'text' : 'text';

    switch (field) {
      case 'State':
        return (
          <TextField
            fullWidth
            label="State"
            select
            value=""
            sx={textFieldStyles}
            disabled={isFormSaved[activeFormTab]}
          >
            {indianStates.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'Gender':
        return (
          <TextField
            fullWidth
            label="Gender"
            select
            value=""
            sx={textFieldStyles}
            disabled={isFormSaved[activeFormTab]}
          >
            {genderOptions.map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'Phone Number':
        return (
          <TextField
            fullWidth
            label="Phone Number"
            type="text"
            value=""
            sx={textFieldStyles}
            disabled={isFormSaved[activeFormTab]}
          />
        );
      default:
        if (fieldType === 'checkbox') {
          return (
            <FormControlLabel
              control={<Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
              label={<Typography sx={{ color: 'white' }}>{field}</Typography>}
              disabled={isFormSaved[activeFormTab]}
            />
          );
        } else if (fieldType === 'select') {
          return (
            <TextField
              fullWidth
              label={field}
              select
              value=""
              sx={textFieldStyles}
              disabled={isFormSaved[activeFormTab]}
            >
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
              <MenuItem value="option3">Option 3</MenuItem>
            </TextField>
          );
        } else {
          return (
            <TextField
              fullWidth
              label={field}
              type={fieldType === 'number' ? 'number' : 'text'}
              value=""
              sx={textFieldStyles}
              disabled={isFormSaved[activeFormTab]}
            />
          );
        }
    }
  };

  React.useEffect(() => {
    const formCount = parseInt(formik.values.guestRegistrationType) || 0;
    if (formCount > 0 && formStates.length !== formCount) {
      setFormStates(
        Array(formCount).fill({
          formName: '',
          price: null,
          selectedFields: [],
          customFields: [],
          image: null,
        })
      );
      setIsFormSaved(Array(formCount).fill(false));
      setSavedForms([]);
      setActiveFormTab(0);
      setIsViewFormClicked(false);
      console.log(`Initialized formStates and isFormSaved for ${formCount} forms`);
    }
  }, [formik.values.guestRegistrationType, formStates.length]);

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
              onChange={(e) => {
                formik.handleChange(e);
                const count = parseInt(e.target.value) || 0;
                const newCheckpointNames = { ...formik.values.checkpointNames };
                for (let i = 1; i <= count; i++) {
                  if (!newCheckpointNames[i.toString()]) {
                    newCheckpointNames[i.toString()] = `Checkpoint ${i}`;
                  }
                }
                Object.keys(newCheckpointNames).forEach((key) => {
                  if (parseInt(key) > count) {
                    delete newCheckpointNames[key];
                  }
                });
                formik.setFieldValue('checkpointNames', newCheckpointNames);
              }}
              error={!!formik.errors.checkpoints}
              helperText={formik.errors.checkpoints}
              fullWidth
              sx={textFieldStyles}
            />
            {Array.from({ length: parseInt(formik.values.checkpoints) || 0 }, (_, i) => i + 1).map((checkpoint) => (
              <TextField
                key={checkpoint}
                label={`Checkpoint ${checkpoint} Name`}
                name={`checkpointNames.${checkpoint}`}
                value={formik.values.checkpointNames[checkpoint.toString()] || ''}
                onChange={(e) => {
                  formik.setFieldValue(`checkpointNames.${checkpoint}`, e.target.value);
                }}
                error={!!formik.errors.checkpointNames}
                helperText={formik.errors.checkpointNames ? 'Checkpoint name is required' : ''}
                fullWidth
                sx={textFieldStyles}
              />
            ))}
            <TextField
              label="Number of Forms"
              name="guestRegistrationType"
              type="number"
              value={formik.values.guestRegistrationType}
              onChange={formik.handleChange}
              error={!!formik.errors.guestRegistrationType}
              helperText={formik.errors.guestRegistrationType}
              fullWidth
              sx={textFieldStyles}
            />
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
      case 2:
        const formCount = parseInt(formik.values.guestRegistrationType) || 0;
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
            {formCount > 0 ? (
              <>
                <Tabs
                  value={activeFormTab}
                  onChange={(_, newValue) => {
                    setActiveFormTab(newValue);
                    const formState = formStates[newValue] || {
                      formName: '',
                      price: null,
                      selectedFields: [],
                      customFields: [],
                      image: null,
                    };
                    formik.setValues({
                      ...formik.values,
                      formName: formState.formName,
                      price: formState.price,
                      selectedFields: formState.selectedFields,
                      customFields: formState.customFields,
                    });
                    setCurrentFormFields(formState.selectedFields);
                    console.log(`Switched to form tab ${newValue}. Form state:`, formState);
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiTab-root': { color: 'white' },
                    '& .Mui-selected': { color: 'white', fontWeight: 'bold' },
                    '& .MuiTabs-indicator': { backgroundColor: '#f27121' },
                  }}
                >
                  {Array.from({ length: formCount }, (_, i) => (
                    <Tab key={i} label={`Form ${i + 1}`} />
                  ))}
                </Tabs>
                <Box sx={{ maxWidth: 600, margin: 'auto', backgroundColor: '#2c2c2e', p: 3, borderRadius: '8px' }}>
                  {!isFormSaved[activeFormTab] ? (
                    <>
                      <Stack spacing={2} mb={3}>
                        <TextField
                          label="Form Name"
                          name="formName"
                          value={formStates[activeFormTab]?.formName || formik.values.formName}
                          onChange={(e) => {
                            formik.handleChange(e);
                            setFormStates((prev) =>
                              prev.map((form, i) =>
                                i === activeFormTab ? { ...form, formName: e.target.value } : form
                              )
                            );
                          }}
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
                            value={formStates[activeFormTab]?.price || formik.values.price || ''}
                            onChange={(e) => {
                              formik.handleChange(e);
                              setFormStates((prev) =>
                                prev.map((form, i) =>
                                  i === activeFormTab ? { ...form, price: Number(e.target.value) || null } : form
                                )
                              );
                            }}
                            error={!!formik.errors.price}
                            helperText={formik.errors.price}
                            fullWidth
                            sx={textFieldStyles}
                          />
                        )}
                        <TextField
                          label="Form Image (Logo/Banner, Optional)"
                          type="file"
                          name="formImage"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const files = event.target.files;
                            setFormStates((prev) =>
                              prev.map((form, i) =>
                                i === activeFormTab ? { ...form, image: files ? files[0] : null } : form
                              )
                            );
                          }}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          sx={textFieldStyles}
                        />
                      </Stack>
                      {currentFormFields.length === 0 ? (
                        <>
                          <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 2 }}>
                            Select Fields for Form {activeFormTab + 1}
                          </Typography>
                          <Card sx={{ backgroundColor: '#3a3a3e', p: 2, borderRadius: '8px', mb: 2 }}>
                            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                              Predefined Fields
                            </Typography>
                            <Grid container spacing={1}>
                              {predefinedFields.map((field, index) => (
                                <Grid item xs={6} key={index}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={formik.values.selectedFields.includes(field)}
                                        onChange={() => handleFieldSelection(field)}
                                        sx={{ color: 'white', '&.Mui-checked': { color: '#f27121' } }}
                                      />
                                    }
                                    label={<Typography sx={{ color: 'white' }}>{field}</Typography>}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Card>
                          <Card sx={{ backgroundColor: '#3a3a3e', p: 2, borderRadius: '8px' }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
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
                              <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={addCustomField}
                                disabled={
                                  formik.values.customFields.length > 0 &&
                                  formik.values.customFields[formik.values.customFields.length - 1].name.trim() === ''
                                }
                                sx={{ mt: 1, color: 'white', borderColor: 'white' }}
                              >
                                Add Custom Field
                              </Button>
                            </Grid>
                          </Card>
                          <Button
                            variant="contained"
                            onClick={handleSubmitSelection}
                            disabled={formik.values.selectedFields.length === 0 && formik.values.customFields.every(f => f.name.trim() === '')}
                            sx={{ mt: 3, backgroundColor: '#f27121', '&:hover': { backgroundColor: '#e94057' } }}
                          >
                            Preview Form
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 2 }}>
                            Preview Form {activeFormTab + 1}
                          </Typography>
                          <Card sx={{ backgroundColor: '#3a3a3e', p: 3, borderRadius: '8px', mb: 2 }}>
                            <Typography sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                              Form Name: {formStates[activeFormTab]?.formName || formik.values.formName}
                            </Typography>
                            {formik.values.eventType === 'paid' && (
                              <Typography sx={{ color: 'white', mb: 2 }}>
                                Price: {formStates[activeFormTab]?.price || formik.values.price}
                              </Typography>
                            )}
                            {formStates[activeFormTab]?.image && (
                              <Box sx={{ mb: 2, textAlign: 'center' }}>
                                <img
                                  src={URL.createObjectURL(formStates[activeFormTab].image!)}
                                  alt="Form Image"
                                  style={{ maxWidth: '100%', maxHeight: 150, borderRadius: '8px' }}
                                />
                              </Box>
                            )}
                            <Grid container spacing={2}>
                              {currentFormFields.map((field, index) => (
                                <Grid item xs={12} key={index}>
                                  {getFieldComponent(field, index)}
                                </Grid>
                              ))}
                            </Grid>
                          </Card>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              onClick={handleSaveForm}
                              sx={{ backgroundColor: '#f27121', '&:hover': { backgroundColor: '#e94057' } }}
                            >
                              Save Form
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setCurrentFormFields([]);
                                setFormStates((prev) =>
                                  prev.map((form, i) =>
                                    i === activeFormTab
                                      ? { ...form, formName: '', price: null, selectedFields: [], customFields: [], image: null }
                                      : form
                                  )
                                );
                                formik.setValues({
                                  ...formik.values,
                                  formName: '',
                                  price: null,
                                  selectedFields: [],
                                  customFields: [],
                                });
                              }}
                              sx={{ color: 'white', borderColor: 'white' }}
                            >
                              Edit
                            </Button>
                          </Stack>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 2 }}>
                        Form {activeFormTab + 1} (Saved)
                      </Typography>
                      <Card sx={{ backgroundColor: '#3a3a3e', p: 3, borderRadius: '8px', mb: 2 }}>
                        <Typography sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                          Form Name: {savedForms[activeFormTab]?.formName || 'N/A'}
                        </Typography>
                        <Typography sx={{ color: 'white', mb: 1 }}>
                          Form URL: {`${API_BASE_URL}/your-events/${savedForms[activeFormTab]?.formId || 'N/A'}`}
                        </Typography>
                        {formik.values.eventType === 'paid' && (
                          <Typography sx={{ color: 'white', mb: 1 }}>
                            Price: {savedForms[activeFormTab]?.price ?? 'N/A'}
                          </Typography>
                        )}
                        {savedForms[activeFormTab]?.image && (
                          <Box sx={{ mb: 2, textAlign: 'center' }}>
                            <img
                              src={URL.createObjectURL(savedForms[activeFormTab].image!)}
                              alt="Form Image"
                              style={{ maxWidth: '100%', maxHeight: 150, borderRadius: '8px' }}
                            />
                          </Box>
                        )}
                        <Typography sx={{ color: 'white', mb: 2 }}>
                          Fields: {savedForms[activeFormTab]?.fields.join(', ') || 'None'}
                        </Typography>
                        <Grid container spacing={2}>
                          {savedForms[activeFormTab]?.fields.map((field, index) => (
                            <Grid item xs={12} key={index}>
                              {getFieldComponent(field, index)}
                            </Grid>
                          ))}
                        </Grid>
                      </Card>
                    </>
                  )}
                  {savedForms.length > 0 && (
                    <>
                      <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                        Saved Forms
                      </Typography>
                      {savedForms.map((form, index) => (
                        <Card
                          key={form.id}
                          sx={{
                            mt: 2,
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: '#3a3a3e',
                          }}
                        >
                          <CardContent>
                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                              Form Name: {form.formName}
                            </Typography>
                            <Typography sx={{ color: 'white' }}>
                              Form URL: {`${API_BASE_URL}/your-events/${form.formId}`}
                            </Typography>
                            {form.price !== undefined && (
                              <Typography sx={{ color: 'white' }}>
                                Price: {form.price}
                              </Typography>
                            )}
                            {form.image && (
                              <Box sx={{ my: 1, textAlign: 'center' }}>
                                <img
                                  src={URL.createObjectURL(form.image)}
                                  alt="Form Image"
                                  style={{ maxWidth: '100%', maxHeight: 100, borderRadius: '4px' }}
                                />
                              </Box>
                            )}
                            <Typography sx={{ color: 'white' }}>
                              Fields: {form.fields.join(', ')}
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={() => handleViewForm(form, index)}
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
                <Modal
                  open={openPreviewModal}
                  onClose={() => setOpenPreviewModal(false)}
                  aria-labelledby="form-preview-modal"
                >
                  <Box sx={{ ...modalStyle, backgroundColor: '#3a3a3e' }}>
                    <Typography id="form-preview-modal" variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                      Form Preview: {formStates[activeFormTab]?.formName || formik.values.formName}
                    </Typography>
                    {formStates[activeFormTab]?.image && (
                      <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <img
                          src={URL.createObjectURL(formStates[activeFormTab].image!)}
                          alt="Form Image"
                          style={{ maxWidth: '100%', maxHeight: 150, borderRadius: '8px' }}
                        />
                      </Box>
                    )}
                    <Card sx={{ backgroundColor: '#2c2c2e', p: 2, borderRadius: '8px' }}>
                      <Grid container spacing={2}>
                        {currentFormFields.map((field, index) => (
                          <Grid item xs={12} key={index}>
                            {getFieldComponent(field, index)}
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                    <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleSaveForm();
                          setOpenPreviewModal(false);
                        }}
                        sx={{ backgroundColor: '#f27121', '&:hover': { backgroundColor: '#e94057' } }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setCurrentFormFields([]);
                          setFormStates((prev) =>
                            prev.map((form, i) =>
                              i === activeFormTab
                                ? { ...form, formName: '', price: null, selectedFields: [], customFields: [], image: null }
                                : form
                            )
                          );
                          formik.setValues({
                            ...formik.values,
                            formName: '',
                            price: null,
                            selectedFields: [],
                            customFields: [],
                          });
                          setOpenPreviewModal(false);
                        }}
                        sx={{ color: 'white', borderColor: 'white' }}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </Box>
                </Modal>
              </>
            ) : (
              <Typography sx={{ color: 'white' }}>
                Please specify the number of forms in Event Details.
              </Typography>
            )}
          </CardContent>
        );


      case 3:
        console.log(`Email Template Token Cost: ${formik.values.templateType === 'Normal' ? 1 : 1.5} tokens`);
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
              {formik.values.templateType === 'Normal' ? (
                <>
                  <TextField
                    label="Email Subject"
                    name="emailSubject"
                    value={formik.values.emailSubject}
                    onChange={formik.handleChange}
                    error={!!formik.errors.emailSubject}
                    helperText={formik.errors.emailSubject}
                    fullWidth
                    sx={textFieldStyles}
                  />
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
                </>
              ) : (
                <>
                  <TextField
                    label="Email Header"
                    name="emailHeader"
                    value={formik.values.emailHeader}
                    onChange={formik.handleChange}
                    error={!!formik.errors.emailHeader}
                    helperText={formik.errors.emailHeader}
                    fullWidth
                    sx={textFieldStyles}
                  />
                  <TextField
                    label="Email Title"
                    name="emailTitle"
                    value={formik.values.emailTitle}
                    onChange={formik.handleChange}
                    error={!!formik.errors.emailTitle}
                    helperText={formik.errors.emailTitle}
                    fullWidth
                    sx={textFieldStyles}
                  />
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
                    label="Email Footer"
                    name="emailFooter"
                    value={formik.values.emailFooter}
                    onChange={formik.handleChange}
                    error={!!formik.errors.emailFooter}
                    helperText={formik.errors.emailFooter}
                    fullWidth
                    sx={textFieldStyles}
                  />
                  <TextField
                    label="Email Logo"
                    type="file"
                    name="emailLogo"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const files = event.target.files;
                      formik.setFieldValue('emailLogo', files ? files[0] : null);
                    }}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={textFieldStyles}
                  />
                </>
              )}
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
                {formik.values.templateType === 'Normal' ? (
                  <>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Subject:</strong> {formik.values.emailSubject || 'Not set'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Content:</strong> {formik.values.emailContent || 'No content'}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Header:</strong> {formik.values.emailHeader || 'Not set'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Title:</strong> {formik.values.emailTitle || 'Not set'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Content:</strong> {formik.values.emailContent || 'No content'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Footer:</strong> {formik.values.emailFooter || 'Not set'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Logo:</strong> {formik.values.emailLogo ? formik.values.emailLogo.name : 'None'}
                    </Typography>
                  </>
                )}
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
      case 4:
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
                  value={activeFormTab}
                  onChange={(_, newValue) => setActiveFormTab(newValue)}
                  sx={{
                    mb: 3,
                    '& .MuiTab-root': { color: 'white' },
                    '& .Mui-selected': { color: 'white', fontWeight: 'bold' },
                    '& .MuiTabs-indicator': { backgroundColor: 'white' },
                  }}
                >
                  {Array.from({ length: checkpointCount }, (_, i) => (
                    <Tab key={i} label={formik.values.checkpointNames[(i + 1).toString()] || `Checkpoint ${i + 1}`} />
                  ))}
                </Tabs>
                {Array.from({ length: checkpointCount }, (_, i) => i + 1).map((checkpoint, index) => (
                  <Box key={checkpoint} hidden={activeFormTab !== index}>
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
                      Volunteer Status for {formik.values.checkpointNames[checkpoint.toString()] || `Checkpoint ${index + 1}`}
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
      case 5:
        return (
          <Box sx={{ maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
              Submission Summary
            </Typography>
            <Card sx={{ backgroundColor: '#2c2c2e', borderRadius: '8px', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  Step 1: Event Type
                </Typography>
                <Typography sx={{ color: 'white' }}>
                  <strong>Event Type:</strong> {formik.values.eventType.charAt(0).toUpperCase() + formik.values.eventType.slice(1)}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: '#2c2c2e', borderRadius: '8px', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  Step 2: Event Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Event Name:</strong> {formik.values.eventName || 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Start Date & Time:</strong> {formik.values.startDateTime ? new Date(formik.values.startDateTime).toLocaleString() : 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>End Date & Time:</strong> {formik.values.endDateTime ? new Date(formik.values.endDateTime).toLocaleString() : 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Checkpoints:</strong> {formik.values.checkpoints || '0'}
                    </Typography>
                  </Grid>
                  {Object.entries(formik.values.checkpointNames).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Typography sx={{ color: 'white' }}>
                        <strong>Checkpoint {key} Name:</strong> {value || `Checkpoint ${key}`}
                      </Typography>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Number of Forms:</strong> {formik.values.guestRegistrationType || '0'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Event Description:</strong> {formik.values.eventDescription || 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Event Category:</strong> {formik.values.eventCategory || 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Venue Location:</strong> {formik.values.venueLocation || 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Organization Name:</strong> {formik.values.organizationName || 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Organization Email:</strong> {formik.values.organizationEmail || 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Organization Phone:</strong> {formik.values.organizationPhone || 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Maximum Attendance:</strong> {formik.values.maxAttendance || 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ color: 'white' }}>
                      <strong>Registration Deadline:</strong> {formik.values.registrationDeadline ? new Date(formik.values.registrationDeadline).toLocaleString() : 'Not set'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: '#2c2c2e', borderRadius: '8px', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  Step 3: Form Creation
                </Typography>
                {savedForms.length > 0 ? (
                  savedForms.map((form, index) => (
                    <Box key={form.id} sx={{ mb: 2 }}>
                      <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                        Form {index + 1}: {form.formName}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        <strong>Form URL:</strong> {`${API_BASE_URL}/your-events/${form.formId}`}
                      </Typography>
                      {form.price !== undefined && (
                        <Typography sx={{ color: 'white' }}>
                          <strong>Price:</strong> {form.price}
                        </Typography>
                      )}
                      {form.image && (
                        <Box sx={{ my: 1, textAlign: 'center' }}>
                          <img
                            src={URL.createObjectURL(form.image)}
                            alt="Form Image"
                            style={{ maxWidth: '100%', maxHeight: 100, borderRadius: '4px' }}
                          />
                        </Box>
                      )}
                      <Typography sx={{ color: 'white' }}>
                        <strong>Fields:</strong> {form.fields.join(', ') || 'None'}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: 'white' }}>No forms created.</Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: '#2c2c2e', borderRadius: '8px', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  Step 4: Email Template
                </Typography>
                <Typography sx={{ color: 'white' }}>
                  <strong>Template Type:</strong> {formik.values.templateType || 'Not set'}
                </Typography>
                {formik.values.templateType === 'Normal' ? (
                  <>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Subject:</strong> {formik.values.emailSubject || 'Not set'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Content:</strong> {formik.values.emailContent || 'No content'}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Header:</strong> {formik.values.emailHeader || 'Not set'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Title:</strong> {formik.values.emailTitle || 'Not set'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Content:</strong> {formik.values.emailContent || 'No content'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Footer:</strong> {formik.values.emailFooter || 'Not set'}
                    </Typography>
                    <Typography sx={{ color: 'white', mt: 1 }}>
                      <strong>Email Logo:</strong> {formik.values.emailLogo ? formik.values.emailLogo.name : 'None'}
                    </Typography>
                  </>
                )}
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

            <Card sx={{ backgroundColor: '#2c2c2e', borderRadius: '8px', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  Step 5: Volunteer Invitation
                </Typography>
                {Array.from({ length: parseInt(formik.values.checkpoints) || 0 }, (_, i) => i + 1).map((checkpoint, index) => (
                  <Box key={checkpoint}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                      {formik.values.checkpointNames[checkpoint.toString()] || `Checkpoint ${checkpoint}`}
                    </Typography>
                    <TableContainer component={Paper} sx={{ backgroundColor: '#3a3a3e', mb: 2 }}>
                      <Table aria-label={`volunteer table for checkpoint ${checkpoint}`}>
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
                              <TableCell sx={{ color: 'white' }}>{volunteer.email || 'N/A'}</TableCell>
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
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#18181c' }}>
      <Box>
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
          <Box sx={{ minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>{renderStepContent(activeStep)}</Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0 || formik.isSubmitting}
                onClick={handleBack}
                sx={{ color: 'white', borderColor: 'white' }}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                {formik.isSubmitting && <CircularProgress size={16} sx={{ ml: 1, color: 'white' }} />}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EventsPage;