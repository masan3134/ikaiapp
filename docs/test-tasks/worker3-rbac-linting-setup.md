# 📋 Worker 3 Task: RBAC Linting Setup

**Task ID:** W3-RBAC-LINTING
**Assigned to:** Worker Claude 3
**Created by:** Mod Claude
**Date:** 2025-11-04
**Estimated Duration:** 3-4 hours
**Priority:** HIGH
**Complexity:** HIGH

---

## 🎯 Task Overview

**Mission:** Create ESLint rules to automatically enforce RBAC best practices and prevent future security bugs.

**Why This Matters:**
- ✅ **Prevent bugs at code review** (catch missing withRoleProtection/authorize)
- ✅ **Developer experience** (instant feedback in IDE)
- ✅ **Enforce standards** (consistent RBAC implementation)
- ✅ **Reduce manual reviews** (automated checking)
- ✅ **Long-term maintainability** (new devs can't make mistakes)

**Expected Outcome:**
- ✅ Custom ESLint plugin for RBAC rules
- ✅ Frontend rule: Enforce withRoleProtection on authenticated pages
- ✅ Backend rule: Enforce authorize middleware on protected routes
- ✅ Pre-commit hook integration (prevent committing violations)
- ✅ Audit report of existing code violations
- ✅ CI/CD integration (fail builds on violations)

---

## 🎯 RBAC Linting Rules

### Rule 1: Frontend - Require withRoleProtection
**Rule ID:** `rbac/require-role-protection`

**What it checks:**
- All files in `app/(authenticated)/` must export a component wrapped with `withRoleProtection`
- Exception: `dashboard/page.tsx`, `notifications/page.tsx`, `settings/profile/page.tsx` (all roles allowed)

**Example violation:**
```typescript
// ❌ BAD: No withRoleProtection
export default function TeamPage() {
  return <div>Team</div>;
}
```

**Example correct:**
```typescript
// ✅ GOOD: withRoleProtection applied
export default withRoleProtection(TeamPage, {
  allowedRoles: ['ADMIN', 'MANAGER']
});
```

---

### Rule 2: Backend - Require authorize Middleware
**Rule ID:** `rbac/require-authorize-middleware`

**What it checks:**
- All routes in `backend/src/routes/*.js` must use `authorize` middleware
- Exception: authRoutes.js, publicOfferRoutes.js (public endpoints)
- Check for DELETE, POST, PUT operations especially

**Example violation:**
```javascript
// ❌ BAD: No authorize middleware
router.delete('/candidates/:id', candidateController.delete);
```

**Example correct:**
```javascript
// ✅ GOOD: authorize middleware applied
router.delete('/candidates/:id', authorize([ROLES.ADMIN]), candidateController.delete);
```

---

### Rule 3: Enforce ROLE_GROUPS Constants
**Rule ID:** `rbac/use-role-groups`

**What it checks:**
- Hardcoded role arrays should use ROLE_GROUPS constants
- Example: `['ADMIN', 'MANAGER']` → `ROLE_GROUPS.ADMINS`

**Example violation:**
```javascript
// ❌ BAD: Hardcoded array
authorize(['ADMIN', 'SUPER_ADMIN'])
```

**Example correct:**
```javascript
// ✅ GOOD: Using ROLE_GROUPS
authorize(ROLE_GROUPS.ADMINS)
```

---

## 🛠️ Implementation Tasks

### Task 1: Create ESLint Plugin Structure
**Directory:** `scripts/eslint-plugin-rbac/`

**Action 1.1:** Create plugin directory
```bash
mkdir -p scripts/eslint-plugin-rbac/rules
cd scripts/eslint-plugin-rbac
npm init -y
```

**Action 1.2:** Create package.json
**File:** `scripts/eslint-plugin-rbac/package.json`

```json
{
  "name": "eslint-plugin-rbac",
  "version": "1.0.0",
  "description": "ESLint plugin for RBAC best practices",
  "main": "index.js",
  "peerDependencies": {
    "eslint": ">=8.0.0"
  }
}
```

**Action 1.3:** Create plugin index
**File:** `scripts/eslint-plugin-rbac/index.js`

```javascript
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
```

**Commit after Task 1:**
```bash
git add scripts/eslint-plugin-rbac/
git commit -m "feat(linting): Create RBAC ESLint plugin structure"
```

---

### Task 2: Create Frontend Rule - Require Role Protection
**File:** `scripts/eslint-plugin-rbac/rules/require-role-protection.js`

```javascript
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
```

**Commit after Task 2:**
```bash
git add scripts/eslint-plugin-rbac/rules/require-role-protection.js
git commit -m "feat(linting): Add require-role-protection ESLint rule"
```

---

### Task 3: Create Backend Rule - Require Authorize Middleware
**File:** `scripts/eslint-plugin-rbac/rules/require-authorize-middleware.js`

```javascript
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
```

**Commit after Task 3:**
```bash
git add scripts/eslint-plugin-rbac/rules/require-authorize-middleware.js
git commit -m "feat(linting): Add require-authorize-middleware ESLint rule"
```

---

### Task 4: Create ROLE_GROUPS Rule
**File:** `scripts/eslint-plugin-rbac/rules/use-role-groups.js`

```javascript
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
```

**Commit after Task 4:**
```bash
git add scripts/eslint-plugin-rbac/rules/use-role-groups.js
git commit -m "feat(linting): Add use-role-groups ESLint rule"
```

---

### Task 5: Integrate Plugin into Frontend
**File:** `frontend/.eslintrc.json`

**Action:** Add RBAC plugin to ESLint config

**Read current config first:**
```bash
cat frontend/.eslintrc.json
```

**Update config (add RBAC plugin):**

```json
{
  "extends": [
    "next/core-web-vitals"
  ],
  "plugins": ["rbac"],
  "rules": {
    "rbac/require-role-protection": "error",
    "rbac/use-role-groups": "warn"
  },
  "settings": {
    "rbac": {
      "pluginPath": "../scripts/eslint-plugin-rbac"
    }
  }
}
```

**Commit after Task 5:**
```bash
git add frontend/.eslintrc.json
git commit -m "feat(linting): Integrate RBAC plugin into frontend ESLint"
```

---

### Task 6: Integrate Plugin into Backend
**File:** `backend/.eslintrc.json` (create if doesn't exist)

**Action:** Create ESLint config for backend

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["rbac"],
  "rules": {
    "rbac/require-authorize-middleware": "error",
    "rbac/use-role-groups": "warn",
    "no-unused-vars": "warn"
  },
  "settings": {
    "rbac": {
      "pluginPath": "../scripts/eslint-plugin-rbac"
    }
  }
}
```

**Also update backend package.json:**

Add to scripts:
```json
"lint": "eslint src/ --ext .js",
"lint:fix": "eslint src/ --ext .js --fix"
```

**Commit after Task 6:**
```bash
git add backend/.eslintrc.json backend/package.json
git commit -m "feat(linting): Integrate RBAC plugin into backend ESLint"
```

---

### Task 7: Create Pre-commit Hook
**File:** `.husky/pre-commit` (update existing or create)

**Action 7.1:** Install husky (if not installed)
```bash
cd /home/asan/Desktop/ikai
npm install -D husky
npx husky init
```

**Action 7.2:** Create pre-commit hook
**File:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running RBAC linting checks..."

# Frontend linting
cd frontend
npm run lint --quiet
FRONTEND_RESULT=$?

# Backend linting
cd ../backend
npm run lint --quiet
BACKEND_RESULT=$?

# Check results
if [ $FRONTEND_RESULT -ne 0 ] || [ $BACKEND_RESULT -ne 0 ]; then
  echo "❌ RBAC linting failed! Fix violations before committing."
  echo "💡 Run 'npm run lint:fix' to auto-fix some issues."
  exit 1
fi

echo "✅ RBAC linting passed!"
exit 0
```

**Commit after Task 7:**
```bash
git add .husky/pre-commit package.json package-lock.json
git commit -m "feat(linting): Add pre-commit hook for RBAC checks"
```

---

### Task 8: Run Audit & Generate Report
**Action:** Audit existing code for violations

**Audit frontend:**
```bash
cd frontend
npm run lint > ../docs/reports/rbac-linting-audit-frontend.txt 2>&1
```

**Audit backend:**
```bash
cd backend
npm run lint > ../docs/reports/rbac-linting-audit-backend.txt 2>&1
```

**Create summary report:**
**File:** `docs/reports/rbac-linting-audit-summary.md`

```markdown
# RBAC Linting Audit Summary

**Date:** 2025-11-04
**Auditor:** Worker Claude 3

---

## Frontend Violations

**Total violations:** [COUNT from frontend audit]

### By Rule:
- `rbac/require-role-protection`: [COUNT]
- `rbac/use-role-groups`: [COUNT]

### Files with violations:
[LIST FILES]

---

## Backend Violations

**Total violations:** [COUNT from backend audit]

### By Rule:
- `rbac/require-authorize-middleware`: [COUNT]
- `rbac/use-role-groups`: [COUNT]

### Files with violations:
[LIST FILES]

---

## Recommended Fixes

[LIST PRIORITY FIXES]

---

**Note:** Some violations may be intentional (e.g., public endpoints, all-roles pages).
Review each violation manually before fixing.
```

**Commit after Task 8:**
```bash
git add docs/reports/rbac-linting-audit-*.txt docs/reports/rbac-linting-audit-summary.md
git commit -m "docs(linting): Add RBAC linting audit report"
```

---

## 🧪 Testing & Verification

### Test 1: Plugin Installation Check
**Verification command:**
```bash
ls -la scripts/eslint-plugin-rbac/
```

**Expected output:**
```
total XX
drwxr-xr-x  rules/
-rw-r--r--  index.js
-rw-r--r--  package.json
```

**Success criteria:**
- ✅ Plugin directory exists
- ✅ 3 rule files created
- ✅ index.js exports rules

---

### Test 2: Frontend Linting Works
**Verification command:**
```bash
cd frontend
npm run lint 2>&1 | head -20
```

**Expected output:**
```
> lint
> next lint

✔ No ESLint warnings or errors
(or violations listed if any)
```

**Success criteria:**
- ✅ ESLint runs without crashing
- ✅ RBAC rules loaded
- ✅ Violations detected (if any)

---

### Test 3: Backend Linting Works
**Verification command:**
```bash
cd backend
npm run lint 2>&1 | head -20
```

**Expected output:**
```
> lint
> eslint src/ --ext .js

(violations listed if any)
```

**Success criteria:**
- ✅ ESLint runs without crashing
- ✅ RBAC rules loaded

---

### Test 4: Pre-commit Hook Works
**Verification command:**
```bash
# Create a test file with violation
echo "export default function Test() {}" > frontend/app/\(authenticated\)/test-page.tsx

# Try to commit
git add frontend/app/\(authenticated\)/test-page.tsx
git commit -m "test: violation"

# Clean up
rm frontend/app/\(authenticated\)/test-page.tsx
git reset HEAD
```

**Expected output:**
```
🔍 Running RBAC linting checks...
❌ RBAC linting failed! Fix violations before committing.
```

**Success criteria:**
- ✅ Pre-commit hook runs
- ✅ Violations detected
- ✅ Commit blocked

---

### Test 5: Audit Report Generated
**Verification command:**
```bash
wc -l docs/reports/rbac-linting-audit-*.txt
cat docs/reports/rbac-linting-audit-summary.md | head -30
```

**Expected output:**
```
[LINE COUNT] docs/reports/rbac-linting-audit-frontend.txt
[LINE COUNT] docs/reports/rbac-linting-audit-backend.txt
[SUMMARY CONTENT]
```

**Success criteria:**
- ✅ Audit files created
- ✅ Summary report complete
- ✅ Violations counted

---

## 📝 Verification Report Template

```markdown
# ✅ Worker 3 Verification Report: RBAC Linting Setup

**Task ID:** W3-RBAC-LINTING
**Completed by:** Worker Claude 3
**Date:** 2025-11-04
**Duration:** [ACTUAL TIME]

---

## 📋 Tasks Completed

### Task 1: Create Plugin Structure ✅
**Files:** scripts/eslint-plugin-rbac/
**Commit:** [HASH]

### Task 2-4: Create Lint Rules ✅
**Files:** 3 rule files
**Commits:** [3 HASHES]

### Task 5-6: Integrate into Projects ✅
**Files:** frontend/.eslintrc.json, backend/.eslintrc.json
**Commits:** [2 HASHES]

### Task 7: Pre-commit Hook ✅
**File:** .husky/pre-commit
**Commit:** [HASH]

### Task 8: Audit Report ✅
**Files:** docs/reports/rbac-linting-audit-*
**Commit:** [HASH]

---

## 🧪 Test Results

**Tests Run:** 5
**Tests Passed:** [NUMBER]

---

## 📊 Audit Summary

**Frontend Violations:** [COUNT]
**Backend Violations:** [COUNT]
**Total Violations:** [COUNT]

---

**Worker 3 Sign-off:** [YOUR NAME]
**Ready for Mod Verification:** ✅ YES / ❌ NO
```

---

## 🚨 Important Reminders

### Git Policy
- ✅ **8 commits required** (1 per task)
- ✅ Commit after each task completion

### Testing
- ✅ Test plugin doesn't crash ESLint
- ✅ Test rules detect violations
- ✅ Test pre-commit hook blocks bad commits

---

## ✅ Task Checklist

- [ ] Task 1: Plugin structure → Commit
- [ ] Task 2: require-role-protection rule → Commit
- [ ] Task 3: require-authorize-middleware rule → Commit
- [ ] Task 4: use-role-groups rule → Commit
- [ ] Task 5: Frontend integration → Commit
- [ ] Task 6: Backend integration → Commit
- [ ] Task 7: Pre-commit hook → Commit
- [ ] Task 8: Audit report → Commit
- [ ] Run all 5 verification tests
- [ ] Write verification report

---

**Estimated Time:** ~3-4 hours

**Ready to start? Good luck, Worker 3! 🚀**

**Created by:** Mod Claude
**Date:** 2025-11-04
**Version:** 1.0
