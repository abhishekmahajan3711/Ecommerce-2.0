// Test script for AddProduct component
const fs = require('fs');
const path = require('path');

const addProductPath = path.join(__dirname, 'src', 'Products', 'AddProduct.js');

console.log('Testing AddProduct component...\n');

// Check if file exists
if (!fs.existsSync(addProductPath)) {
  console.error('❌ AddProduct.js file not found!');
  process.exit(1);
}

// Read the file
const content = fs.readFileSync(addProductPath, 'utf8');

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
    name: 'Component definition',
    test: () => content.includes('const AddProduct = () => {'),
    error: 'Component not properly defined'
  },
  {
    name: 'State management',
    test: () => content.includes('useState') && content.includes('formData') && content.includes('setFormData'),
    error: 'Missing state management (formData, setFormData)'
  },
  {
    name: 'Form handlers',
    test: () => content.includes('handleChange') && content.includes('handleSubmit'),
    error: 'Missing form handlers (handleChange, handleSubmit)'
  },
  {
    name: 'Array handlers',
    test: () => content.includes('handleArrayChange') && content.includes('addArrayItem') && content.includes('removeArrayItem'),
    error: 'Missing array handlers (handleArrayChange, addArrayItem, removeArrayItem)'
  },
  {
    name: 'Nested handlers',
    test: () => content.includes('handleNestedChange'),
    error: 'Missing nested handlers (handleNestedChange)'
  },
  {
    name: 'Form structure',
    test: () => content.includes('<form') && content.includes('onSubmit={handleSubmit}'),
    error: 'Missing form structure with onSubmit handler'
  },
  {
    name: 'Required fields',
    test: () => content.includes('name="name"') && content.includes('name="price"') && content.includes('name="category"'),
    error: 'Missing required form fields (name, price, category)'
  },
  {
    name: 'Modern styling classes',
    test: () => content.includes('shadow-xl') && content.includes('rounded-2xl') && content.includes('border-gray-100'),
    error: 'Missing modern styling classes (shadow-xl, rounded-2xl, border-gray-100)'
  },
  {
    name: 'Section headers with icons',
    test: () => content.includes('text-xl font-bold') && content.includes('flex items-center') && content.includes('svg'),
    error: 'Missing section headers with icons'
  },
  {
    name: 'Gradient buttons',
    test: () => content.includes('bg-gradient-to-r') && content.includes('hover:from-'),
    error: 'Missing gradient button styling'
  },
  {
    name: 'Submit buttons',
    test: () => content.includes('type="submit"') && content.includes('disabled={loading}'),
    error: 'Missing submit button with loading state'
  },
  {
    name: 'Export statement',
    test: () => content.includes('export default AddProduct'),
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
  console.log('🎉 All tests passed! AddProduct component looks good.');
} else {
  console.log('⚠️  Some tests failed. Please check the issues above.');
}

// Check for common issues
const warnings = [];

if (!content.includes('required')) {
  warnings.push('No required field validation found');
}

if (!content.includes('placeholder')) {
  warnings.push('No placeholder text found');
}

if (!content.includes('focus:ring')) {
  warnings.push('No focus ring styling found');
}

if (!content.includes('transition-all')) {
  warnings.push('No transition effects found');
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(warning => console.log(`   - ${warning}`));
}

console.log('\n✨ AddProduct component test completed!'); 