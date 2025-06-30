import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Style.css';

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
  event_type: string;
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
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const genderOptions = ['Male', 'Female', 'Other'];

const YourFormsPage: React.FC = () => {
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

  // Calculate payment breakdown
  const calculatePaymentBreakdown = (price: number | null) => {
    if (!price) return { basePrice: 0, gst: 0, paymentCharge: 0, total: 0 };
    const basePrice = price;
    const gst = basePrice * 0.18; // 18% GST
    const paymentCharge = basePrice * 0.05; // 5% payment processing fee
    const total = basePrice + gst + paymentCharge;
    return { basePrice, gst, paymentCharge, total };
  };

  // Find event type for the current form
  const getEventType = (formId: number): string => {
    for (const event of events) {
      if (event.forms.some((form) => form.form_id === formId)) {
        return event.event_type;
      }
    }
    return 'free'; // Default to free if event not found
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-semibold text-white text-center mb-6">Your Forms</h1>
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
        <p className="text-gray-300 text-center mt-6">No forms found.</p>
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
                <h2 className="text-xl font-medium text-white">{event.event_name} ({event.event_type})</h2>
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
                  {event.forms.length > 0 ? (
                    <div className="space-y-2">
                      {event.forms.map((form) => (
                        <div
                          key={form.form_id}
                          className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                        >
                          <p className="text-white"><strong>Form Name:</strong> {form.form_name}</p>
                          <p className="text-gray-300"><strong>Price:</strong> {form.price ? `₹${form.price.toFixed(2)}` : 'Free'}</p>
                          <p className="text-gray-300">
                            <strong>Fields:</strong>{' '}
                            {form.fields.length > 0
                              ? form.fields.map((field) => field.label).join(', ')
                              : 'No fields defined'}
                          </p>
                          <div className="mt-2 flex space-x-2">
                            <button
                              onClick={() => handleOpenModal('view', form)}
                              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
                            >
                              View Form
                            </button>
                            <button
                              onClick={() => handleOpenModal('modify', form)}
                              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
                            >
                              Modify Form Fields
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-300">No forms for this event.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalState.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-3xl animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-4">
              {modalState.type === 'view' ? 'View Form' : 'Modify Form Fields'} -{' '}
              {modalState.form?.form_name || 'Unknown'}
            </h2>
            {apiError && <p className="text-red-500 mb-4">Error: {apiError}</p>}
            {modalState.fields.length > 0 ? (
              modalState.type === 'view' ? (
                <div className="flex flex-col md:flex-row md:space-x-4">
                  {/* Left Side: Form Fields */}
                  <div className="flex-1 space-y-4">
                    <p className="text-white"><strong>Form Name:</strong> {modalState.form?.form_name}</p>
                    {modalState.form?.price !== null && (
                      <p className="text-gray-300"><strong>Price:</strong> ₹{modalState.form?.price.toFixed(2)}</p>
                    )}
                    <div className="space-y-2">
                      {modalState.fields.map((field, index) => (
                        <div key={field.id || index}>
                          {field.label === 'State' ? (
                            <select
                              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                              disabled
                            >
                              <option value="">Select State</option>
                              {indianStates.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                          ) : field.label === 'Gender' ? (
                            <select
                              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                              disabled
                            >
                              <option value="">Select Gender</option>
                              {genderOptions.map((gender) => (
                                <option key={gender} value={gender}>
                                  {gender}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
                              placeholder={`${field.label} (${field.type})`}
                              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                              disabled
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Right Side: Payment Breakdown (for paid events) */}
                  {modalState.form && getEventType(modalState.form.form_id) === 'paid' && (
                    <div className="flex-1 mt-4 md:mt-0">
                      <h3 className="text-lg font-medium text-white mb-2">Payment Breakdown</h3>
                      {modalState.form.price !== null ? (
                        (() => {
                          const { basePrice, gst, paymentCharge, total } = calculatePaymentBreakdown(modalState.form.price);
                          return (
                            <div className="bg-gray-700 p-4 rounded-lg">
                              <p className="text-gray-300 mb-1"><strong>Base Price:</strong> ₹{basePrice.toFixed(2)}</p>
                              <p className="text-gray-300 mb-1"><strong>GST (18%):</strong> ₹{gst.toFixed(2)}</p>
                              <p className="text-gray-300 mb-1"><strong>Payment Charge (5%):</strong> ₹{paymentCharge.toFixed(2)}</p>
                              <p className="text-white font-bold mt-2"><strong>Total:</strong> ₹{total.toFixed(2)}</p>
                            </div>
                          );
                        })()
                      ) : (
                        <p className="text-red-500">Price not set for this form.</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {modalState.fields.map((field, index) => (
                    <div key={field.id || index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.label || ''}
                          onChange={(e) => handleFieldChange(index, { ...field, label: e.target.value })}
                          className={`w-full p-2 rounded bg-gray-700 text-white border ${field.label && field.label.trim() === '' ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-pink-500`}
                          placeholder="Field Name"
                        />
                        {field.label && field.label.trim() === '' && (
                          <p className="text-red-500 text-sm mt-1">Field name is required</p>
                        )}
                      </div>
                      <select
                        value={field.type || 'text'}
                        onChange={(e) => handleFieldChange(index, { ...field, type: e.target.value })}
                        className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                      >
                        {['text', 'number', 'email', 'tel'].map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      <select
                        value={field.required ? 'Yes' : 'No'}
                        onChange={(e) => handleFieldChange(index, { ...field, required: e.target.value === 'Yes' })}
                        className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <button
                        onClick={() => handleRemoveField(index)}
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
                  <button
                    onClick={handleAddField}
                    disabled={
                      modalState.fields.length > 0 &&
                      modalState.fields[modalState.fields.length - 1].label.trim() === ''
                    }
                    className="text-pink-500 hover:text-pink-600 disabled:text-gray-600 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-6 h-6 inline-block mr-2"
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
                    Add Field
                  </button>
                </div>
              )
            ) : (
              <div className="text-gray-300">
                No fields to display.{' '}
                {modalState.type === 'modify' && (
                  <button
                    onClick={handleAddField}
                    className="text-pink-500 hover:text-pink-600 ml-2"
                  >
                    Add Field
                  </button>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-2">
              {modalState.type === 'modify' && (
                <button
                  onClick={handleSaveFields}
                  disabled={
                    modalState.fields.length > 0 &&
                    modalState.fields[modalState.fields.length - 1].label.trim() === ''
                  }
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourFormsPage;