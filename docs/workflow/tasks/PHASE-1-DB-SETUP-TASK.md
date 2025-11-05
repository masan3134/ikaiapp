# ✅ FAZ 1: Veritabanı ve Altyapı Kurulumu

**Görev:** Çalışan Yönetimi Modülü için veritabanı şeması oluşturma.
**Atanan Worker:** W1
**Öncelik:** YÜKSEK
**Rapor Lokasyonu:** `docs/reports/PHASE-1-DB-SETUP-REPORT.md`
**Süre:** ~1 Gün

---

## 🎯 AMAÇ

Bu fazın tek amacı, "Çalışan Yönetimi" modülünün ihtiyaç duyduğu tüm veritabanı altyapısını `prisma/schema.prisma` dosyası üzerinde kurmak, veritabanını migrate etmek ve temel verileri tohumlamaktır. Faz sonunda, backend ekibinin üzerine API yazabileceği sağlam bir temel oluşturulmalıdır.

---

## 📋 W1 - UYGULAMA ADIMLARI

**Her adımı tamamladığında bu checklist'i güncelle.**

### 1. Prisma Şemasını Güncelleme
- [ ] `backend/prisma/schema.prisma` dosyasını aç.
- [ ] Aşağıdaki `enum` tanımlarını dosyanın uygun bir bölümüne ekle:
  ```prisma
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

  enum LeaveType {
    ANNUAL
    SICK
    UNPAID
    MATERNITY
    PATERNITY
    BEREAVEMENT
    MARRIAGE
    OTHER
  }

  enum LeaveStatus {
    PENDING
    APPROVED
    REJECTED
    CANCELLED
  }

  enum DocumentType {
    CONTRACT
    ID_CARD
    DIPLOMA
    CERTIFICATE
    TAX_DOCUMENT
    HEALTH_REPORT
    OTHER
  }
  ```
- [ ] Aşağıdaki yeni modelleri şemaya ekle. Mevcut modellere (`User`, `Candidate`) sadece belirtilen yeni alanları ekle, diğer alanları değiştirme.

  ```prisma
  // ==================================================
  // YENİ MODELLER
  // ==================================================

  model Position {
    id              String        @id @default(cuid())
    organizationId  String
    title           String
    level           String?
    description     String?
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt
    organization    Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
    employees       Employee[]
    @@unique([organizationId, title])
    @@index([organizationId])
  }

  model Employee {
    id                String              @id @default(cuid())
    employeeNumber    String              @unique
    userId            String              @unique
    candidateId       String?             @unique
    firstName         String
    lastName          String
    email             String              @unique
    phone             String?
    dateOfBirth       DateTime?
    address           String?
    organizationId    String
    departmentId      String
    positionId        String
    managerId         String?
    startDate         DateTime
    endDate           DateTime?
    employmentType    EmploymentType
    status            EmploymentStatus    @default(ACTIVE)
    salary            Decimal?
    currency          String              @default("TRY")
    createdAt         DateTime            @default(now())
    updatedAt         DateTime            @updatedAt
    createdBy         String
    organization      Organization        @relation(fields: [organizationId], references: [id], onDelete: Cascade)
    department        Department          @relation(fields: [departmentId], references: [id])
    position          Position            @relation(fields: [positionId], references: [id])
    manager           Employee?           @relation("ManagerSubordinates", fields: [managerId], references: [id], onDelete: NoAction)
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

  model Leave {
    id              String        @id @default(cuid())
    employeeId      String
    organizationId  String
    type            LeaveType
    startDate       DateTime
    endDate         DateTime
    totalDays       Int
    reason          String?
    status          LeaveStatus   @default(PENDING)
    approvedBy      String?
    approvedAt      DateTime?
    rejectionReason String?
    createdAt       DateTime      @default(now())
    updatedAt       DateTime      @updatedAt
    employee        Employee      @relation(fields: [employeeId], references: [id], onDelete: Cascade)
    organization    Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
    approver        User?         @relation(fields: [approvedBy], references: [id], onDelete: NoAction)
    @@index([employeeId])
    @@index([organizationId])
    @@index([status])
  }

  model PerformanceReview {
    id              String    @id @default(cuid())
    employeeId      String
    reviewerId      String
    organizationId  String
    reviewPeriod    String
    reviewDate      DateTime
    technicalSkills Int?
    communication   Int?
    teamwork        Int?
    productivity    Int?
    overallRating   Int
    strengths       String?
    areasForGrowth  String?
    goals           String?
    notes           String?
    createdAt       DateTime  @default(now())
    updatedAt       DateTime      @updatedAt
    employee        Employee      @relation(fields: [employeeId], references: [id], onDelete: Cascade)
    reviewer        User          @relation(fields: [reviewerId], references: [id], onDelete: NoAction)
    organization    Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
    @@index([employeeId])
    @@index([organizationId])
  }

  model EmployeeDocument {
    id              String          @id @default(cuid())
    employeeId      String
    organizationId  String
    type            DocumentType
    title           String
    fileName        String
    fileUrl         String
    fileSize        Int
    mimeType        String
    uploadedBy      String
    uploadedAt      DateTime        @default(now())
    expiryDate      DateTime?
    notes           String?
    employee        Employee        @relation(fields: [employeeId], references: [id], onDelete: Cascade)
    organization    Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
    uploader        User            @relation(fields: [uploadedBy], references: [id], onDelete: NoAction)
    @@index([employeeId])
    @@index([organizationId])
  }

  // ==================================================
  // GÜNCELLENECEK MODELLER
  // ==================================================

  model User {
    // ... mevcut alanlar ...
    employee        Employee?
    // ... mevcut ilişkiler ...
  }

  model Candidate {
    // ... mevcut alanlar ...
    employee        Employee?
    // ... mevcut ilişkiler ...
  }
  ```

