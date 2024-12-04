import React, { useState } from 'react';
import './App.css';// Import CSS for styling

const DynamicForm = () => {
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Hardcoded API responses
  const formResponses = {
    userInfo: {
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', required: true },
        { name: 'lastName', type: 'text', label: 'Last Name', required: true },
        { name: 'age', type: 'number', label: 'Age', required: false }
      ]
    },
    addressInfo: {
      fields: [
        { name: 'street', type: 'text', label: 'Street', required: true },
        { name: 'city', type: 'text', label: 'City', required: true },
        { name: 'state', type: 'dropdown', label: 'State', options: ['California', 'Texas', 'New York'], required: true },
        { name: 'zipCode', type: 'text', label: 'Zip Code', required: false }
      ]
    },
    paymentInfo: {
      fields: [
        { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
        { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
        { name: 'cvv', type: 'password', label: 'CVV', required: true },
        { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true }
      ]
    }
  };

  const handleFormTypeChange = (event) => {
    setFormType(event.target.value);
    setFormData({});
    setErrors({});
    setProgress(0);
    setSuccessMessage('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Update progress
    const totalFields = formResponses[formType]?.fields.filter(field => field.required).length;
    const filledFields = Object.keys(formData).filter(key => formData[key]).length;
    setProgress((filledFields / totalFields) * 100);
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = formResponses[formType]?.fields || [];

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      setSubmittedData([...submittedData, formData]);
      setSuccessMessage('Form submitted successfully!');
      setFormData({});
      setProgress(0);
    }
  };

  const handleDelete = (index) => {
    const newData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(newData);
    setSuccessMessage('Entry deleted successfully.');
  };

  return (
    <div className="dynamic-form">
      <h1>Dynamic Form</h1>
      <select value={formType} onChange={handleFormTypeChange}>
        <option value="">Select Form Type</option>
        <option value="userInfo">User  Information</option>
        <option value="addressInfo">Address Information</option>
        <option value="paymentInfo">Payment Information</option>
      </select>

      {formType && (
        <form onSubmit={handleSubmit}>
          {formResponses[formType].fields.map((field) => (
            <div key={field.name} className="form-field">
              <label>{field.label}</label>
              {field.type === 'dropdown' ? (
                <select name={field.name} onChange={handleInputChange}>
                  <option value="">Select {field.label}</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                />
              )}
              {errors[field.name] && <span className="error">{errors[field.name]}</span>}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}

      {successMessage && <div className="success">{successMessage}</div>}
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>

      {submittedData.length > 0 && (
        <table>
          <thead>
            <tr>
              {formResponses[formType].fields.map(field => (
                <th key={field.name}>{field.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {formResponses[formType].fields.map(field => (
                  <td key={field.name}>{data[field.name]}</td>
                ))}
                <td>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DynamicForm;