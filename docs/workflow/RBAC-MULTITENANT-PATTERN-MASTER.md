# 🔒 RBAC & Multi-Tenant Pattern Master

**Version:** 1.0
**Date:** 2025-11-05
**Purpose:** Single source of truth for RBAC & Multi-Tenant implementation patterns

---

## 🎯 WHAT IS THIS?

**The complete blueprint for implementing secure, role-based, multi-tenant features in IKAI.**

Use this document when:
- ✅ Adding new API endpoints
- ✅ Creating new frontend pages
- ✅ Implementing any user-facing feature
- ✅ Writing tests for security
- ✅ Reviewing security implementations

**Copy-paste ready code examples included!**

---

## 👥 ROLE DEFINITIONS

### 5 Roles in IKAI

| Role | Level | Scope | Description |
|------|-------|-------|-------------|
| **SUPER_ADMIN** | System | All organizations | System-wide management (Mustafa only) |
| **ADMIN** | Organization | Own org | Full access to organization |
| **HR_SPECIALIST** | Organization | Own org | HR operations (hiring, employees) |
| **MANAGER** | Department | Own department | Team management, approvals |
| **USER** | Individual | Self only | Basic employee access |

---

## 🔐 CORE SECURITY PRINCIPLES

### 1. Organization Isolation (Multi-Tenant)

**Rule:** Users can ONLY access data from their own organization.

**Exceptions:**
- SUPER_ADMIN can access ALL organizations

**Implementation:**
```javascript
// Backend: Use organizationIsolation middleware
router.use(authenticate);
router.use(organizationIsolation);  // ✅ ALWAYS use this!

// Prisma query
const data = await prisma.model.findMany({
  where: {
    organizationId: req.user.organizationId  // ✅ Always filter by org
  }
});
```

### 2. Department Isolation

**Rule:** MANAGER sees ONLY their department's data.

**Implementation:**
```javascript
// Backend: Department filter for MANAGER
const where = {
  organizationId: req.user.organizationId
};

if (req.user.role === 'MANAGER') {
  where.departmentId = req.user.departmentId;  // ✅ Dept filter
}

const employees = await prisma.employee.findMany({ where });
```

### 3. Self-Only Access

**Rule:** USER can ONLY access their own data.

**Implementation:**
```javascript
// Backend: Self-only check
if (req.user.role === 'USER') {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }
  });

  if (employee.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });  // ✅ Block!
  }
}
```

### 4. Sensitive Data Protection

**Rule:** Salary and other sensitive fields visible to ADMIN + HR only.

**Implementation:**
```javascript
// Backend: Filter sensitive fields
const canViewSalary = ['ADMIN', 'HR_SPECIALIST'].includes(req.user.role);

const employee = await prisma.employee.findUnique({
  where: { id },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    salary: canViewSalary,  // ✅ Conditional select
    // ... other fields
  }
});

// OR: Remove after query
if (!canViewSalary) {
  delete employee.salary;
}
```

---

## 🛠️ BACKEND PATTERNS

### Pattern 1: Basic CRUD Endpoint

```javascript
// File: backend/src/routes/resourceRoutes.js

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { organizationIsolation } = require('../middleware/organizationIsolation');

// ✅ ALWAYS: authenticate + organizationIsolation
router.use(authenticate);
router.use(organizationIsolation);

// LIST: Who can view?
router.get('/',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),  // ✅ Define roles
  async (req, res) => {
    const where = {
      organizationId: req.user.organizationId  // ✅ Org filter
    };

    // ✅ MANAGER: Department filter
    if (req.user.role === 'MANAGER') {
      where.departmentId = req.user.departmentId;
    }

    const data = await prisma.resource.findMany({ where });
    res.json({ success: true, data });
  }
);

// CREATE: Who can create?
router.post('/',
  authorize(['ADMIN', 'HR_SPECIALIST']),  // ✅ Only ADMIN + HR
  async (req, res) => {
    const data = await prisma.resource.create({
      data: {
        ...req.body,
        organizationId: req.user.organizationId,  // ✅ Force org
        createdBy: req.user.id  // ✅ Track creator
      }
    });
    res.status(201).json({ success: true, data });
  }
);

// UPDATE: Who can update?
router.put('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  async (req, res) => {
    // ✅ Verify ownership
    const existing = await prisma.resource.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId  // ✅ Must be same org
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }

    const updated = await prisma.resource.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({ success: true, data: updated });
  }
);

// DELETE: Who can delete?
router.delete('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  async (req, res) => {
    // ✅ Soft delete preferred
    const deleted = await prisma.resource.update({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId  // ✅ Org check
      },
      data: {
        deletedAt: new Date(),
        deletedBy: req.user.id
      }
    });

    res.json({ success: true, message: 'Deleted' });
  }
);

module.exports = router;
```

