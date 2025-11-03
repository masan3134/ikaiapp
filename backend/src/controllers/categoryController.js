const categoryService = require('../services/categoryService');

/**
 * Category Controller
 * Feature #30: Teklif Şablon Kategorileri
 */
class CategoryController {

  /**
   * Create category
   * POST /api/v1/offer-template-categories
   */
  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory({
        ...req.body,
        organizationId: req.organizationId
      });

      res.status(201).json({
        success: true,
        message: 'Kategori oluşturuldu',
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get all categories
   * GET /api/v1/offer-template-categories
   */
  async getCategories(req, res) {
    try {
      const categories = await categoryService.getCategories(req.organizationId);

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get category by ID
   * GET /api/v1/offer-template-categories/:id
   */
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id, req.organizationId);

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update category
   * PUT /api/v1/offer-template-categories/:id
   */
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body, req.organizationId);

      res.json({
        success: true,
        message: 'Kategori güncellendi',
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Delete category
   * DELETE /api/v1/offer-template-categories/:id
   */
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id, req.organizationId);

      res.json({
        success: true,
        message: 'Kategori silindi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Reorder categories
   * PATCH /api/v1/offer-template-categories/reorder
   */
  async reorderCategories(req, res) {
    try {
      const { categoryIds } = req.body;
      await categoryService.reorderCategories(categoryIds, req.organizationId);

      res.json({
        success: true,
        message: 'Kategoriler yeniden sıralandı'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new CategoryController();
