import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['vitamins', 'minerals', 'protein', 'omega3', 'probiotics', 'antioxidants', 'herbs', 'other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required'],
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  mainImage: {
    type: String,
    required: [true, 'Main product image is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true
  },
  weight: {
    value: {
      type: Number,
      required: [true, 'Product weight is required']
    },
    unit: {
      type: String,
      enum: ['g', 'mg', 'kg', 'oz', 'lb'],
      default: 'g'
    }
  },
  servingSize: {
    type: String,
    trim: true
  },
  servingsPerContainer: {
    type: Number,
    min: 1
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
  },
  benefits: [{
    type: String,
    trim: true
  }],
  usageInstructions: {
    type: String,
    trim: true
  },
  warnings: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isNonGMO: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Custom validation to ensure at least one image is provided
productSchema.pre('save', function(next) {
  if (!this.mainImage) {
    return next(new Error('Main product image is required'));
  }
  if (!this.images || this.images.length === 0) {
    this.images = [this.mainImage];
  }
  
  // Generate SKU if not provided
  if (!this.sku) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.sku = `SKU-${timestamp}-${random}`.toUpperCase();
  }
  
  next();
});

// Index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text', 
  category: 'text',
  tags: 'text'
});

const Product = mongoose.model('Product', productSchema);

export default Product; 