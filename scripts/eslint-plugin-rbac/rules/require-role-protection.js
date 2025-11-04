/**
 * ESLint Rule: require-role-protection
 *
 * Enforces that all authenticated pages use withRoleProtection HOC
 *
 * Files checked: frontend/app/(authenticated)/**/page.tsx
 * Exceptions: dashboard, notifications, settings/profile (all roles allowed)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require withRoleProtection on authenticated pages',
      category: 'Security',
      recommended: true
    },
    messages: {
      missingProtection: 'Authenticated page must use withRoleProtection HOC',
      noDefaultExport: 'Page component must have a default export'
    },
    schema: []
  },

  create(context) {
    const filename = context.getFilename();

    // Only check files in app/(authenticated)/
    if (!filename.includes('app/(authenticated)/') || !filename.endsWith('page.tsx')) {
      return {};
    }

    // Exceptions (pages accessible to all roles)
    const exceptions = [
      'dashboard/page.tsx',
      'notifications/page.tsx',
      'settings/profile/page.tsx',
      'settings/security/page.tsx',
      'settings/notifications/page.tsx',
      'settings/overview/page.tsx',
      'onboarding/page.tsx'
    ];

    const isException = exceptions.some(exc => filename.endsWith(exc));
    if (isException) {
      return {};
    }

    let hasDefaultExport = false;
    let hasWithRoleProtection = false;
    let hasImport = false;

    return {
      // Check for import
      ImportDeclaration(node) {
        if (node.source.value.includes('withRoleProtection')) {
          hasImport = true;
        }
      },

      // Check for export
      ExportDefaultDeclaration(node) {
        hasDefaultExport = true;

        // Check if export uses withRoleProtection
        const { declaration } = node;

        // Case 1: export default withRoleProtection(Component, {...})
        if (
          declaration.type === 'CallExpression' &&
          declaration.callee.name === 'withRoleProtection'
        ) {
          hasWithRoleProtection = true;
        }
      },

      'Program:exit'() {
        if (!hasDefaultExport) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'noDefaultExport'
          });
          return;
        }

        if (!hasWithRoleProtection) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingProtection'
          });
        }
      }
    };
  }
};
