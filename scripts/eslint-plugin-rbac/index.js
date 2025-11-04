module.exports = {
  rules: {
    'require-role-protection': require('./rules/require-role-protection'),
    'require-authorize-middleware': require('./rules/require-authorize-middleware'),
    'use-role-groups': require('./rules/use-role-groups')
  },
  configs: {
    recommended: {
      plugins: ['rbac'],
      rules: {
        'rbac/require-role-protection': 'error',
        'rbac/require-authorize-middleware': 'error',
        'rbac/use-role-groups': 'warn'
      }
    }
  }
};
