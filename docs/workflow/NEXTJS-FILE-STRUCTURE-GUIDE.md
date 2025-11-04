# 📁 Next.js App Router - File Structure Guide

**For:** MOD & All Workers
**Purpose:** Prevent editing wrong files!
**Version:** 1.0 (2025-11-04)

---

## 🚨 CRITICAL: Know Which File Is Real!

**This Session Waste:** 30+ minutes editing WRONG file!

**Root Cause:**
- 2 layout files existed
- Edited `components/AppLayout.tsx` (dead code!)
- Real file: `app/(authenticated)/layout.tsx` (Next.js renders this!)
- Changes never appeared → Circular debugging!

---

## 📁 NEXT.JS APP ROUTER STRUCTURE

### ✅ Real Files (Next.js Renders These!)

```
frontend/
├── app/
│   ├── layout.tsx              ← Root layout (ALL pages)
│   ├── page.tsx                ← Homepage
│   │
│   ├── (public)/
│   │   ├── layout.tsx          ← Public pages layout
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── ...
│   │
│   ├── (authenticated)/
│   │   ├── layout.tsx          ← ✅ SIDEBAR HERE! (Dashboard layout)
│   │   ├── dashboard/page.tsx
│   │   ├── job-postings/page.tsx
│   │   ├── candidates/page.tsx
│   │   └── ...
│   │
│   └── api/                    ← API routes (if any)
```

### ❌ Components (NOT Layouts!)

```
frontend/
├── components/
│   ├── AppLayout.tsx          ← ❌ DEAD CODE (deleted!)
│   ├── Sidebar.tsx            ← ❌ If exists, probably dead
│   ├── notifications/         ← ✅ Shared components (OK!)
│   ├── dashboard/             ← ✅ Widgets (OK!)
│   └── ...
```

---

## 🎯 HOW TO FIND THE REAL FILE

### Step 1: Understand Next.js Routing

**Next.js App Router:**
- `app/` directory = routes
- `page.tsx` = page component
- `layout.tsx` = layout wrapper
- Nested folders = nested routes

**Example:**
```
app/(authenticated)/job-postings/page.tsx
→ Route: /job-postings
→ Layout: app/(authenticated)/layout.tsx (wraps this page!)
```

### Step 2: Find Layout by Route

**If you need to edit sidebar:**

```bash
# Find layout for authenticated pages
ls -lh app/\(authenticated\)/layout.tsx

# This is THE file that renders sidebar!
```

**Not:**
```bash
# ❌ WRONG:
ls components/AppLayout.tsx  # Dead code!
```

### Step 3: Verify File is Used

**Method 1: Check imports**
```bash
# Real layouts don't get imported!
# They're auto-loaded by Next.js

grep -r "import.*layout" app/ --include="*.tsx"
# Should NOT find app/(authenticated)/layout.tsx imported!
```

**Method 2: Check git recent changes**
```bash
git log --oneline app/\(authenticated\)/layout.tsx -5

# Should see recent activity if it's real!
```

**Method 3: Edit test**
```typescript
// Add obvious change:
console.log('🔥 TESTING IF THIS FILE IS REAL');

// Refresh browser
// Check console for message
// If message appears → File is real!
// If not → File is dead!
```

---

## 🚫 COMMON MISTAKES

### Mistake 1: Editing components/AppLayout.tsx

```
❌ WRONG FILE (this session):
Edit: components/AppLayout.tsx
Commit: "Add sidebar items"
Result: Nothing changed in browser!

✅ RIGHT FILE:
Edit: app/(authenticated)/layout.tsx
Commit: "Add sidebar items"
Result: Changes appear immediately!
```

### Mistake 2: Trusting Old Code

```
❌ WRONG:
"AppLayout.tsx has 500 lines, must be real!"

✅ RIGHT:
"Let me check: Is this imported? Recent commits? Test edit?"
```

### Mistake 3: Not Deleting Dead Code

```
❌ WRONG:
Rename: AppLayout.tsx → AppLayout.tsx.DEPRECATED
Keep: For reference

✅ RIGHT:
DELETE: AppLayout.tsx
Reason: Confusion source! Future workers will edit it!
```

---

## 📋 VERIFICATION PROTOCOL

**Before editing layout/sidebar:**

### Step 1: Find Real File
```bash
# Search for sidebar rendering
grep -r "allMenuItems\|menuItems.*=" app/ --include="*.tsx" -l

# Should find: app/(authenticated)/layout.tsx
```