### Pattern 2: MANAGER Department Isolation

```javascript
// Controller function with dept isolation
exports.listResources = async (req, res) => {
  try {
    const { departmentId, search } = req.query;

    const where = {
      organizationId: req.user.organizationId
    };

    // ✅ MANAGER: Force their department
    if (req.user.role === 'MANAGER') {
      where.departmentId = req.user.departmentId;
    }
    // ✅ ADMIN/HR: Can filter by department
    else if (departmentId) {
      where.departmentId = departmentId;
    }

    // ✅ Search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        department: true,
        createdBy: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    res.json({ success: true, data: resources });

  } catch (error) {
    console.error('Error listing resources:', error);
    res.status(500).json({ error: 'Failed to list resources' });
  }
};
```

### Pattern 3: USER Self-Only Access

```javascript
// GET /api/v1/employees/:id
exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId  // ✅ Org check
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // ✅ USER: Can only view self
    if (req.user.role === 'USER' && employee.userId !== req.user.id) {
      return res.status(403).json({
        error: 'You can only view your own profile'
      });
    }

    // ✅ MANAGER: Can only view their department
    if (req.user.role === 'MANAGER' &&
        employee.departmentId !== req.user.departmentId) {
      return res.status(403).json({
        error: 'You can only view employees in your department'
      });
    }

    // ✅ Filter sensitive data
    const canViewSalary = ['ADMIN', 'HR_SPECIALIST'].includes(req.user.role);
    if (!canViewSalary) {
      delete employee.salary;
    }

    res.json({ success: true, data: employee });

  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).json({ error: 'Failed to get employee' });
  }
};
```

### Pattern 4: SUPER_ADMIN Cross-Org Access

```javascript
// GET /api/v1/super-admin/organizations
// SUPER_ADMIN can see ALL organizations

router.get('/organizations',
  authenticate,
  authorize(['SUPER_ADMIN']),  // ✅ SUPER_ADMIN only
  async (req, res) => {
    // ✅ NO organizationIsolation middleware!
    // ✅ NO organizationId filter in query!

    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            employees: true
          }
        }
      }
    });

    res.json({ success: true, data: organizations });
  }
);
```

---

## 🎨 FRONTEND PATTERNS

### Pattern 1: Route Protection

```typescript
// File: frontend/app/(authenticated)/employees/page.tsx

import { withRoleProtection } from '@/lib/auth/withRoleProtection';

function EmployeesPage() {
  // ... component code
}

// ✅ Protect route with RBAC
export default withRoleProtection(
  EmployeesPage,
  ['ADMIN', 'HR_SPECIALIST', 'MANAGER']  // ✅ Allowed roles
);
```

### Pattern 2: Conditional UI Rendering

```typescript
// File: frontend/components/EmployeeList.tsx

import { useHasRole } from '@/lib/hooks/useHasRole';

export function EmployeeList() {
  const canCreateEmployee = useHasRole(['ADMIN', 'HR_SPECIALIST']);
  const canEditEmployee = useHasRole(['ADMIN', 'HR_SPECIALIST']);
  const isManager = useHasRole(['MANAGER']);

  return (
    <div>
      {/* ✅ Show create button only to ADMIN + HR */}
      {canCreateEmployee && (
        <Button onClick={handleCreate}>
          Create Employee
        </Button>
      )}

      {/* ✅ Show edit button based on role */}
      {employees.map(emp => (
        <div key={emp.id}>
          {emp.name}
          {canEditEmployee && (
            <Button onClick={() => handleEdit(emp.id)}>
              Edit
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 3: Department Filter (MANAGER)

```typescript
// File: frontend/app/(authenticated)/employees/page.tsx

import { useSession } from '@/lib/auth/useSession';

