const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Category Service for Offer Templates
 * Feature #30: Teklif Şablon Kategorileri
 */

/**
 * Create new category
 */
async function createCategory(data) {
  try {
    // Get max order for new category
    const maxOrder = await prisma.offerTemplateCategory.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    const category = await prisma.offerTemplateCategory.create({
      data: {
        name: data.name,
        description: data.description || null,
        color: data.color || null,
        icon: data.icon || null,
        order: maxOrder ? maxOrder.order + 1 : 0
      }
    });

    console.log(`✅ Category created: ${category.name}`);
    return category;
  } catch (error) {
    console.error('❌ Create category error:', error);
    throw error;
  }
}

/**
 * Get all categories
 */
async function getCategories() {
  try {
    const categories = await prisma.offerTemplateCategory.findMany({
      include: {
        _count: {
          select: { templates: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    return categories;
  } catch (error) {
    console.error('❌ Get categories error:', error);
    throw error;
  }
}

/**
 * Get category by ID
 */
async function getCategoryById(id) {
  try {
    const category = await prisma.offerTemplateCategory.findUnique({
      where: { id },
      include: {
        templates: {
          where: { isActive: true },
          orderBy: { usageCount: 'desc' }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    console.error('❌ Get category error:', error);
    throw error;
  }
}

/**
 * Update category
 */
async function updateCategory(id, data) {
  try {
    const updated = await prisma.offerTemplateCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon
      }
    });

    console.log(`✅ Category updated: ${id}`);
    return updated;
  } catch (error) {
    console.error('❌ Update category error:', error);
    throw error;
  }
}

/**
 * Delete category
 */
async function deleteCategory(id) {
  try {
    // Check if category has templates
    const category = await prisma.offerTemplateCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { templates: true }
        }
      }
    });

    if (category && category._count.templates > 0) {
      throw new Error('Cannot delete category with templates. Please reassign or delete templates first.');
    }

    await prisma.offerTemplateCategory.delete({
      where: { id }
    });

    console.log(`✅ Category deleted: ${id}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Delete category error:', error);
    throw error;
  }
}

/**
 * Reorder categories
 */
async function reorderCategories(categoryIds) {
  try {
    // Update order for each category
    const updates = categoryIds.map((id, index) =>
      prisma.offerTemplateCategory.update({
        where: { id },
        data: { order: index }
      })
    );

    await Promise.all(updates);

    
    return { success: true };
  } catch (error) {
    console.error('❌ Reorder categories error:', error);
    throw error;
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  reorderCategories
};
