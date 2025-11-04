# 📊 Template: Add Dashboard Widget

**Use case:** Adding a widget to role dashboard
**Duration:** 15-20 minutes
**Difficulty:** Easy

---

## Step 1: Create Widget Component

**File:** `frontend/components/dashboard/{role}/{WidgetName}.tsx`

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WidgetName() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Title</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your content */}
      </CardContent>
    </Card>
  );
}
```

**Commit immediately:**
```bash
git add frontend/components/dashboard/{role}/{WidgetName}.tsx
git commit -m "feat(dashboard): Add {WidgetName} widget ({ROLE})"
```

---

## Step 2: Add to Dashboard Layout

**File:** `frontend/app/(authenticated)/{role}-dashboard/page.tsx`

**Import:**
```tsx
import { WidgetName } from '@/components/dashboard/{role}/{WidgetName}';
```

**Add to grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Existing widgets */}
  <WidgetName />
</div>
```

**Commit immediately:**
```bash
git add frontend/app/(authenticated)/{role}-dashboard/page.tsx
git commit -m "feat(dashboard): Integrate {WidgetName} to {ROLE} dashboard"
```

---

## Step 3: Test

**Browser test:**
```
1. Open http://localhost:8103
2. Login as {role}
3. Check dashboard
4. Widget görünüyor mu? ✅
```

**If NOT visible:**
```bash
# Check logs
docker logs ikai-frontend --tail 50 | grep -i "error"

# If error in YOUR widget → Fix immediately!
# Commit fix, re-test
```

---

## Step 4: Report

**Format:**
```
✅ {WidgetName} widget tamamlandı
Role: {ROLE}
Commits: 2
Test: PASS (browser verified)
```

---

## Verification (for Mod)

**Count widgets:**
```bash
ls -1 frontend/components/dashboard/{role}/*.tsx | wc -l
```

**Check import:**
```bash
grep "{WidgetName}" frontend/app/(authenticated)/{role}-dashboard/page.tsx
```

**Expected:** File exists + imported ✅