export default function EmployeesPage() {
  const { user } = useSession();
  const isManager = user?.role === 'MANAGER';

  const { employees } = useEmployees({
    // ✅ MANAGER: Automatically filtered by backend
    // ✅ ADMIN/HR: Can filter manually
    departmentId: isManager ? undefined : selectedDepartment
  });

  return (
    <div>
      {/* ✅ Show department filter only to ADMIN/HR */}
      {!isManager && (
        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
        >
          {/* ... department options */}
        </Select>
      )}

      {/* ✅ Employee list (already filtered by backend) */}
      <EmployeeTable employees={employees} />
    </div>
  );
}
```

### Pattern 4: Sensitive Data (Salary)

```typescript
// File: frontend/components/EmployeeDetail.tsx

import { useHasRole } from '@/lib/hooks/useHasRole';

export function EmployeeDetail({ employee }: { employee: Employee }) {
  const canViewSalary = useHasRole(['ADMIN', 'HR_SPECIALIST']);

  return (
    <div>
      <h2>{employee.firstName} {employee.lastName}</h2>
      <p>Department: {employee.department.name}</p>

      {/* ✅ Show salary only to ADMIN + HR */}
      {canViewSalary && employee.salary && (
        <p>Salary: {employee.salary} TRY</p>
      )}

      {/* ✅ Show placeholder to others */}
      {!canViewSalary && (
        <p className="text-muted-foreground">
          Salary information not available
        </p>
      )}
    </div>
  );
}
```

---

## 🧪 TEST PATTERNS

### Pattern 1: RBAC Test Matrix

```python
# File: scripts/tests/rbac-employee-test.py

from test_helper import IKAITestHelper

helper = IKAITestHelper()

# Test matrix: Role × Endpoint
RBAC_TESTS = [
    # (role, email, endpoint, expected_status)
    ('ADMIN', 'admin@org1.com', '/api/v1/employees', 200),
    ('HR_SPECIALIST', 'hr@org1.com', '/api/v1/employees', 200),
    ('MANAGER', 'manager@org1.com', '/api/v1/employees', 200),  # Dept only
    ('USER', 'user@org1.com', '/api/v1/employees', 403),  # ❌ Forbidden

    ('ADMIN', 'admin@org1.com', 'POST /api/v1/employees', 201),
    ('HR_SPECIALIST', 'hr@org1.com', 'POST /api/v1/employees', 201),
    ('MANAGER', 'manager@org1.com', 'POST /api/v1/employees', 403),  # ❌
    ('USER', 'user@org1.com', 'POST /api/v1/employees', 403),  # ❌
]

for role, email, endpoint, expected in RBAC_TESTS:
    helper.login(email, 'TestPass123!')

    if 'POST' in endpoint:
        response = helper.post(endpoint.replace('POST ', ''), {...})
    else:
        response = helper.get(endpoint)

    assert response.status_code == expected, \
        f"{role} → {endpoint}: Expected {expected}, got {response.status_code}"

print("✅ All RBAC tests passed!")
```

### Pattern 2: Organization Isolation Test

```python
# File: scripts/tests/org-isolation-test.py

from test_helper import IKAITestHelper

helper = IKAITestHelper()

# Org 1 user
helper.login('admin@org1.com', 'TestPass123!')
org1_employees = helper.get('/api/v1/employees').json()['data']

# Org 2 user
helper.login('admin@org2.com', 'TestPass123!')
org2_employees = helper.get('/api/v1/employees').json()['data']

# ✅ Check: No overlap
org1_ids = [e['id'] for e in org1_employees]
org2_ids = [e['id'] for e in org2_employees]

assert len(set(org1_ids) & set(org2_ids)) == 0, \
    "❌ SECURITY BUG: Cross-org data leakage detected!"

print("✅ Organization isolation verified!")
```

### Pattern 3: Department Isolation Test (MANAGER)

```python
# File: scripts/tests/dept-isolation-test.py

from test_helper import IKAITestHelper

helper = IKAITestHelper()

# MANAGER (Engineering dept)
helper.login('manager@org1.com', 'TestPass123!')
manager_employees = helper.get('/api/v1/employees').json()['data']

# ✅ Check: All employees are from Engineering dept
for emp in manager_employees:
    assert emp['department']['name'] == 'Engineering', \
        f"❌ MANAGER sees {emp['department']['name']} employee!"

