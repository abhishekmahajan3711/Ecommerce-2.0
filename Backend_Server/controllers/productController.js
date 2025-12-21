import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import HeroSection from '../models/HeroSection.js';
import { cleanupCartsForSingleProduct } from '../utils/cartCleanup.js';

// GET /api/products?search=...&category=...&minPrice=...&maxPrice=...&minRating=...
export const searchProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      minRating, 
      brand,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isOrganic,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    let query = {};

    // Text search
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { brand: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { tags: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    // Brand filter
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Dietary filters
    if (isVegetarian === 'true') {
      query.isVegetarian = true;
    }
    if (isVegan === 'true') {
      query.isVegan = true;
    }
    if (isGlutenFree === 'true') {
      query.isGlutenFree = true;
    }
    if (isOrganic === 'true') {
      query.isOrganic = true;
    }

    // Sort options
    let sortOptions = {};
    if (sortBy === 'price') {
      sortOptions.price = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating') {
      sortOptions['rating.average'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'name') {
      sortOptions.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'featured') {
      sortOptions.isFeatured = -1;
      sortOptions.name = 1;
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(50);
    
    res.json({ 
      success: true, 
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// GET /api/products/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// GET /api/products/brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json({ 
      success: true, 
      data: brands 
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// GET /api/products/featured
export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .sort({ 'rating.average': -1, name: 1 })
    .limit(8);
    
    res.json({ 
      success: true, 
      data: featuredProducts,
      total: featuredProducts.length
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting product by ID:', id);

    // Validate if id is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid ObjectId format:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(id);
    console.log('Product found:', !!product);

    if (!product) {
      console.log('Product not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Returning product:', product.name);
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ADMIN PRODUCT MANAGEMENT ENDPOINTS

// GET /api/admin/products - Get all products for admin
export const getAllProductsForAdmin = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      category, 
      brand,
      isActive, 
      isFeatured,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isOrganic,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let query = {};
    
    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { brand: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { tags: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Brand filter
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    
    // Active status filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Featured filter
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    
    // Dietary filters
    if (isVegetarian !== undefined) {
      query.isVegetarian = isVegetarian === 'true';
    }
    if (isVegan !== undefined) {
      query.isVegan = isVegan === 'true';
    }
    if (isGlutenFree !== undefined) {
      query.isGlutenFree = isGlutenFree === 'true';
    }
    if (isOrganic !== undefined) {
      query.isOrganic = isOrganic === 'true';
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Stock range filter
    if (minStock || maxStock) {
      query.stock = {};
      if (minStock) query.stock.$gte = parseInt(minStock);
      if (maxStock) query.stock.$lte = parseInt(maxStock);
    }
    
    // Sort options
    let sortOptions = {};
    if (sortBy === 'name') {
      sortOptions.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'price') {
      sortOptions.price = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'stock') {
      sortOptions.stock = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating.average') {
      sortOptions['rating.average'] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all products for admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// POST /api/admin/products - Create new product
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    console.log('Creating product with data:', productData);
    
    // Create new product
    const product = new Product(productData);
    await product.save();
    
    console.log('Product created successfully with ID:', product._id);
    console.log('Product name:', product.name);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// PUT /api/admin/products/:id - Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate if id is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    // Fetch the old product to compare images
    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Helper to delete a file if it exists and is in /uploads
    const deleteImageFile = (url) => {
      if (url && url.startsWith('/uploads/')) {
        // Remove leading slash for correct path join
        const filePath = path.join(__dirname, '..', url.replace(/^\/+/, ''));
        fs.unlink(filePath, (err) => {
          // Ignore errors (file may not exist)
        });
      }
    };

    // Find removed or replaced images
    // For mainImage
    if (oldProduct.mainImage && oldProduct.mainImage !== updateData.mainImage) {
      deleteImageFile(oldProduct.mainImage);
    }
    // For additional images
    const oldImages = Array.isArray(oldProduct.images) ? oldProduct.images : [];
    const newImages = Array.isArray(updateData.images) ? updateData.images : [];
    oldImages.forEach((img, idx) => {
      // If the image is not in the new array, or replaced at the same index
      if (!newImages.includes(img) || newImages[idx] !== img) {
        deleteImageFile(img);
      }
    });

    // Update the product
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product was made inactive and clean up carts
    if (oldProduct.isActive && !product.isActive) {
      const cleanupResult = await cleanupCartsForSingleProduct(id);
      console.log('Cart cleanup result:', cleanupResult);
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// DELETE /api/admin/products/:id - Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate if id is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    // Fetch the product to get image URLs
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Clean up carts before deleting the product
    const cleanupResult = await cleanupCartsForSingleProduct(id);
    console.log('Cart cleanup result for deleted product:', cleanupResult);

    // Delete the product
    await Product.findByIdAndDelete(id);
    // Helper to delete a file if it exists and is in /uploads
    const deleteImageFile = (url) => {
      if (url && url.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', url.replace(/^\/+/, ''));
        fs.unlink(filePath, (err) => {
          // Ignore errors (file may not exist)
        });
      }
    };
    // Delete mainImage
    deleteImageFile(product.mainImage);
    // Delete all additional images
    if (Array.isArray(product.images)) {
      product.images.forEach(img => deleteImageFile(img));
    }
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Multer setup for image uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Controller for image upload
export const uploadImage = [
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Return the URL to access the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  }
];

// GET /api/hero - public
export const getHeroSection = async (req, res) => {
  try {
    let hero = await HeroSection.findOne();
    if (!hero) {
      // Provide default hero section if not set
      hero = await HeroSection.create({
        image: '',
        heading: 'Welcome to Energia!',
        subheading: 'Your one-stop shop for health and wellness.',
        buttons: [
          { text: 'Shop Now', link: '/' },
          { text: 'Browse Vitamins', link: '/filter?category=vitamins' }
        ]
      });
    }
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/admin/hero - admin only
export const updateHeroSection = async (req, res) => {
  try {
    const { image, heading, subheading, buttons } = req.body;
    let hero = await HeroSection.findOne();
    if (!hero) {
      hero = new HeroSection();
    }
    if (image !== undefined) hero.image = image;
    if (heading !== undefined) hero.heading = heading;
    if (subheading !== undefined) hero.subheading = subheading;
    if (buttons !== undefined) hero.buttons = buttons;
    await hero.save();
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/admin/hero/upload - admin only, image upload
export const uploadHeroImage = [
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  }
]; 