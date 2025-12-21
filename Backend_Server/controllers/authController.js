import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { addressValidation, validateIndianAddress } from '../utils/addressValidation.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Sign Up Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Sign In Controller
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      isMobileVerified : user.isMobileVerified,
      isVerified: user.isVerified
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Current User Controller
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update User Name
export const updateUserName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'Name updated successfully', data: { user } });
  } catch (error) {
    console.error('Update name error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Update User Address
export const updateUserAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country } = req.body;
    const address = { street, city, state, zipCode, country };

    // Validate address
    const validation = addressValidation.validateAddress(address);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Address validation failed',
        errors: validation.errors
      });
    }

    // Validate Indian address
    const indianValidation = validateIndianAddress(address);
    if (!indianValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Indian address validation failed',
        errors: indianValidation.errors
      });
    }



    const user = await User.findByIdAndUpdate(
      req.userId,
      { address },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, message: 'Address updated successfully', data: { user } });
  } catch (error) {
    console.error('Update address error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: 'Address validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}; 

// Admin Sign In Controller
export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is admin
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or not authorized as admin'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Admin signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Change User Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Admin Password
export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user and verify it's an admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update admin password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Forgot Password (Send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send OTP via email (update with your SMTP credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
};

// Reset Password (Verify OTP)
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ success: false, message: 'No OTP requested' });
    }
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
}; 
    
// Send Verification Email
export const sendVerificationEmail = async (req, res) => {
  try {
    const userId = req.userId; // must be authenticated
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();
    // Send email
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your email',
      text: `Click the following link to verify your email. This link will expire in 30 minutes: ${verifyUrl}`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Verification email sent. The link will expire in 30 minutes.' });
  } catch (error) {
    console.error('Send verification email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification email', error: error.message });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required' });
    }
    let user = await User.findOne({ emailVerificationToken: token, emailVerificationTokenExpires: { $gt: Date.now() } });
    if (!user) {
      // Try to find a user who is already verified and had this token
      user = await User.findOne({ isVerified: true, emailVerificationToken: undefined });
      if (user) {
        return res.status(200).json({ success: true, message: 'Email already verified.' });
      }
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify email', error: error.message });
  }
}; 
    
    
// Verify Mobile via Firebase (no OTP, just mark as verified)
export const verifyFirebaseMobile = async (req, res) => {
  try {
    const userId = req.userId; // must be authenticated
    const { phone } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.isMobileVerified) {
      return res.status(400).json({ success: false, message: 'Mobile number is already verified' });
    }
    if (phone && user.phone !== phone) {
      user.phone = phone;
    }
    user.isMobileVerified = true;
    user.mobileVerificationOTP = undefined;
    user.mobileVerificationOTPExpires = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Mobile number verified via Firebase.' });
  } catch (error) {
    console.error('Verify Firebase mobile error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify mobile number via Firebase', error: error.message });
  }
}; 
    