print(f"✅ MANAGER dept isolation verified! {len(manager_employees)} Engineering employees")
```

### Pattern 4: Sensitive Data Test (Salary)

```python
# File: scripts/tests/sensitive-data-test.py

from test_helper import IKAITestHelper

helper = IKAITestHelper()

employee_id = "some-employee-id"

# ✅ ADMIN can see salary
helper.login('admin@org1.com', 'TestPass123!')
admin_view = helper.get(f'/api/v1/employees/{employee_id}').json()['data']
assert 'salary' in admin_view and admin_view['salary'] is not None, \
    "❌ ADMIN should see salary!"

# ✅ MANAGER cannot see salary
helper.login('manager@org1.com', 'TestPass123!')
manager_view = helper.get(f'/api/v1/employees/{employee_id}').json()['data']
assert 'salary' not in manager_view or manager_view['salary'] is None, \
    "❌ MANAGER should NOT see salary!"

print("✅ Sensitive data protection verified!")
```

---

## 🚨 COMMON PITFALLS

### Pitfall 1: Forgetting Organization Filter

```javascript
// ❌ WRONG: No org filter
const employees = await prisma.employee.findMany();
// → User sees ALL employees from ALL organizations! 🚨

// ✅ RIGHT: Always filter by org
const employees = await prisma.employee.findMany({
  where: { organizationId: req.user.organizationId }
});
```

### Pitfall 2: Client-Side Only Protection

```typescript
// ❌ WRONG: Frontend-only protection
function EmployeesPage() {
  const canView = useHasRole(['ADMIN']);

  if (!canView) return <div>Access Denied</div>;

  // User can bypass by editing React state! 🚨
}

// ✅ RIGHT: Backend enforcement
router.get('/employees',
  authorize(['ADMIN', 'HR_SPECIALIST']),  // ✅ Backend check
  async (req, res) => { ... }
);
```

### Pitfall 3: Hardcoded Organization ID

```javascript
// ❌ WRONG: Hardcoded org ID from request body
const data = await prisma.resource.create({
  data: {
    ...req.body,  // Contains organizationId from client
    // → User can create data in ANY org! 🚨
  }
});

// ✅ RIGHT: Force server-side org ID
const data = await prisma.resource.create({
  data: {
    ...req.body,
    organizationId: req.user.organizationId  // ✅ From token
  }
});
```

### Pitfall 4: Incomplete MANAGER Filter

```javascript
// ❌ WRONG: MANAGER filter only in list
router.get('/', async (req, res) => {
  const where = req.user.role === 'MANAGER'
    ? { departmentId: req.user.departmentId }
    : {};
  // List is filtered ✅
});

router.get('/:id', async (req, res) => {
  const data = await prisma.resource.findUnique({
    where: { id: req.params.id }
  });
  // Detail is NOT filtered! MANAGER can view any dept! 🚨
});

// ✅ RIGHT: Filter in BOTH list and detail
router.get('/:id', async (req, res) => {
  const data = await prisma.resource.findFirst({
    where: {
      id: req.params.id,
      ...(req.user.role === 'MANAGER' && {
        departmentId: req.user.departmentId  // ✅ Dept check
      })
    }
  });
});
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend Checklist

- [ ] All routes use `authenticate` middleware
- [ ] All routes use `organizationIsolation` middleware (except SUPER_ADMIN)
- [ ] All routes use `authorize([...roles])` with correct roles
- [ ] All Prisma queries filter by `organizationId`
- [ ] MANAGER queries filter by `departmentId`
- [ ] USER queries check `userId === req.user.id`
- [ ] Sensitive fields (salary) filtered based on role
- [ ] Create operations force `organizationId` from `req.user`
- [ ] Update operations verify ownership (same org)
- [ ] Delete operations verify ownership (same org)

### Frontend Checklist

- [ ] All protected routes use `withRoleProtection`
- [ ] All conditional UI uses `useHasRole` hook
- [ ] No hardcoded role checks (use hook!)
- [ ] MANAGER sees department filter disabled
- [ ] Sensitive data hidden from non-authorized roles
- [ ] API calls include auth token (automatic via apiClient)
- [ ] Error messages user-friendly (not "403 Forbidden")

### Test Checklist

