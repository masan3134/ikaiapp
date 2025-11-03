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
  acceptInvitation
} = require('../controllers/teamController');

// All routes require authentication, organization isolation, and ADMIN/SUPER_ADMIN role
const adminOnly = [authenticateToken, enforceOrganizationIsolation, authorize(['ADMIN', 'SUPER_ADMIN'])];

// POST /api/v1/team/accept-invitation - Accept invitation (PUBLIC - no auth)
router.post('/accept-invitation', acceptInvitation);

// GET /api/v1/team - List all team members
router.get('/', ...adminOnly, getTeamMembers);

// GET /api/v1/team/:id - Get single team member
router.get('/:id', ...adminOnly, getTeamMember);

// POST /api/v1/team/invite - Invite new team member
router.post('/invite', ...adminOnly, inviteTeamMember);

// PATCH /api/v1/team/:id - Update team member
router.patch('/:id', ...adminOnly, updateTeamMember);

// PATCH /api/v1/team/:id/toggle - Toggle active status
router.patch('/:id/toggle', ...adminOnly, toggleTeamMember);

// DELETE /api/v1/team/:id - Delete team member
router.delete('/:id', ...adminOnly, deleteTeamMember);

module.exports = router;
