const { PrismaClient } = require('@prisma/client');
const offerService = require('./offerService');

const prisma = new PrismaClient();

/**
 * Template Service for Offer Templates
 * Features #7, #8, #13, #14: Teklif Şablonları
 */

/**
 * Create new template
 * Feature #13: Template Yönetimi
 */
async function createTemplate(data) {
  try {
    const template = await prisma.offerTemplate.create({
      data: {
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId || null,
        position: data.position,
        department: data.department,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        currency: data.currency || 'TRY',
        benefits: data.benefits || {},
        workType: data.workType || 'office',
        terms: data.terms || '',
        emailSubject: data.emailSubject || `İş Teklifi - ${data.position}`,
        emailBody: data.emailBody || ''
      },
      include: {
        category: true
      }
    });

    console.log(`✅ Template created: ${template.name}`);
    return template;
  } catch (error) {
    console.error('❌ Create template error:', error);
    throw error;
  }
}

/**
 * Get all templates with filters
 * Feature #7: Teklif Şablonları
 */
async function getTemplates(filters = {}) {
  try {
    const { categoryId, isActive, search } = filters;

    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ];
    }

    const templates = await prisma.offerTemplate.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { offers: true }
        }
      },
      orderBy: [
        { usageCount: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return templates;
  } catch (error) {
    console.error('❌ Get templates error:', error);
    throw error;
  }
}

/**
 * Get template by ID
 */
async function getTemplateById(id) {
  try {
    const template = await prisma.offerTemplate.findUnique({
      where: { id },
      include: {
        category: true,
        offers: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            candidate: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!template) {
      throw new Error('Template not found');
    }

    return template;
  } catch (error) {
    console.error('❌ Get template error:', error);
    throw error;
  }
}

/**
 * Update template
 */
async function updateTemplate(id, data) {
  try {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.salaryMin !== undefined) updateData.salaryMin = data.salaryMin;
    if (data.salaryMax !== undefined) updateData.salaryMax = data.salaryMax;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.benefits !== undefined) updateData.benefits = data.benefits;
    if (data.workType !== undefined) updateData.workType = data.workType;
    if (data.terms !== undefined) updateData.terms = data.terms;
    if (data.emailSubject !== undefined) updateData.emailSubject = data.emailSubject;
    if (data.emailBody !== undefined) updateData.emailBody = data.emailBody;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await prisma.offerTemplate.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    console.log(`✅ Template updated: ${id}`);
    return updated;
  } catch (error) {
    console.error('❌ Update template error:', error);
    throw error;
  }
}

/**
 * Delete template
 */
async function deleteTemplate(id) {
  try {
    // Check if template is being used
    const template = await prisma.offerTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { offers: true }
        }
      }
    });

    if (template && template._count.offers > 0) {
      throw new Error(`Cannot delete template. ${template._count.offers} offers are using this template.`);
    }

    await prisma.offerTemplate.delete({
      where: { id }
    });

    console.log(`✅ Template deleted: ${id}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Delete template error:', error);
    throw error;
  }
}

/**
 * Activate/Deactivate template
 */
async function toggleTemplateStatus(id, isActive) {
  try {
    const updated = await prisma.offerTemplate.update({
      where: { id },
      data: { isActive }
    });

    console.log(`✅ Template ${isActive ? 'activated' : 'deactivated'}: ${id}`);
    return updated;
  } catch (error) {
    console.error('❌ Toggle template status error:', error);
    throw error;
  }
}

/**
 * Create offer from template
 * Features #14: Şablondan Teklif Oluştur
 * Feature #8: Pozisyon Bazlı Otomatik Doldurma
 */
async function createOfferFromTemplate(templateId, overrides, userId) {
  try {
    // Get template
    const template = await prisma.offerTemplate.findUnique({
      where: { id: templateId },
      include: { category: true }
    });

    if (!template) {
      throw new Error('Template not found');
    }

    if (!template.isActive) {
      throw new Error('Template is not active');
    }

    // Merge template data with overrides (Feature #8: Auto-fill)
    const offerData = {
      templateId: template.id,
      position: overrides.position || template.position,
      department: overrides.department || template.department,
      salary: overrides.salary || template.salaryMin, // Use min as default
      currency: overrides.currency || template.currency,
      workType: overrides.workType || template.workType,
      benefits: { ...template.benefits, ...(overrides.benefits || {}) },
      terms: overrides.terms || template.terms,
      candidateId: overrides.candidateId, // Required override
      jobPostingId: overrides.jobPostingId // Required override
    };

    // Validate required overrides
    if (!offerData.candidateId || !offerData.jobPostingId) {
      throw new Error('candidateId and jobPostingId are required');
    }

    // Create offer using offer service
    const offer = await offerService.createOffer(offerData, userId);

    // Increment template usage count
    await prisma.offerTemplate.update({
      where: { id: templateId },
      data: { usageCount: { increment: 1 } }
    });



    return offer;
  } catch (error) {
    console.error('❌ Create offer from template error:', error);
    throw error;
  }
}

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  toggleTemplateStatus,
  createOfferFromTemplate,
  // New category functions
  createTemplateCategory,
  getTemplateCategories,
  getTemplateCategoryById,
  updateTemplateCategory,
  deleteTemplateCategory,
};

/**
 * Create new template category
 */
async function createTemplateCategory(data) {
  try {
    const category = await prisma.templateCategory.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
    });
    console.log(`✅ Template category created: ${category.name}`);
    return category;
  } catch (error) {
    console.error('❌ Create template category error:', error);
    throw error;
  }
}

/**
 * Get all template categories
 */
async function getTemplateCategories() {
  try {
    const categories = await prisma.templateCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch (error) {
    console.error('❌ Get template categories error:', error);
    throw error;
  }
}

/**
 * Get template category by ID
 */
async function getTemplateCategoryById(id) {
  try {
    const category = await prisma.templateCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { offerTemplates: true }
        }
      }
    });
    if (!category) {
      throw new Error('Template category not found');
    }
    return category;
  } catch (error) {
    console.error('❌ Get template category by ID error:', error);
    throw error;
  }
}

/**
 * Update template category
 */
async function updateTemplateCategory(id, data) {
  try {
    const updated = await prisma.templateCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
      },
    });
    console.log(`✅ Template category updated: ${id}`);
    return updated;
  } catch (error) {
    console.error('❌ Update template category error:', error);
    throw error;
  }
}

/**
 * Delete template category
 */
async function deleteTemplateCategory(id) {
  try {
    const category = await prisma.templateCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { offerTemplates: true }
        }
      }
    });

    if (category && category._count.offerTemplates > 0) {
      throw new Error(`Cannot delete category. ${category._count.offerTemplates} templates are using this category.`);
    }

    await prisma.templateCategory.delete({
      where: { id }
    });
    console.log(`✅ Template category deleted: ${id}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Delete template category error:', error);
    throw error;
  }
}