### Step 2: Verify It's Real
```bash
# Check recent activity
git log app/\(authenticated\)/layout.tsx -3

# Should see recent commits (means it's actively used!)
```

### Step 3: Test Edit
```typescript
// Add console log at top of component:
console.log('🔥 LAYOUT FILE LOADED:', new Date().toISOString());

// Refresh browser (Incognito!)
// Check console
// If log appears → File is real!
```

### Step 4: Edit Safely
```typescript
// Now edit menu items
const allMenuItems = [
  { name: "Dashboard", ... },
  { name: "New Item", ... }, // Your change
];
```

### Step 5: Verify in Incognito
```
Ctrl + Shift + N
Login
Check sidebar
```

---

## 🎯 NEXT.JS SPECIFIC RULES

### Rule 1: app/ Directory = Routes
```
app/
├── (authenticated)/
│   ├── layout.tsx        ← Layout for /dashboard, /job-postings, etc
│   ├── dashboard/
│   │   └── page.tsx      ← /dashboard route
│   ├── job-postings/
│   │   └── page.tsx      ← /job-postings route
```

### Rule 2: components/ = Shared Components
```
components/
├── dashboard/
│   ├── user/
│   │   └── ProfileWidget.tsx   ← Used BY pages, not routes!
├── ui/
│   └── Button.tsx              ← Shared component
```

### Rule 3: layouts Nest
```
app/layout.tsx                   ← Root (wraps everything)
└── app/(authenticated)/layout.tsx  ← Sidebar (wraps dashboard pages)
    └── app/(authenticated)/dashboard/page.tsx  ← Page content
```

### Rule 4: Old Code Dies
```
If Next.js migration happened:
- Old: components/AppLayout.tsx
- New: app/(authenticated)/layout.tsx
- DELETE old file (don't keep for reference!)
```

---

## 🛠️ PREVENTION RULES

### For MOD:

**Rule:** Always verify file before editing!

```bash
# Before editing sidebar:
grep -r "const.*menuItems\|const.*allMenuItems" frontend/ --include="*.tsx" -l

# Should find app/(authenticated)/layout.tsx
# NOT components/AppLayout.tsx!
```

### For Workers:

**Rule:** Search first, edit second!

```bash
# Task: "Update sidebar"

# Step 1: Find real file
grep -r "menuItems" app/ components/ --include="*.tsx" -l

# Step 2: Check which is used (recent commits)
git log [file] -3

# Step 3: Verify before editing
# Add test console.log, check browser

# Step 4: Edit real file only!
```

---

## 📊 FILE DETECTION CHECKLIST

**Indicators file is REAL:**
- [x] In `app/` directory (Next.js routes)
- [x] Recent git commits (active)
- [x] Large file size (complex logic)
- [x] Test edit appears in browser

**Indicators file is DEAD:**
- [x] In `components/` but not imported
- [x] No recent commits (months old)
- [x] Renamed `.DEPRECATED` or `.backup`
- [x] Test edit doesn't appear

---

## 🎓 NEXT.JS APP ROUTER BASICS

**Key Concepts:**

1. **Routing:** Folder structure = URL structure
   ```
   app/(authenticated)/job-postings/page.tsx
   → URL: /job-postings
   ```

2. **Layouts:** layout.tsx wraps children
   ```
   app/(authenticated)/layout.tsx
   → Wraps ALL /dashboard, /job-postings, etc
   ```

3. **Components:** Imported explicitly
   ```
   import Widget from '@/components/Widget'
   → Must be imported to be used
   ```

4. **Dead Code:** Delete immediately!
   ```
   Old file not imported? DELETE!
   Don't keep for reference (causes confusion!)
   ```

---

## 🚨 PREVENTION CHECKLIST

**Before editing any file:**

- [ ] Search: Where is this code actually used?
- [ ] Verify: Recent git commits?
- [ ] Test: Add console.log, appears in browser?
- [ ] Confirm: This is the real file?
- [ ] Edit: Make changes
- [ ] Verify: Incognito test
- [ ] Report: Changes visible!

**If changes don't appear:**

1. DON'T loop forever debugging!
2. Question: "Am I editing the right file?"
3. Search: `grep -r "code pattern" app/ components/`
4. Verify: Which file is actually rendering?
5. Switch: Edit real file!

---

**🎯 GOLDEN RULE: Search First, Edit Second!**

Never assume file names!
Always verify which file is rendering!
Delete dead code immediately!
