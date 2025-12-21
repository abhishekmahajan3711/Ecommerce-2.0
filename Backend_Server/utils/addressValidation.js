// Backend address validation utilities
export const addressValidation = {
  // Basic field validation
  validateField: (field, value) => {
    const validations = {
      street: {
        required: true,
        minLength: 5,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9\s,.-]+$/,
        message: 'Street address must be 5-100 characters and contain only letters, numbers, spaces, commas, dots, and hyphens'
      },
      city: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'City must be 2-50 characters and contain only letters and spaces'
      },
      state: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'State must be 2-50 characters and contain only letters and spaces'
      },
      zipCode: {
        required: true,
        pattern: /^\d{5,6}$/,
        message: 'ZIP code must be 5-6 digits'
      },
      country: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Country must be 2-50 characters and contain only letters and spaces'
      }
    };

    const validation = validations[field];
    if (!validation) return { isValid: true, message: '' };

    // Required check
    if (validation.required && (!value || value.trim() === '')) {
      return { isValid: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` };
    }

    // Length checks
    if (validation.minLength && value.length < validation.minLength) {
      return { isValid: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${validation.minLength} characters` };
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return { isValid: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${validation.maxLength} characters` };
    }

    // Pattern check
    if (validation.pattern && !validation.pattern.test(value)) {
      return { isValid: false, message: validation.message };
    }

    return { isValid: true, message: '' };
  },

  // Validate complete address
  validateAddress: (address) => {
    const errors = {};
    let isValid = true;

    Object.keys(address).forEach(field => {
      const validation = addressValidation.validateField(field, address[field]);
      if (!validation.isValid) {
        errors[field] = validation.message;
        isValid = false;
      }
    });

    return { isValid, errors };
  },



  // Validate ZIP code format for different countries
  validateZipCode: (zipCode, country = 'India') => {
    const zipPatterns = {
      'India': /^\d{6}$/,
      'USA': /^\d{5}(-\d{4})?$/,
      'UK': /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
      'Canada': /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
      'Australia': /^\d{4}$/
    };

    const pattern = zipPatterns[country] || /^\d{5,6}$/;
    return pattern.test(zipCode);
  },

  // Suggest corrections for common mistakes
  suggestCorrections: (address) => {
    const suggestions = {};

    // Capitalize first letter of each word
    Object.keys(address).forEach(field => {
      if (address[field]) {
        const corrected = address[field]
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        if (corrected !== address[field]) {
          suggestions[field] = corrected;
        }
      }
    });

    return suggestions;
  }
};

// Common Indian cities and states for validation
export const indianAddressData = {
  states: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ],
  
  majorCities: [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
    'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi'
  ]
};

// Validate against known Indian addresses
export const validateIndianAddress = (address) => {
  const errors = {};
  
  // Check if state is valid
  if (address.state && !indianAddressData.states.includes(address.state)) {
    errors.state = 'Please enter a valid Indian state';
  }
  
  // Validate Indian PIN code format
  if (address.zipCode && !/^\d{6}$/.test(address.zipCode)) {
    errors.zipCode = 'Indian PIN code must be 6 digits';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

// Middleware for address validation
export const validateAddressMiddleware = (req, res, next) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ 
      success: false, 
      message: 'Address is required' 
    });
  }

  // Basic validation
  const validation = addressValidation.validateAddress(address);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Address validation failed',
      errors: validation.errors
    });
  }

  // Indian address validation
  const indianValidation = validateIndianAddress(address);
  if (!indianValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Indian address validation failed',
      errors: indianValidation.errors
    });
  }



  next();
}; 