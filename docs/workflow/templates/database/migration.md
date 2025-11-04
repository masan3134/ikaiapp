# 🗄️ Template: Database Migration

**Use case:** Adding column, table, or schema change
**Duration:** 15 minutes
**Difficulty:** Medium

---

## Step 1: Edit Schema

**File:** `backend/prisma/schema.prisma`

**Add column:**
```prisma
model YourModel {
  id String @id @default(uuid())
  // Existing fields...

  newField String? // Nullable if optional
  createdAt DateTime @default(now())
}
```

**Commit schema:**
```bash
git add backend/prisma/schema.prisma
git commit -m "db(schema): Add newField to YourModel"
```

---

## Step 2: Create Migration

```bash
cd backend
npx prisma migrate dev --name add_new_field
```

**This creates:**
- `prisma/migrations/YYYYMMDD_add_new_field/migration.sql`

**Commit migration:**
```bash
git add prisma/migrations/
git commit -m "db(migration): Add newField migration"
```

---

## Step 3: Apply Migration

**Dev environment (Docker):**
```bash
docker exec ikai-backend npx prisma migrate deploy
```

**Check logs:**
```bash
docker logs ikai-backend --tail 20
# Should see: "Applied migration"
```

---

## Step 4: Test

**Check field exists:**
```javascript
// In your API/code
const item = await prisma.yourModel.findFirst();
console.log(item.newField); // Should not error
```

---

## Step 5: Report

**Format:**
```
✅ Migration tamamlandı
Field: newField (String?)
Model: YourModel
Migration: YYYYMMDD_add_new_field
Status: Applied ✅
```

---

## Verification (for Mod)

**Check schema:**
```bash
grep "newField" backend/prisma/schema.prisma
```

**Check migration exists:**
```bash
ls -1 backend/prisma/migrations/ | grep "add_new_field"
```

**Check applied:**
```bash
docker exec ikai-postgres psql -U ikaiuser -d ikaidb -c "\d \"YourModel\""
# Should show newField column
```
