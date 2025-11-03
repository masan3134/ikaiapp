const templateService = require('../services/templateService');

/**
 * Template Controller
 * Features #7, #13, #14: Teklif Şablonları
 */
class TemplateController {

  /**
   * Create template
   * POST /api/v1/offer-templates
   */
  async createTemplate(req, res) {
    try {
      const template = await templateService.createTemplate(req.body);

      res.status(201).json({
        success: true,
        message: 'Şablon oluşturuldu',
        data: template
      });
    } catch (error) {
      console.error('❌ Create template error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get all templates
   * GET /api/v1/offer-templates?categoryId=xxx&isActive=true&search=developer
   */
  async getTemplates(req, res) {
    try {
      const { categoryId, isActive, search } = req.query;

      const templates = await templateService.getTemplates({
        categoryId,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        search
      });

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('❌ Get templates error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get template by ID
   * GET /api/v1/offer-templates/:id
   */
  async getTemplateById(req, res) {
    try {
      const { id } = req.params;
      const template = await templateService.getTemplateById(id);

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      console.error('❌ Get template error:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update template
   * PUT /api/v1/offer-templates/:id
   */
  async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const template = await templateService.updateTemplate(id, req.body);

      res.json({
        success: true,
        message: 'Şablon güncellendi',
        data: template
      });
    } catch (error) {
      console.error('❌ Update template error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Delete template
   * DELETE /api/v1/offer-templates/:id
   */
  async deleteTemplate(req, res) {
    try {
      const { id } = req.params;
      await templateService.deleteTemplate(id);

      res.json({
        success: true,
        message: 'Şablon silindi'
      });
    } catch (error) {
      console.error('❌ Delete template error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Activate template
   * PATCH /api/v1/offer-templates/:id/activate
   */
  async activateTemplate(req, res) {
    try {
      const { id } = req.params;
      const template = await templateService.toggleTemplateStatus(id, true);

      res.json({
        success: true,
        message: 'Şablon aktif edildi',
        data: template
      });
    } catch (error) {
      console.error('❌ Activate template error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Deactivate template
   * PATCH /api/v1/offer-templates/:id/deactivate
   */
  async deactivateTemplate(req, res) {
    try {
      const { id } = req.params;
      const template = await templateService.toggleTemplateStatus(id, false);

      res.json({
        success: true,
        message: 'Şablon pasif edildi',
        data: template
      });
    } catch (error) {
      console.error('❌ Deactivate template error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Create offer from template
   * POST /api/v1/offer-templates/:id/create-offer
   * Features #14 + #8
   */
  async createOfferFromTemplate(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const offer = await templateService.createOfferFromTemplate(id, req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Teklif şablondan oluşturuldu',
        data: offer
      });
    } catch (error) {
      console.error('❌ Create offer from template error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Create new template category
   * POST /api/v1/template-categories
   */
  async createTemplateCategory(req, res) {
    try {
      const category = await templateService.createTemplateCategory(req.body);
      res.status(201).json({
        success: true,
        message: 'Şablon kategorisi oluşturuldu',
        data: category
      });
    } catch (error) {
      console.error('❌ Create template category error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get all template categories
   * GET /api/v1/template-categories
   */
  async getTemplateCategories(req, res) {
    try {
      const categories = await templateService.getTemplateCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('❌ Get template categories error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get template category by ID
   * GET /api/v1/template-categories/:id
   */
  async getTemplateCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await templateService.getTemplateCategoryById(id);
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('❌ Get template category by ID error:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update template category
   * PUT /api/v1/template-categories/:id
   */
  async updateTemplateCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await templateService.updateTemplateCategory(id, req.body);
      res.json({
        success: true,
        message: 'Şablon kategorisi güncellendi',
        data: category
      });
    } catch (error) {
      console.error('❌ Update template category error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Delete template category
   * DELETE /api/v1/template-categories/:id
   */
  async deleteTemplateCategory(req, res) {
    try {
      const { id } = req.params;
      await templateService.deleteTemplateCategory(id);
      res.json({
        success: true,
        message: 'Şablon kategorisi silindi'
      });
    } catch (error) {
      console.error('❌ Delete template category error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new TemplateController();
