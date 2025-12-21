import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  icon: { 
    type: String, 
    required: true,
    default: "📦"
  },
  link: { 
    type: String, 
    required: true,
    default: "/products"
  },
  color: { 
    type: String, 
    required: true,
    default: "bg-cyan-100"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema); 