- [ ] RBAC matrix tested (all roles × all endpoints)
- [ ] Organization isolation tested (cross-org access blocked)
- [ ] Department isolation tested (MANAGER sees own dept only)
- [ ] Self-access tested (USER sees own data only)
- [ ] Sensitive data tested (salary visibility by role)
- [ ] SUPER_ADMIN tested (cross-org access allowed)
- [ ] Negative tests (403/404 for unauthorized access)

---

## 📚 QUICK REFERENCE

### Role Permission Cheat Sheet

```
SUPER_ADMIN: ✅ Everything, all orgs
ADMIN:       ✅ Everything in own org
HR:          ✅ Hiring, employees, org-wide in own org
MANAGER:     ✅ Own dept only, approvals, reviews
USER:        ✅ Self only, basic features
```

### Middleware Order

```javascript
router.use(authenticate);           // 1️⃣ Who are you?
router.use(organizationIsolation);  // 2️⃣ Filter by org
router.get('/', authorize([...]),   // 3️⃣ Check role
  handler                           // 4️⃣ Execute
);
```

### Prisma Query Template

```javascript
const where = {
  organizationId: req.user.organizationId,  // ✅ Always
  ...(req.user.role === 'MANAGER' && {
    departmentId: req.user.departmentId     // ✅ MANAGER
  })
};

const data = await prisma.model.findMany({ where });
```

---

## 🎯 USAGE EXAMPLES

### Example 1: New Feature - Leave Management

**Task:** Add leave request system

**RBAC Requirements:**
- Anyone can REQUEST leave
- MANAGER + HR can APPROVE leaves (own dept for MANAGER)
- Anyone can VIEW own leaves
- MANAGER + HR can VIEW team leaves

**Implementation:**

```javascript
// Backend: leaveRoutes.js

// CREATE: Anyone can request
router.post('/',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER', 'USER']),  // ✅ All
  async (req, res) => {
    const leave = await prisma.leave.create({
      data: {
        ...req.body,
        employeeId: req.user.employee.id,  // ✅ Force own employee
        organizationId: req.user.organizationId,
        status: 'PENDING'
      }
    });
    res.status(201).json({ success: true, data: leave });
  }
);

// LIST: Show based on role
router.get('/',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER', 'USER']),
  async (req, res) => {
    const where = { organizationId: req.user.organizationId };

    if (req.user.role === 'USER') {
      where.employeeId = req.user.employee.id;  // ✅ USER: own only
    } else if (req.user.role === 'MANAGER') {
      where.employee = {
        departmentId: req.user.departmentId  // ✅ MANAGER: dept only
      };
    }
    // ✅ ADMIN/HR: see all in org

    const leaves = await prisma.leave.findMany({
      where,
      include: { employee: true }
    });

    res.json({ success: true, data: leaves });
  }
);

// APPROVE: MANAGER + HR only
router.put('/:id/approve',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),
  async (req, res) => {
    const leave = await prisma.leave.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      },
      include: { employee: true }
    });

    if (!leave) return res.status(404).json({ error: 'Not found' });

    // ✅ MANAGER: Can only approve own dept
    if (req.user.role === 'MANAGER' &&
        leave.employee.departmentId !== req.user.departmentId) {
      return res.status(403).json({
        error: 'You can only approve leaves in your department'
      });
    }

    const updated = await prisma.leave.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approvedBy: req.user.id,
        approvedAt: new Date()
      }
    });

    res.json({ success: true, data: updated });
  }
);
```

---

## 🚀 NEXT STEPS

**When implementing a new feature:**

1. **Design Phase:**
   - Define RBAC matrix for this feature
   - Identify sensitive data
   - Plan department/self isolation

2. **Backend Phase:**
   - Copy pattern from this document
   - Add `authenticate` + `organizationIsolation`
   - Use `authorize([...])` with correct roles
   - Filter Prisma queries (org, dept, self)
   - Filter sensitive data in responses

3. **Frontend Phase:**
   - Use `withRoleProtection` on routes
   - Use `useHasRole` for conditional UI
   - Handle 403/404 gracefully

4. **Test Phase:**
   - Write RBAC test (all roles)
   - Write org isolation test
   - Write dept isolation test (if MANAGER involved)
   - Write sensitive data test (if applicable)

5. **Verify:**
   - Run checklist above
   - Test manually with different roles
   - Check console for errors

---

**🎯 This is your RBAC blueprint. Copy, paste, customize!**
