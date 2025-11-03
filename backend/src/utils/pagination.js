/**
 * Pagination Utilities
 *
 * IMPROVEMENT #4: Pagination Helpers
 * Provides consistent pagination across all list endpoints
 *
 * Features:
 * - Parse page/limit from query
 * - Calculate skip/take for Prisma
 * - Generate pagination metadata
 * - Link generation for next/prev pages
 *
 * Created: 2025-10-27
 */

/**
 * Parse pagination parameters from request query
 * @param {Object} query - Express req.query
 * @param {Object} options - Default options
 * @returns {Object} Parsed pagination params
 */
function parsePagination(query, options = {}) {
  const {
    defaultPage = 1,
    defaultLimit = 20,
    maxLimit = 100
  } = options;

  // Parse and validate page
  let page = parseInt(query.page, 10);
  if (isNaN(page) || page < 1) {
    page = defaultPage;
  }

  // Parse and validate limit
  let limit = parseInt(query.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  }
  if (limit > maxLimit) {
    limit = maxLimit;
  }

  // Calculate skip for database query
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    take: limit
  };
}

/**
 * Generate pagination metadata
 * @param {number} total - Total count of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} baseUrl - Base URL for links (optional)
 * @returns {Object} Pagination metadata
 */
function generatePaginationMeta(total, page, limit, baseUrl = null) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const meta = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage
  };

  // Add links if baseUrl provided
  if (baseUrl) {
    meta.links = {};

    if (hasPrevPage) {
      meta.links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
      meta.links.first = `${baseUrl}?page=1&limit=${limit}`;
    }

    if (hasNextPage) {
      meta.links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
      meta.links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
    }

    meta.links.self = `${baseUrl}?page=${page}&limit=${limit}`;
  }

  return meta;
}

/**
 * Create paginated response
 * @param {Array} data - Data items
 * @param {number} total - Total count
 * @param {Object} pagination - Pagination params from parsePagination
 * @param {string} baseUrl - Base URL for links (optional)
 * @returns {Object} Paginated response
 */
function createPaginatedResponse(data, total, pagination, baseUrl = null) {
  const { page, limit } = pagination;

  return {
    data,
    pagination: generatePaginationMeta(total, page, limit, baseUrl)
  };
}

/**
 * Prisma pagination helper
 * Returns skip/take object for Prisma queries
 * @param {Object} query - Express req.query
 * @param {Object} options - Options
 * @returns {Object} { skip, take }
 */
function getPrismaPagination(query, options = {}) {
  const { skip, take } = parsePagination(query, options);
  return { skip, take };
}

module.exports = {
  parsePagination,
  generatePaginationMeta,
  createPaginatedResponse,
  getPrismaPagination
};
