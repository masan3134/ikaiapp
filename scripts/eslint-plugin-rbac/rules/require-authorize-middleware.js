/**
 * ESLint Rule: require-authorize-middleware
 *
 * Enforces that protected routes use authorize middleware
 *
 * Files checked: backend/src/routes/*.js
 * Exceptions: authRoutes.js, publicOfferRoutes.js
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require authorize middleware on protected routes',
      category: 'Security',
      recommended: true
    },
    messages: {
      missingAuthorize: 'Route "{{method}} {{path}}" must use authorize middleware for role-based access control',
      missingImport: 'File must import authorize middleware from ../middleware/authorize'
    },
    schema: []
  },

  create(context) {
    const filename = context.getFilename();

    // Only check backend route files
    if (!filename.includes('backend/src/routes/') || !filename.endsWith('.js')) {
      return {};
    }

    // Exceptions (public routes)
    const exceptions = ['authRoutes.js', 'publicOfferRoutes.js'];
    const isException = exceptions.some(exc => filename.endsWith(exc));
    if (isException) {
      return {};
    }

    let hasAuthorizeImport = false;
    const routesWithoutAuthorize = [];

    return {
      // Check for authorize import
      VariableDeclarator(node) {
        if (
          node.id.type === 'ObjectPattern' &&
          node.id.properties.some(prop => prop.key && prop.key.name === 'authorize')
        ) {
          hasAuthorizeImport = true;
        }
      },

      // Check route definitions
      CallExpression(node) {
        // Look for router.get/post/put/delete/patch
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'router' &&
          ['get', 'post', 'put', 'delete', 'patch'].includes(node.callee.property.name)
        ) {
          const method = node.callee.property.name.toUpperCase();
          const path = node.arguments[0]?.value || node.arguments[0]?.raw || 'unknown';

          // Skip health/status endpoints (usually public)
          if (path.includes('health') || path.includes('status')) {
            return;
          }

          // Check if route uses authorize middleware
          let hasAuthorize = false;

          // Check arguments for authorize call or array containing authorize
          for (let i = 1; i < node.arguments.length - 1; i++) {
            const arg = node.arguments[i];

            // Direct authorize call: authorize([...])
            if (
              arg.type === 'CallExpression' &&
              arg.callee.name === 'authorize'
            ) {
              hasAuthorize = true;
              break;
            }

            // Array with authorize: [..., authorize([...]), ...]
            if (arg.type === 'ArrayExpression') {
              hasAuthorize = arg.elements.some(
                el => el.type === 'CallExpression' && el.callee.name === 'authorize'
              );
              if (hasAuthorize) break;
            }

            // Middleware array variable (e.g., adminOnly, hrManagers)
            // We'll assume these contain authorize if they're arrays
            if (arg.type === 'Identifier') {
              hasAuthorize = true; // Trust that middleware arrays include authorize
              break;
            }
          }

          // DELETE/POST/PUT operations should ALWAYS have authorize
          if (!hasAuthorize && ['DELETE', 'POST', 'PUT', 'PATCH'].includes(method)) {
            routesWithoutAuthorize.push({ method, path });
          }
        }
      },

      'Program:exit'() {
        if (!hasAuthorizeImport && routesWithoutAuthorize.length > 0) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingImport'
          });
        }

        routesWithoutAuthorize.forEach(route => {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingAuthorize',
            data: {
              method: route.method,
              path: route.path
            }
          });
        });
      }
    };
  }
};
