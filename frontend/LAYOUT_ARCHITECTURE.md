# 🏗️ IKAI Frontend - Layout Architecture Plan

## 📐 Yeni Yapı (Route Groups + Role-Based)

```
app/
├── layout.tsx                    # Root layout (HTML shell)
├── page.tsx                      # Landing page
├── login/
│   └── page.tsx                  # Public
├── register/
│   └── page.tsx                  # Public
│
├── (authenticated)/              # Route Group - Tüm korumalı sayfalar
│   ├── layout.tsx               # Shared sidebar + auth check
│   ├── dashboard/
│   │   └── page.tsx             # Tüm roller
│   ├── wizard/
│   │   └── page.tsx             # Tüm roller
│   ├── analyses/
│   │   ├── page.tsx             # Tüm roller
│   │   └── [id]/page.tsx        # Tüm roller
│   ├── job-postings/
│   │   └── page.tsx             # Tüm roller
│   ├── candidates/
│   │   └── page.tsx             # Tüm roller
│   │
│   └── (admin)/                 # Nested Route Group - Sadece admin
│       ├── layout.tsx           # Admin sidebar (ek menüler)
│       ├── users/
│       │   └── page.tsx         # Kullanıcı yönetimi
│       ├── settings/
│       │   └── page.tsx         # Sistem ayarları
│       └── reports/
│           └── page.tsx         # Raporlar
```

---

## 🎯 Özellikler

### 1. Route Groups (Parantez)
```
(authenticated) → URL'de görünmez
/dashboard → app/(authenticated)/dashboard/page.tsx
/wizard → app/(authenticated)/wizard/page.tsx

(admin) → URL'de görünmez
/users → app/(authenticated)/(admin)/users/page.tsx
/settings → app/(authenticated)/(admin)/settings/page.tsx
```

### 2. Layout Hierarchy
```
Root Layout (app/layout.tsx)
  └─ Authenticated Layout (app/(authenticated)/layout.tsx)
      ├─ Dashboard, Wizard, Analyses... (normal user sayfaları)
      └─ Admin Layout (app/(authenticated)/(admin)/layout.tsx)
          └─ Users, Settings, Reports... (admin sayfaları)
```

### 3. Auth Logic
```typescript
// app/(authenticated)/layout.tsx
<ProtectedRoute>
  <Sidebar menuItems={baseMenuItems} />
  {children}
</ProtectedRoute>

// app/(authenticated)/(admin)/layout.tsx
<ProtectedRoute allowedRoles={['ADMIN']}>
  <Sidebar menuItems={[...baseMenuItems, ...adminMenuItems]} />
  {children}
</ProtectedRoute>
```

---

## 🔧 ProtectedRoute Güncellemesi

```typescript
// components/ProtectedRoute.tsx

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('USER' | 'ADMIN' | 'MANAGER' | 'HR_SPECIALIST')[];
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath = '/dashboard'
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Auth check
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    // Role check
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push(fallbackPath);
    }
  }, [user, isLoading, allowedRoles, router, fallbackPath]);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
```

---

## 📊 Sidebar Menu Yapısı

```typescript
// lib/config/menuItems.ts

export const baseMenuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['USER', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'] },
  { name: 'Analiz Sihirbazı', path: '/wizard', icon: Wand2, roles: ['USER', 'ADMIN', 'HR_SPECIALIST'] },
  { name: 'İş İlanları', path: '/job-postings', icon: Briefcase, roles: ['USER', 'ADMIN', 'HR_SPECIALIST'] },
  { name: 'Adaylar', path: '/candidates', icon: Users, roles: ['USER', 'ADMIN', 'HR_SPECIALIST'] },
  { name: 'Geçmiş Analizlerim', path: '/analyses', icon: Clock, roles: ['USER', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'] },
];

export const adminMenuItems = [
  { name: 'Kullanıcılar', path: '/users', icon: Shield, roles: ['ADMIN'] },
  { name: 'Sistem Ayarları', path: '/settings', icon: Settings, roles: ['ADMIN'] },
  { name: 'Raporlar', path: '/reports', icon: FileText, roles: ['ADMIN'] },
];

// Sidebar component'te:
const visibleMenuItems = [...baseMenuItems, ...adminMenuItems].filter(item =>
  item.roles.includes(user.role)
);
```

---

## 🚀 Gelecekte Yeni Rol Ekleme

### 1. Database'e Enum Ekle
```prisma
enum Role {
  USER
  ADMIN
  MANAGER        // ← YENİ
  HR_SPECIALIST  // ← YENİ
}
```

### 2. Yeni Rol İçin Sayfalar Ekle
```
app/(authenticated)/(manager)/
  ├── layout.tsx           # Manager sidebar
  ├── team-reports/
  │   └── page.tsx
  └── approvals/
      └── page.tsx
```

### 3. Menu Items Güncelle
```typescript
export const managerMenuItems = [
  { name: 'Ekip Raporları', path: '/team-reports', icon: Users, roles: ['MANAGER', 'ADMIN'] },
  { name: 'Onaylar', path: '/approvals', icon: CheckSquare, roles: ['MANAGER', 'ADMIN'] },
];
```

**Hiçbir mevcut kodu bozmadan yeni roller eklenebilir!**

---

## ⚡ Avantajlar

✅ **Scalable**: Yeni roller kolayca eklenir
✅ **Maintainable**: Tek layout dosyası
✅ **Type-safe**: Role enum'ları TypeScript ile
✅ **Flexible**: Her rol için özel sidebar
✅ **Clean**: Next.js conventions
✅ **Performant**: Layout cache, gereksiz re-render yok

---

## 🎯 Başlayalım mı?

Adım adım yapacağım, her adımda commit. Hata olursa rollback!
