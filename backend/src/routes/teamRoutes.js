const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const {
  getTeamMembers,
  getTeamMember,
  inviteTeamMember,
  updateTeamMember,
  toggleTeamMember,
  deleteTeamMember,
  acceptInvitation,
  getTeamStats,
  getTeamHierarchy
} = require('../controllers/teamController');

// Read operations (MANAGER can view team)
const teamViewers = [authenticateToken, enforceOrganizationIsolation, authorize(['ADMIN', 'SUPER_ADMIN', 'MANAGER'])];

// Team management operations (MANAGER can manage team)
const teamManagers = [authenticateToken, enforceOrganizationIsolation, authorize(['ADMIN', 'SUPER_ADMIN', 'MANAGER'])];

// Critical write operations (ADMIN only - org settings, billing, etc)
const adminOnly = [authenticateToken, enforceOrganizationIsolation, authorize(['ADMIN', 'SUPER_ADMIN'])];

// POST /api/v1/team/accept-invitation - Accept invitation (PUBLIC - no auth)
router.post('/accept-invitation', acceptInvitation);

// GET /api/v1/team - List all team members (MANAGER can view)
router.get('/', ...teamViewers, getTeamMembers);

// GET /api/v1/team/stats - Get team statistics (MANAGER can view)
router.get('/stats', ...teamViewers, getTeamStats);

// GET /api/v1/team/hierarchy - Get team hierarchy (MANAGER can view)
router.get('/hierarchy', ...teamViewers, getTeamHierarchy);

// GET /api/v1/team/:id - Get single team member (MANAGER can view)
router.get('/:id', ...teamViewers, getTeamMember);

// POST /api/v1/team/invite - Invite new team member (MANAGER can invite)
router.post('/invite', ...teamManagers, inviteTeamMember);

// PATCH /api/v1/team/:id - Update team member (MANAGER can update)
router.patch('/:id', ...teamManagers, updateTeamMember);

// PATCH /api/v1/team/:id/toggle - Toggle active status (MANAGER can toggle)
router.patch('/:id/toggle', ...teamManagers, toggleTeamMember);

// DELETE /api/v1/team/:id - Delete team member (MANAGER can delete)
router.delete('/:id', ...teamManagers, deleteTeamMember);

module.exports = router;
