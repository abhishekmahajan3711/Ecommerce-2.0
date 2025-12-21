import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty
          return v.length >= 5 && v.length <= 100 && /^[a-zA-Z0-9\s,.-]+$/.test(v);
        },
        message: 'Street address must be 5-100 characters and contain only letters, numbers, spaces, commas, dots, and hyphens'
      }
    },
    city: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty
          return v.length >= 2 && v.length <= 50 && /^[a-zA-Z\s]+$/.test(v);
        },
        message: 'City must be 2-50 characters and contain only letters and spaces'
      }
    },
    state: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty
          return v.length >= 2 && v.length <= 50 && /^[a-zA-Z\s]+$/.test(v);
        },
        message: 'State must be 2-50 characters and contain only letters and spaces'
      }
    },
    zipCode: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty
          return /^\d{5,6}$/.test(v);
        },
        message: 'ZIP code must be 5-6 digits'
      }
    },
    country: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty
          return v.length >= 2 && v.length <= 50 && /^[a-zA-Z\s]+$/.test(v);
        },
        message: 'Country must be 2-50 characters and contain only letters and spaces'
      }
    }
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordOTP: {
    type: String
  },
  resetPasswordOTPExpires: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationTokenExpires: {
    type: Date
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  mobileVerificationOTP: {
    type: String
  },
  mobileVerificationOTPExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; 