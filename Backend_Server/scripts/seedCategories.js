import mongoose from 'mongoose';
import Category from '../models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017/energia';

const initialCategories = [
  {
    name: "Vitamins",
    icon: "💊",
    link: "/products?category=vitamins",
    color: "bg-cyan-100",
    isActive: true,
    order: 1
  },
  {
    name: "Minerals",
    icon: "⚡",
    link: "/products?category=minerals",
    color: "bg-cyan-100",
    isActive: true,
    order: 2
  },
  {
    name: "Protein",
    icon: "💪",
    link: "/products?category=protein",
    color: "bg-red-100",
    isActive: true,
    order: 3
  },
  {
    name: "Omega-3",
    icon: "🐟",
    link: "/products?category=omega3",
    color: "bg-yellow-100",
    isActive: true,
    order: 4
  },
  {
    name: "Probiotics",
    icon: "🦠",
    link: "/products?category=probiotics",
    color: "bg-purple-100",
    isActive: true,
    order: 5
  },
  {
    name: "Antioxidants",
    icon: "🛡️",
    link: "/products?category=antioxidants",
    color: "bg-pink-100",
    isActive: true,
    order: 6
  }
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert initial categories
    const categories = await Category.insertMany(initialCategories);
    console.log(`Seeded ${categories.length} categories:`);
    
    categories.forEach(category => {
      console.log(`- ${category.name} (${category.icon})`);
    });

    console.log('Category seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding function
seedCategories(); 