import mongoose from 'mongoose';
import Category from '../models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017/energia';

const fixCategoryColors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find categories with problematic color classes
    const problematicCategories = await Category.find({
      color: { $in: ['bg-orange-100'] }
    });

    console.log(`Found ${problematicCategories.length} categories with problematic colors:`);
    problematicCategories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.color}`);
    });

    if (problematicCategories.length > 0) {
      // Update problematic colors to amber-100 (which is available in Tailwind)
      const result = await Category.updateMany(
        { color: 'bg-orange-100' },
        { $set: { color: 'bg-amber-100' } }
      );

      console.log(`Updated ${result.modifiedCount} categories from bg-orange-100 to bg-amber-100`);
    } else {
      console.log('No categories with problematic colors found.');
    }

    // List all categories and their colors
    const allCategories = await Category.find().sort({ order: 1 });
    console.log('\nAll categories and their colors:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.color}`);
    });

    console.log('\nCategory color fix completed successfully!');
  } catch (error) {
    console.error('Error fixing category colors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the fix function
fixCategoryColors(); 