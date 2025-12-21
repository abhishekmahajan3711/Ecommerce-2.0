// Test script for ProductManagement component with new features
const fs = require('fs');
const path = require('path');

const productManagementPath = path.join(__dirname, 'src', 'Products', 'ProductManagement.js');

console.log('Testing ProductManagement component with new features...\n');

// Check if file exists
if (!fs.existsSync(productManagementPath)) {
  console.error('❌ ProductManagement.js file not found!');
  process.exit(1);
}

// Read the file
const content = fs.readFileSync(productManagementPath, 'utf8');

// Basic syntax checks
const checks = [
  {
    name: 'React imports',
    test: () => content.includes('import React') && content.includes('useState') && content.includes('useEffect'),
    error: 'Missing React imports (React, useState, useEffect)'
  },
  {
    name: 'Router imports',
    test: () => content.includes('useNavigate') && content.includes('react-router-dom'),
    error: 'Missing router imports (useNavigate, react-router-dom)'
  },
  {
    name: 'Axios import',
    test: () => content.includes('import axios'),
    error: 'Missing axios import'
  },
  {
    name: 'View mode state',
    test: () => content.includes('viewMode') && content.includes('setViewMode') && content.includes('useState(\'grid\')'),
    error: 'Missing view mode state management'
  },
  {
    name: 'Filter visibility state',
    test: () => content.includes('showFilters') && content.includes('setShowFilters') && content.includes('useState(true)'),
    error: 'Missing filter visibility state management'
  },
  {
    name: 'View controls in header',
    test: () => content.includes('View Controls') && content.includes('setViewMode(\'grid\')') && content.includes('setViewMode(\'list\')'),
    error: 'Missing view controls in header'
  },
  {
    name: 'Filter toggle button',
    test: () => content.includes('Filter Toggle') && content.includes('setShowFilters(!showFilters)'),
    error: 'Missing filter toggle button'
  },
  {
    name: 'Grid view implementation',
    test: () => content.includes('viewMode === \'grid\'') && content.includes('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'),
    error: 'Missing grid view implementation'
  },
  {
    name: 'List view implementation',
    test: () => content.includes('viewMode === \'list\'') && content.includes('space-y-4'),
    error: 'Missing list view implementation'
  },
  {
    name: 'Conditional filter rendering',
    test: () => content.includes('showFilters &&') && content.includes('Filters Section'),
    error: 'Missing conditional filter rendering'
  },
  {
    name: 'Results counter',
    test: () => content.includes('Results Counter') && content.includes('Showing') && content.includes('products.length'),
    error: 'Missing results counter'
  },
  {
    name: 'Grid view icons',
    test: () => content.includes('Grid View') && content.includes('title="Grid View"'),
    error: 'Missing grid view icons'
  },
  {
    name: 'List view icons',
    test: () => content.includes('List View') && content.includes('title="List View"'),
    error: 'Missing list view icons'
  },
  {
    name: 'Filter toggle icons',
    test: () => content.includes('Hide Filters') && content.includes('Show Filters'),
    error: 'Missing filter toggle icons'
  },
  {
    name: 'List view layout',
    test: () => content.includes('flex') && content.includes('w-48 h-48') && content.includes('flex-1'),
    error: 'Missing list view layout structure'
  },
  {
    name: 'Product cards in both views',
    test: () => content.includes('product.name') && content.includes('product.price') && content.includes('product.stock'),
    error: 'Missing product card structure'
  },
  {
    name: 'Action buttons in both views',
    test: () => content.includes('Edit') && content.includes('Delete') && content.includes('navigate'),
    error: 'Missing action buttons'
  },
  {
    name: 'Status badges',
    test: () => content.includes('isActive') && content.includes('isFeatured') && content.includes('isVegetarian'),
    error: 'Missing status badges'
  },
  {
    name: 'Pagination',
    test: () => content.includes('totalPages') && content.includes('currentPage') && content.includes('setCurrentPage'),
    error: 'Missing pagination functionality'
  },
  {
    name: 'Export statement',
    test: () => content.includes('export default ProductManagement'),
    error: 'Missing export statement'
  }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  try {
    if (check.test()) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}: ${check.error}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${check.name}: Test failed with error - ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed! ProductManagement component with new features looks good.');
} else {
  console.log('⚠️  Some tests failed. Please check the issues above.');
}

// Check for specific features
const features = [];

if (content.includes('bg-gradient-to-r from-blue-600 to-blue-700')) {
  features.push('Active view mode highlighting');
}

if (content.includes('bg-gradient-to-r from-purple-600 to-purple-700')) {
  features.push('Active filter toggle highlighting');
}

if (content.includes('hover:shadow-2xl')) {
  features.push('Hover effects on product cards');
}

if (content.includes('transition-all duration-300')) {
  features.push('Smooth transitions');
}

if (content.includes('line-clamp-2')) {
  features.push('Text truncation for descriptions');
}

if (content.includes('backdrop-blur-sm')) {
  features.push('Modern backdrop blur effects');
}

if (features.length > 0) {
  console.log('\n✨ Features detected:');
  features.forEach(feature => console.log(`   - ${feature}`));
}

console.log('\n🚀 ProductManagement component with view modes and filter toggle test completed!'); 