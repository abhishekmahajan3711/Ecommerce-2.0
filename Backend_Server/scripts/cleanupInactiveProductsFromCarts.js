import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017/energia';

const cleanupInactiveProductsFromCarts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all inactive products
    const inactiveProducts = await Product.find({ isActive: false }).select('_id name');
    console.log(`Found ${inactiveProducts.length} inactive products:`);
    inactiveProducts.forEach(product => {
      console.log(`- ${product.name} (${product._id})`);
    });

    if (inactiveProducts.length === 0) {
      console.log('No inactive products found. No cleanup needed.');
      return;
    }

    const inactiveProductIds = inactiveProducts.map(product => product._id);

    // Find all carts that contain inactive products
    const cartsWithInactiveProducts = await Cart.find({
      'items.product': { $in: inactiveProductIds }
    }).populate('items.product');

    console.log(`Found ${cartsWithInactiveProducts.length} carts with inactive products`);

    let totalItemsRemoved = 0;
    let cartsUpdated = 0;

    // Clean up each cart
    for (const cart of cartsWithInactiveProducts) {
      const originalItemCount = cart.items.length;
      
      // Filter out inactive products
      cart.items = cart.items.filter(item => 
        item.product && item.product.isActive
      );
      
      const itemsRemoved = originalItemCount - cart.items.length;
      
      if (itemsRemoved > 0) {
        await cart.save();
        totalItemsRemoved += itemsRemoved;
        cartsUpdated++;
        
        console.log(`Cart ${cart._id}: Removed ${itemsRemoved} inactive product(s)`);
      }
    }

    console.log('\n=== Cleanup Summary ===');
    console.log(`Total carts processed: ${cartsWithInactiveProducts.length}`);
    console.log(`Carts updated: ${cartsUpdated}`);
    console.log(`Total items removed: ${totalItemsRemoved}`);
    console.log(`Inactive products found: ${inactiveProducts.length}`);

    if (totalItemsRemoved > 0) {
      console.log('\n✅ Cart cleanup completed successfully!');
    } else {
      console.log('\nℹ️  No inactive products found in any carts.');
    }

  } catch (error) {
    console.error('Error cleaning up carts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the cleanup function
cleanupInactiveProductsFromCarts(); 