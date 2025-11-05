# 🏢 EMPLOYEE MANAGEMENT MODULE - COMPLETE SPECIFICATION

**Version:** 1.0
**Date:** 2025-11-05
**Assigned To:** W1 (Implementation Worker)
**Estimated Time:** 2-3 days
**Priority:** HIGH (Post Master Test)

---

## 🎯 PROJECT OVERVIEW

**Objective:** Add complete Employee Management module to IKAI platform

**Core Concept:** Candidate → Employee seamless transition + Full CRUD employee management

**Key Features:**
1. "Convert to Employee" button on accepted offers
2. Employee database (new table)
3. Employee list page (CRUD + filters)
4. Employee detail page
5. Leave management system
6. Performance tracking
7. Document management
8. Sidebar navigation update

---

## 📊 DATABASE SCHEMA

### New Tables

#### 1. Employee Table

```prisma
model Employee {
  id                String              @id @default(cuid())
  employeeNumber    String              @unique // Auto-generated: EMP-001, EMP-002

  // Link to User & Candidate
  userId            String              @unique // Create user account
  candidateId       String?             @unique // Source candidate (if hired through system)

  // Personal Info (copied from Candidate)
  firstName         String
  lastName          String
  email             String              @unique
  phone             String?
  dateOfBirth       DateTime?
  address           String?

  // Employment Details
  organizationId    String
  departmentId      String
  positionId        String
  managerId         String?

  startDate         DateTime            // Employment start date
  endDate           DateTime?           // null = active, has value = terminated
  employmentType    EmploymentType      // FULL_TIME, PART_TIME, CONTRACT, INTERN
  status            EmploymentStatus    // ACTIVE, ON_LEAVE, TERMINATED, SUSPENDED

  // Compensation (optional - sensitive data)
  salary            Decimal?
  currency          String              @default("TRY")

  // Metadata
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  createdBy         String              // User who created (HR/ADMIN)

  // Relations
  organization      Organization        @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  department        Department          @relation(fields: [departmentId], references: [id])
  position          Position            @relation(fields: [positionId], references: [id])
  manager           Employee?           @relation("ManagerSubordinates", fields: [managerId], references: [id])
  subordinates      Employee[]          @relation("ManagerSubordinates")
  user              User                @relation(fields: [userId], references: [id])
  candidate         Candidate?          @relation(fields: [candidateId], references: [id])

  leaves            Leave[]
  reviews           PerformanceReview[]
  documents         EmployeeDocument[]

  @@index([organizationId])
  @@index([departmentId])
  @@index([status])
  @@index([employeeNumber])
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERN
}

enum EmploymentStatus {
  ACTIVE
  ON_LEAVE
  TERMINATED
  SUSPENDED
}
```

#### 2. Leave Table

```prisma
model Leave {
  id              String        @id @default(cuid())
  employeeId      String
  organizationId  String

  type            LeaveType
  startDate       DateTime
  endDate         DateTime
  totalDays       Int           // Working days count
  reason          String?

  status          LeaveStatus   @default(PENDING)
  approvedBy      String?       // Manager/HR who approved
  approvedAt      DateTime?
  rejectionReason String?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  employee        Employee      @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization    Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  approver        User?         @relation(fields: [approvedBy], references: [id])

  @@index([employeeId])
  @@index([organizationId])
  @@index([status])
  @@index([startDate])
}

enum LeaveType {
  ANNUAL          // Yıllık izin
  SICK            // Hastalık
  UNPAID          // Ücretsiz izin
  MATERNITY       // Doğum izni
  PATERNITY       // Babalık izni
  BEREAVEMENT     // Ölüm izni
  MARRIAGE        // Evlilik izni
  OTHER           // Diğer
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}
```

#### 3. Performance Review Table

