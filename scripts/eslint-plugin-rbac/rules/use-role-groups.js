/**
 * ESLint Rule: use-role-groups
 *
 * Suggests using ROLE_GROUPS constants instead of hardcoded arrays
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer ROLE_GROUPS constants over hardcoded role arrays',
      category: 'Best Practices',
      recommended: true
    },
    messages: {
      useRoleGroup: 'Use ROLE_GROUPS.{{group}} instead of hardcoded array'
    },
    schema: []
  },

  create(context) {
    // Known role groups and their members
    const roleGroups = {
      ADMINS: ['SUPER_ADMIN', 'ADMIN'],
      MANAGERS_PLUS: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
      HR_MANAGERS: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'],
      TEAM_VIEWERS: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
      ANALYTICS_VIEWERS: ['SUPER_ADMIN', 'ADMIN', 'MANAGER']
    };

    function matchesRoleGroup(elements) {
      const roles = elements
        .map(el => el.value)
        .sort()
        .join(',');

      for (const [groupName, groupRoles] of Object.entries(roleGroups)) {
        const groupStr = groupRoles.sort().join(',');
        if (roles === groupStr) {
          return groupName;
        }
      }

      return null;
    }

    return {
      CallExpression(node) {
        // Check authorize([...]) or withRoleProtection(..., { allowedRoles: [...] })
        if (node.callee.name === 'authorize') {
          const rolesArg = node.arguments[0];

          if (rolesArg && rolesArg.type === 'ArrayExpression') {
            const matchedGroup = matchesRoleGroup(rolesArg.elements);

            if (matchedGroup) {
              context.report({
                node: rolesArg,
                messageId: 'useRoleGroup',
                data: { group: matchedGroup }
              });
            }
          }
        }
      }
    };
  }
};