### 2. Veritabanı Migrasyonu
- [ ] Projenin ana dizinindeyken terminali aç.
- [ ] `cd backend` komutu ile backend dizinine geç.
- [ ] Aşağıdaki komutu **değiştirmeden** çalıştır:
  ```bash
  npx prisma migrate dev --name add-employee-management-module
  ```
- [ ] Komutun başarıyla tamamlandığını ve `backend/prisma/migrations/` altında yeni bir migrasyon klasörü oluşturduğunu onayla.

### 3. Veri Tohumlama (Seeding)
- [ ] `backend/prisma/seed.ts` (veya projedeki adı ne ise) dosyasını bul ve aç.
- [ ] `Position` tablosunu temel verilerle doldurmak için aşağıdaki mantığı ekle. **Not:** Bu kod, mevcut `seed.ts` yapınıza uyarlanmalıdır.
  ```typescript
  // Örnek tohumlama mantığı - kendi seed dosyanıza uyarlayın
  async function seedPositions(prisma: PrismaClient) {
    console.log('Seeding positions...');
    const org = await prisma.organization.findFirst();
    if (!org) {
      console.log('No organization found, skipping position seeding.');
      return;
    }

    const positions = [
      { title: 'Backend Developer', level: 'Senior' },
      { title: 'Frontend Developer', level: 'Mid' },
      { title: 'Project Manager', level: 'Senior' },
      { title: 'HR Specialist', level: 'Mid' },
      { title: 'UI/UX Designer', level: 'Junior' },
    ];

    for (const pos of positions) {
      await prisma.position.upsert({
        where: { organizationId_title: { organizationId: org.id, title: pos.title } },
        update: {},
        create: {
          organizationId: org.id,
          title: pos.title,
          level: pos.level,
        },
      });
    }
    console.log('Positions seeded.');
  }

  // Bu fonksiyonu ana seed fonksiyonunuzun içinde çağırın
  // await seedPositions(prisma);
  ```
- [ ] `npx prisma db seed` komutunu çalıştırarak tohumlama işlemini gerçekleştir.

---

## 🚨 KRİTİK KURALLAR

- **KURAL 0:** Hiçbir dosyada `mock`, `placeholder`, `TODO` gibi yasaklı kelimeler kullanma.
- **DOKUNULMAZLIK:** `schema.prisma` içinde bu görevle ilgisi olmayan hiçbir satırı değiştirme. Sadece ekleme ve belirtilen güncellemelere izin var.
- **TEK COMMIT:** Bu fazın tüm değişiklikleri (`schema.prisma` ve yeni migrasyon dosyası) tek ve temiz bir commit mesajıyla gönderilmelidir: `feat(db): add employee management schema`

---

## ✅ BAŞARI KRİTERLERİ

- **Migrasyon:** `npx prisma migrate dev` komutu hatasız tamamlandı.
- **Tablolar:** `employees`, `leaves`, `performance_reviews`, `employee_documents`, `positions` tabloları veritabanında mevcut.
- **İlişkiler:** `User` ve `Candidate` tabloları ile `Employee` tablosu arasındaki ilişki kuruldu.
- **Tohumlama:** `positions` tablosunda en az 5 adet pozisyon verisi mevcut.

---

##  deliverables

1.  **Değiştirilmiş Dosya:** `backend/prisma/schema.prisma`
2.  **Yeni Klasör:** `backend/prisma/migrations/XXXXXXXXXXXXXX_add-employee-management-module`
3.  **Rapor:** `docs/reports/PHASE-1-DB-SETUP-REPORT.md` içinde bu görevdeki adımların tamamlandığını belirten kısa bir özet.
