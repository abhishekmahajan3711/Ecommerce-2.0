import User from '../models/User.js';

// Get all customers for admin with filters
export const getAllCustomers = async (req, res) => {
  try {
    const {
      search,
      role = 'customer',
      isActive,
      isVerified,
      isMobileVerified,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let query = { role };

    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { 'address.city': { $regex: search.trim(), $options: 'i' } },
        { 'address.state': { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Status filters
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }
    if (isMobileVerified !== undefined) {
      query.isMobileVerified = isMobileVerified === 'true';
    }

    // Sort options
    let sortOptions = {};
    if (sortBy === 'name') {
      sortOptions.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'email') {
      sortOptions.email = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'createdAt') {
      sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'lastLogin') {
      sortOptions.lastLogin = sortOrder === 'desc' ? -1 : 1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const totalCustomers = await User.countDocuments(query);

    // Get customers with pagination
    const customers = await User.find(query)
      .select('-password -resetPasswordOTP -resetPasswordOTPExpires -emailVerificationToken -emailVerificationTokenExpires -mobileVerificationOTP -mobileVerificationOTPExpires')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCustomers / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCustomers,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers'
    });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select('-password -resetPasswordOTP -resetPasswordOTPExpires -emailVerificationToken -emailVerificationTokenExpires -mobileVerificationOTP -mobileVerificationOTPExpires');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer'
    });
  }
};

// Update customer status
export const updateCustomerStatus = async (req, res) => {
  try {
    const { isActive, isVerified, isMobileVerified } = req.body;
    
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update only the provided fields
    if (isActive !== undefined) customer.isActive = isActive;
    if (isVerified !== undefined) customer.isVerified = isVerified;
    if (isMobileVerified !== undefined) customer.isMobileVerified = isMobileVerified;

    await customer.save();

    res.json({
      success: true,
      data: customer,
      message: 'Customer status updated successfully'
    });
  } catch (error) {
    console.error('Update customer status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer status'
    });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer'
    });
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCustomers = await User.countDocuments({ role: 'customer', isActive: true });
    const verifiedCustomers = await User.countDocuments({ role: 'customer', isVerified: true });
    const mobileVerifiedCustomers = await User.countDocuments({ role: 'customer', isMobileVerified: true });
    
    // Get customers created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        verifiedCustomers,
        mobileVerifiedCustomers,
        newCustomers,
        inactiveCustomers: totalCustomers - activeCustomers,
        unverifiedCustomers: totalCustomers - verifiedCustomers
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer statistics'
    });
  }
}; 