```prisma
model PerformanceReview {
  id              String    @id @default(cuid())
  employeeId      String
  reviewerId      String    // Manager/HR
  organizationId  String

  reviewPeriod    String    // "Q1-2025", "2024", etc
  reviewDate      DateTime

  // Ratings (1-5 scale)
  technicalSkills Int?      // 1-5
  communication   Int?      // 1-5
  teamwork        Int?      // 1-5
  productivity    Int?      // 1-5
  overallRating   Int       // 1-5

  strengths       String?   // Text area
  areasForGrowth  String?   // Text area
  goals           String?   // Next period goals
  notes           String?   // Additional notes

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  employee        Employee      @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  reviewer        User          @relation(fields: [reviewerId], references: [id])
  organization    Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([employeeId])
  @@index([organizationId])
  @@index([reviewPeriod])
}
```

#### 4. Employee Document Table

```prisma
model EmployeeDocument {
  id              String          @id @default(cuid())
  employeeId      String
  organizationId  String

  type            DocumentType
  title           String
  fileName        String
  fileUrl         String          // MinIO URL
  fileSize        Int             // Bytes
  mimeType        String

  uploadedBy      String
  uploadedAt      DateTime        @default(now())
  expiryDate      DateTime?       // For contracts, licenses

  notes           String?

  employee        Employee        @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization    Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  uploader        User            @relation(fields: [uploadedBy], references: [id])

  @@index([employeeId])
  @@index([organizationId])
  @@index([type])
}

enum DocumentType {
  CONTRACT        // İş sözleşmesi
  ID_CARD         // Kimlik
  DIPLOMA         // Diploma
  CERTIFICATE     // Sertifika
  TAX_DOCUMENT    // Vergi belgesi
  HEALTH_REPORT   // Sağlık raporu
  OTHER           // Diğer
}
```

#### 5. Position Table (New - Referenced by Employee)

```prisma
model Position {
  id              String        @id @default(cuid())
  organizationId  String

  title           String        // "Backend Developer", "HR Manager"
  level           String?       // "Junior", "Senior", "Lead"
  description     String?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  organization    Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  employees       Employee[]

  @@unique([organizationId, title])
  @@index([organizationId])
}
```

### Updated Tables

#### User Table Update

```prisma
// Add to existing User model
model User {
  // ... existing fields ...

  // New relation
  employee        Employee?      // One-to-one: User can be an employee

  // ... existing relations ...
}
```

#### Candidate Table Update

```prisma
// Add to existing Candidate model
model Candidate {
  // ... existing fields ...

  // New relation
  employee        Employee?      // One-to-one: Candidate can become employee

  // ... existing relations ...
}
```

---

## 🛠️ BACKEND IMPLEMENTATION

### API Endpoints

#### Employee Routes (`/api/v1/employees`)

```javascript
// File: backend/src/routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');
const { organizationIsolation } = require('../middleware/organizationIsolation');

// All routes require authentication + organization isolation
router.use(authenticate);
router.use(organizationIsolation);

// List & Create
router.get('/',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),
  employeeController.listEmployees
);

router.post('/',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  employeeController.createEmployee
);

// Convert candidate to employee
router.post('/from-candidate/:candidateId',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  employeeController.createFromCandidate
);

// Detail, Update, Delete
router.get('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),
  employeeController.getEmployee
);

router.put('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  employeeController.updateEmployee
);

router.delete('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  employeeController.terminateEmployee  // Soft delete
);

// Statistics
router.get('/stats/overview',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  employeeController.getEmployeeStats
);

module.exports = router;
```

#### Leave Routes (`/api/v1/leaves`)

```javascript
// File: backend/src/routes/leaveRoutes.js

router.get('/',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER', 'USER']),
  leaveController.listLeaves
);

router.post('/',
  authorize(['USER']),  // Any user can request leave
  leaveController.createLeaveRequest
);

router.put('/:id/approve',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),
  leaveController.approveLeave
);

router.put('/:id/reject',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),
  leaveController.rejectLeave
);

router.delete('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST', 'USER']),  // User can cancel own request
  leaveController.cancelLeave
);
```

