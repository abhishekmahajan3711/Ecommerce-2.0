import Category from '../models/Category.js';

// Get all categories (for customer frontend)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// Get all categories for admin (including inactive)
export const getAllCategoriesForAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, icon, link, color, isActive, order } = req.body;
    
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = new Category({
      name,
      icon: icon || "📦",
      link: link || "/products",
      color: color || "bg-cyan-100",
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await category.save();
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, icon, link, color, isActive, order } = req.body;
    
    // Check if category exists
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if name is being changed and if it conflicts with another category
    if (name && name !== existingCategory.name) {
      const nameConflict = await Category.findOne({ name, _id: { $ne: req.params.id } });
      if (nameConflict) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        icon,
        link,
        color,
        isActive,
        order
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
}; 