#### Performance Review Routes (`/api/v1/performance-reviews`)

```javascript
// File: backend/src/routes/performanceReviewRoutes.js

router.get('/',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),
  reviewController.listReviews
);

router.post('/',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),
  reviewController.createReview
);

router.get('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER', 'USER']),  // Users can view their own
  reviewController.getReview
);

router.put('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER']),
  reviewController.updateReview
);
```

#### Employee Document Routes (`/api/v1/employee-documents`)

```javascript
// File: backend/src/routes/employeeDocumentRoutes.js

router.get('/employee/:employeeId',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER', 'USER']),
  documentController.listDocuments
);

router.post('/upload',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  upload.single('file'),  // multer middleware
  documentController.uploadDocument
);

router.delete('/:id',
  authorize(['ADMIN', 'HR_SPECIALIST']),
  documentController.deleteDocument
);

router.get('/:id/download',
  authorize(['ADMIN', 'HR_SPECIALIST', 'MANAGER', 'USER']),
  documentController.downloadDocument
);
```

### Controller Logic Examples

#### Employee Controller (`backend/src/controllers/employeeController.js`)

```javascript
// CREATE FROM CANDIDATE - Critical function!
exports.createFromCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const {
      startDate,
      departmentId,
      positionId,
      managerId,
      salary,
      employmentType
    } = req.body;

    // 1. Find candidate with offer
    const candidate = await prisma.candidate.findUnique({
      where: {
        id: candidateId,
        organizationId: req.user.organizationId  // Org isolation
      },
      include: {
        offer: true
      }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // 2. Check if offer is accepted
    if (!candidate.offer || candidate.offer.status !== 'ACCEPTED') {
      return res.status(400).json({
        error: 'Candidate has no accepted offer'
      });
    }

    // 3. Check if already converted
    const existing = await prisma.employee.findUnique({
      where: { candidateId }
    });

    if (existing) {
      return res.status(400).json({
        error: 'Candidate already converted to employee'
      });
    }

    // 4. Generate employee number
    const lastEmployee = await prisma.employee.findFirst({
      where: { organizationId: req.user.organizationId },
      orderBy: { employeeNumber: 'desc' }
    });

    let employeeNumber = 'EMP-001';
    if (lastEmployee) {
      const lastNum = parseInt(lastEmployee.employeeNumber.split('-')[1]);
      employeeNumber = `EMP-${String(lastNum + 1).padStart(3, '0')}`;
    }

    // 5. Create user account
    const user = await prisma.user.create({
      data: {
        email: candidate.email,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        role: 'USER',  // Default role
        organizationId: req.user.organizationId,
        emailVerified: true,  // Auto-verify for converted employees
        // Password will be set via invitation email
      }
    });

    // 6. Create employee
    const employee = await prisma.employee.create({
      data: {
        employeeNumber,
        userId: user.id,
        candidateId: candidate.id,

        // Copy from candidate
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,

        // New employment data
        organizationId: req.user.organizationId,
        departmentId,
        positionId,
        managerId,
        startDate: new Date(startDate),
        employmentType,
        status: 'ACTIVE',
        salary,
        currency: 'TRY',

        createdBy: req.user.id
      },
      include: {
        department: true,
        position: true,
        manager: true,
        user: true
      }
    });

    // 7. Create notification for employee
    await prisma.notification.create({
      data: {
        userId: user.id,
        organizationId: req.user.organizationId,
        type: 'EMPLOYEE_ONBOARDING',
        title: 'Hoş Geldiniz!',
        message: `${req.user.organization.name} ailesine hoş geldiniz. İşe başlama tarihiniz: ${formatDate(startDate)}`,
        actionUrl: '/employee/profile'
      }
    });

    // 8. Send welcome email (queue)
    await emailQueue.add('employee-welcome', {
      employeeId: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      startDate,
      organizationName: req.user.organization.name
    });

    res.status(201).json({
      success: true,
      data: employee,
      message: 'Aday başarıyla çalışan olarak sisteme eklendi'
    });

  } catch (error) {
    console.error('Error creating employee from candidate:', error);
    res.status(500).json({
      error: 'Çalışan oluşturulurken hata oluştu'
    });
  }
};

// LIST EMPLOYEES with filters
exports.listEmployees = async (req, res) => {
  try {
    const {
      departmentId,
      status = 'ACTIVE',
      search,
      page = 1,
      limit = 20
    } = req.query;

    const where = {
      organizationId: req.user.organizationId,
      status
    };

    // Department filter (MANAGER sees only their dept)
    if (req.user.role === 'MANAGER') {
      where.departmentId = req.user.departmentId;
    } else if (departmentId) {
      where.departmentId = departmentId;
    }

    // Search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          department: true,
          position: true,
          manager: {
            select: {
              firstName: true,
              lastName: true,
              employeeNumber: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      success: true,
      data: employees,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error listing employees:', error);
    res.status(500).json({ error: 'Çalışanlar listelenirken hata oluştu' });
  }
};

// GET EMPLOYEE STATS
exports.getEmployeeStats = async (req, res) => {
  try {
    const orgId = req.user.organizationId;

    const [
      totalActive,
      totalTerminated,
      byDepartment,
      byEmploymentType,
      newHiresThisMonth
    ] = await Promise.all([
      prisma.employee.count({
        where: { organizationId: orgId, status: 'ACTIVE' }
      }),
      prisma.employee.count({
        where: { organizationId: orgId, status: 'TERMINATED' }
      }),
      prisma.employee.groupBy({
        by: ['departmentId'],
        where: { organizationId: orgId, status: 'ACTIVE' },
        _count: true
      }),
      prisma.employee.groupBy({
        by: ['employmentType'],
        where: { organizationId: orgId, status: 'ACTIVE' },
        _count: true
      }),
      prisma.employee.count({
        where: {
          organizationId: orgId,
          startDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalActive,
        totalTerminated,
        byDepartment,
        byEmploymentType,
        newHiresThisMonth,
        turnoverRate: (totalTerminated / (totalActive + totalTerminated) * 100).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error getting employee stats:', error);
    res.status(500).json({ error: 'İstatistikler alınırken hata oluştu' });
  }
};
```

---

## 🎨 FRONTEND IMPLEMENTATION

### Sidebar Navigation Update

**File:** `frontend/components/AppLayout.tsx`

```typescript
// Add to navigationItems

const navigationItems = [
  // ... existing items ...

  // NEW SECTION: Employee Management
  {
    section: 'Çalışan Yönetimi',
    items: [
      {
        label: 'Çalışanlar',
        icon: Users,
        href: '/employees',
        roles: ['ADMIN', 'HR_SPECIALIST', 'MANAGER']
      },
      {
        label: 'İzinler',
        icon: Calendar,
        href: '/leaves',
        roles: ['ADMIN', 'HR_SPECIALIST', 'MANAGER', 'USER']
      },
      {
        label: 'Performans',
        icon: TrendingUp,
        href: '/performance',
        roles: ['ADMIN', 'HR_SPECIALIST', 'MANAGER']
      }
    ]
  }
];
```

### Page 1: Employee List

**File:** `frontend/app/(authenticated)/employees/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { useEmployees } from '@/lib/hooks/useEmployees';
import { useDepartments } from '@/lib/hooks/useDepartments';

export default function EmployeesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [deptFilter, setDeptFilter] = useState('');

  const { employees, loading, pagination } = useEmployees({
    search,
    status: statusFilter,
    departmentId: deptFilter
  });

  const { departments } = useDepartments();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Çalışanlar</h1>
          <p className="text-muted-foreground">
            Organizasyonunuzdaki çalışanları yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportToExcel()}>
            <Download className="w-4 h-4 mr-2" />
            Excel İndir
          </Button>
          <Button onClick={() => router.push('/employees/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Çalışan
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Ad, email veya sicil no ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="ON_LEAVE">İzinde</SelectItem>
            <SelectItem value="TERMINATED">Ayrılmış</SelectItem>
          </SelectContent>
        </Select>

        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tüm Departmanlar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tümü</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sicil No</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Pozisyon</TableHead>
              <TableHead>Departman</TableHead>
              <TableHead>Başlangıç</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map(employee => (
              <TableRow
                key={employee.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/employees/${employee.id}`)}
              >
                <TableCell className="font-mono">
                  {employee.employeeNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {employee.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.position.title}</TableCell>
                <TableCell>{employee.department.name}</TableCell>
                <TableCell>
                  {new Date(employee.startDate).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    employee.status === 'ACTIVE' ? 'default' :
                    employee.status === 'ON_LEAVE' ? 'secondary' :
                    'destructive'
                  }>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/employees/${employee.id}/edit`);
                    }}
                  >
                    Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Toplam {pagination.total} çalışan
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => {/* prev page */}}
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => {/* next page */}}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Page 2: Convert Candidate to Employee

**File:** `frontend/app/(authenticated)/candidates/[id]/convert-to-employee/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidate } from '@/lib/hooks/useCandidate';
import { useDepartments } from '@/lib/hooks/useDepartments';
import { usePositions } from '@/lib/hooks/usePositions';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export default function ConvertToEmployeePage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const { candidate, loading } = useCandidate(params.id);
  const { departments } = useDepartments();
  const { positions } = usePositions();

  const [formData, setFormData] = useState({
    startDate: '',
    departmentId: '',
    positionId: '',
    managerId: '',
    salary: '',
    employmentType: 'FULL_TIME'
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await apiClient.post(
        `/api/v1/employees/from-candidate/${params.id}`,
        formData
      );

      toast.success('Aday başarıyla çalışan olarak eklendi!');
      router.push(`/employees/${response.data.id}`);

    } catch (error) {
      toast.error('Çalışan oluşturulurken hata oluştu');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Adayı Çalışan Olarak Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Candidate Info Summary */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Aday Bilgileri</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Ad Soyad:</span>{' '}
                {candidate.firstName} {candidate.lastName}
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{' '}
                {candidate.email}
              </div>
              <div>
                <span className="text-muted-foreground">Telefon:</span>{' '}
                {candidate.phone}
              </div>
              <div>
                <span className="text-muted-foreground">Teklif:</span>{' '}
                {candidate.offer?.status === 'ACCEPTED' ? (
                  <Badge variant="default">Kabul Edildi</Badge>
                ) : (
                  <Badge variant="destructive">Kabul Edilmedi</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="startDate">İşe Başlama Tarihi *</Label>
              <Input
                id="startDate"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({
                  ...formData,
                  startDate: e.target.value
                })}
              />
            </div>

            <div>
              <Label htmlFor="departmentId">Departman *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({
                  ...formData,
                  departmentId: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Departman seçin" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="positionId">Pozisyon *</Label>
              <Select
                value={formData.positionId}
                onValueChange={(value) => setFormData({
                  ...formData,
                  positionId: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pozisyon seçin" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map(pos => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employmentType">İstihdam Tipi *</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => setFormData({
                  ...formData,
                  employmentType: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Tam Zamanlı</SelectItem>
                  <SelectItem value="PART_TIME">Yarı Zamanlı</SelectItem>
                  <SelectItem value="CONTRACT">Sözleşmeli</SelectItem>
                  <SelectItem value="INTERN">Stajyer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary">Maaş (TRY) - Opsiyonel</Label>
              <Input
                id="salary"
                type="number"
                placeholder="Örn: 25000"
                value={formData.salary}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: e.target.value
                })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maaş bilgisi hassas veridir ve opsiyoneldir
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                İptal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Ekleniyor...' : 'Çalışan Olarak Ekle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Component: Convert Button on Candidate Detail

**File:** `frontend/app/(authenticated)/candidates/[id]/page.tsx` (Update)

```typescript
// Add button to candidate detail page

{candidate.offer?.status === 'ACCEPTED' && !candidate.employee && (
  <Button
    onClick={() => router.push(`/candidates/${candidate.id}/convert-to-employee`)}
    className="bg-green-600 hover:bg-green-700"
  >
    <UserPlus className="w-4 h-4 mr-2" />
    Çalışan Olarak Ekle
  </Button>
)}

{candidate.employee && (
  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
    <p className="text-sm text-green-800">
      Bu aday çalışan olarak sisteme eklenmiştir.{' '}
      <Link
        href={`/employees/${candidate.employee.id}`}
        className="underline font-medium"
      >
        Çalışan profiline git →
      </Link>
    </p>
  </div>
)}
```

---

## 🧪 TEST TEMPLATE (PLAYWRIGHT)

**File:** `scripts/templates/e2e-employee-management-template.py`

```python
from playwright.sync_api import sync_playwright
import json
from datetime import datetime

def test_employee_management():
    """
    E2E Test: Employee Management Module

    Test Flow:
    1. Login as HR_SPECIALIST
    2. Navigate to Candidates with accepted offer
    3. Convert candidate to employee
    4. Verify employee created
    5. Navigate to Employees list
    6. Filter by department
    7. View employee detail
    8. Create leave request (as employee)
    9. Approve leave (as manager)
    10. Create performance review
    """

    test_results = {
        'testName': 'Employee Management E2E',
        'timestamp': datetime.now().isoformat(),
        'tests': [],
        'screenshots': [],
        'consoleErrors': []
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Track console errors
        page.on('console', lambda msg:
            test_results['consoleErrors'].append(msg.text)
            if msg.type == 'error' else None
        )

        BASE_URL = 'http://localhost:8103'

        # TEST 1: Login as HR
        page.goto(f'{BASE_URL}/login')
        page.fill('input[type="email"]', 'buse@ajansik.com')
        page.fill('input[type="password"]', 'AjansIK2025!')
        page.click('button[type="submit"]')
        page.wait_for_url(f'{BASE_URL}/dashboard')
        page.screenshot(path='screenshots/employee-01-hr-login.png')
        test_results['screenshots'].append('employee-01-hr-login.png')
        test_results['tests'].append({
            'name': 'HR Login',
            'status': 'PASS'
        })

        # TEST 2: Navigate to candidate with accepted offer
        page.goto(f'{BASE_URL}/candidates')
        page.wait_for_selector('table')

        # Find candidate with ACCEPTED offer
        candidate_row = page.query_selector('tr:has-text("ACCEPTED")')
        if candidate_row:
            candidate_row.click()
            page.wait_for_load_state('networkidle')
            page.screenshot(path='screenshots/employee-02-candidate-detail.png')
            test_results['screenshots'].append('employee-02-candidate-detail.png')

            # TEST 3: Click "Convert to Employee"
            convert_button = page.query_selector('button:has-text("Çalışan Olarak Ekle")')
            if convert_button:
                convert_button.click()
                page.wait_for_url('**/convert-to-employee')
                page.screenshot(path='screenshots/employee-03-convert-form.png')
                test_results['screenshots'].append('employee-03-convert-form.png')

                # Fill form
                page.fill('input[type="date"]', '2025-02-01')
                page.select_option('select#departmentId', index=1)
                page.select_option('select#positionId', index=1)
                page.fill('input#salary', '30000')

                page.screenshot(path='screenshots/employee-04-form-filled.png')
                test_results['screenshots'].append('employee-04-form-filled.png')

                # Submit
                page.click('button[type="submit"]')
                page.wait_for_url('**/employees/**')
                page.screenshot(path='screenshots/employee-05-created.png')
                test_results['screenshots'].append('employee-05-created.png')

                test_results['tests'].append({
                    'name': 'Convert Candidate to Employee',
                    'status': 'PASS'
                })
            else:
                test_results['tests'].append({
                    'name': 'Convert Button',
                    'status': 'FAIL',
                    'error': 'Convert button not found'
                })

        # TEST 4: Navigate to Employees list
        page.goto(f'{BASE_URL}/employees')
        page.wait_for_selector('table')
        page.screenshot(path='screenshots/employee-06-list.png')
        test_results['screenshots'].append('employee-06-list.png')

        employee_count = page.query_selector_all('table tbody tr')
        test_results['tests'].append({
            'name': 'Employees List',
            'status': 'PASS',
            'data': {'employeeCount': len(employee_count)}
        })

        # TEST 5: Filter by department
        page.select_option('select', index=1)  # Select first dept
        page.wait_for_timeout(1000)
        page.screenshot(path='screenshots/employee-07-filtered.png')
        test_results['screenshots'].append('employee-07-filtered.png')

        filtered_count = page.query_selector_all('table tbody tr')
        test_results['tests'].append({
            'name': 'Department Filter',
            'status': 'PASS',
            'data': {'filteredCount': len(filtered_count)}
        })

        # TEST 6: View employee detail
        first_employee = page.query_selector('table tbody tr')
        if first_employee:
            first_employee.click()
            page.wait_for_load_state('networkidle')
            page.screenshot(path='screenshots/employee-08-detail.png')
            test_results['screenshots'].append('employee-08-detail.png')

            test_results['tests'].append({
                'name': 'Employee Detail',
                'status': 'PASS'
            })

        # TEST 7: Console errors check
        console_errors = [e for e in test_results['consoleErrors']
                         if 'error' in e.lower()]

        test_results['tests'].append({
            'name': 'Console Errors',
            'status': 'PASS' if len(console_errors) == 0 else 'FAIL',
            'data': {'errorCount': len(console_errors)}
        })

        browser.close()

    # Save results
    with open('test-outputs/employee-management-results.json', 'w') as f:
        json.dump(test_results, f, indent=2)

    # Print summary
    passed = sum(1 for t in test_results['tests'] if t['status'] == 'PASS')
    total = len(test_results['tests'])

    print(f"""
    ✅ EMPLOYEE MANAGEMENT E2E TEST COMPLETE

    Tests: {passed}/{total} PASSED
    Screenshots: {len(test_results['screenshots'])}
    Console Errors: {len(console_errors)}

    Results: test-outputs/employee-management-results.json
    """)

    return test_results

if __name__ == '__main__':
    test_employee_management()
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup (1 day)

- [ ] Create Prisma schema for Employee, Leave, PerformanceReview, EmployeeDocument, Position
- [ ] Add enums (EmploymentType, EmploymentStatus, LeaveType, LeaveStatus, DocumentType)
- [ ] Update User and Candidate models (add relations)
- [ ] Run migration: `npx prisma migrate dev --name add-employee-management`
- [ ] Seed positions: Common job titles (Backend Developer, HR Manager, etc)
- [ ] Test migration on dev database

### Phase 2: Backend API (1 day)

- [ ] Create employeeController.js (7 functions)
- [ ] Create leaveController.js (5 functions)
- [ ] Create performanceReviewController.js (4 functions)
- [ ] Create employeeDocumentController.js (4 functions)
- [ ] Create routes: employeeRoutes, leaveRoutes, performanceReviewRoutes, employeeDocumentRoutes
- [ ] Add to server.js: Register all routes
- [ ] Test all endpoints with test-helper.py
- [ ] Verify RBAC: ADMIN, HR_SPECIALIST, MANAGER, USER permissions

### Phase 3: Frontend Pages (1 day)

- [ ] Update sidebar navigation (AppLayout.tsx)
- [ ] Create /employees page (list with filters)
- [ ] Create /employees/[id] page (detail view)
- [ ] Create /employees/[id]/edit page
- [ ] Create /candidates/[id]/convert-to-employee page
- [ ] Add "Convert to Employee" button on candidate detail
- [ ] Create /leaves page (list + request form)
- [ ] Create /performance page (list + create form)
- [ ] Create useEmployees, useLeaves, usePerformanceReviews hooks

### Phase 4: Testing (0.5 days)

- [ ] Run e2e-employee-management-template.py
- [ ] Verify candidate → employee conversion
- [ ] Verify employee list, filters, search
- [ ] Verify leave request → approval flow
- [ ] Verify performance review creation
- [ ] Check console errors = 0
- [ ] Check RBAC (all 5 roles)
- [ ] Test org isolation (multi-tenant)

### Phase 5: Documentation (0.5 days)

- [ ] Update API docs (add 20+ new endpoints)
- [ ] Create employee management user guide
- [ ] Update CLAUDE.md (add employee management features)
- [ ] Create W1 completion report
- [ ] Commit all changes

---

## 🎯 SUCCESS CRITERIA

**Phase 1 Success:**
- ✅ Database migration successful
- ✅ All tables created
- ✅ Seed data populated (positions)

**Phase 2 Success:**
- ✅ 20+ API endpoints working
- ✅ RBAC verified (all 5 roles)
- ✅ Org isolation verified
- ✅ Postman collection updated

**Phase 3 Success:**
- ✅ All pages render without errors
- ✅ Sidebar navigation updated
- ✅ Convert button works
- ✅ Employee list shows data
- ✅ Filters work correctly

**Phase 4 Success:**
- ✅ E2E test: 7/7 tests PASS
- ✅ Console errors: 0
- ✅ Screenshots: 8+ captured
- ✅ All workflows tested

**Overall Success:**
- ✅ Candidate → Employee conversion working
- ✅ Employee CRUD complete
- ✅ Leave system functional
- ✅ Performance reviews working
- ✅ Production-ready UI/UX
- ✅ Zero console errors
- ✅ Full documentation

---

## 📊 EXPECTED DATABASE STATE (After Implementation)

```sql
-- Tables
SELECT COUNT(*) FROM employees;          -- Should have data
SELECT COUNT(*) FROM leaves;             -- Can be 0 initially
SELECT COUNT(*) FROM performance_reviews; -- Can be 0 initially
SELECT COUNT(*) FROM employee_documents;  -- Can be 0 initially
SELECT COUNT(*) FROM positions;          -- Should have 5-10 positions

-- Relations
SELECT e.employeeNumber, u.email, c.firstName
FROM employees e
LEFT JOIN users u ON e.userId = u.id
LEFT JOIN candidates c ON e.candidateId = c.id;
-- Should show employee → user → candidate link
```

---

## 🚨 CRITICAL RULES

**RULE 0: Production-Ready Only**
- ❌ NO mock data, NO placeholders, NO TODOs
- ✅ Real database, real API, real UI

**RULE 1: Zero Console Errors**
- ❌ Console errors NOT acceptable
- ✅ playwright.console_errors() → errorCount = 0

**RULE 2: Complete CRUD**
- ❌ Read-only NOT enough
- ✅ Create, Read, Update, Delete ALL working

**RULE 3: RBAC Enforced**
- ❌ Anyone accessing anything NOT acceptable
- ✅ ADMIN, HR, MANAGER, USER permissions enforced

**RULE 4: Org Isolation**
- ❌ Cross-org data leak NOT acceptable
- ✅ Multi-tenant isolation verified

---

## 📝 DELIVERABLES

1. **Code:**
   - Prisma schema update
   - 4 controllers (20+ endpoints)
   - 4 route files
   - 8+ frontend pages
   - 3+ custom hooks

2. **Tests:**
   - e2e-employee-management-template.py
   - Test results JSON
   - 8+ screenshots

3. **Documentation:**
   - API endpoint docs
   - User guide (Employee Management)
   - W1 completion report

4. **Git:**
   - 1 file = 1 commit
   - Commit messages: feat(employee): ...
   - Clean git history

---

**READY TO IMPLEMENT! START WITH PHASE 1!**
