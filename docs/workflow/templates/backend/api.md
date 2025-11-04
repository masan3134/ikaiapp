# 🔌 Template: Add API Endpoint

**Use case:** Creating new backend API endpoint
**Duration:** 20-30 minutes
**Difficulty:** Medium

---

## Step 1: Add Route

**File:** `backend/src/routes/{domain}Routes.js`

```javascript
// Add endpoint
router.get('/{endpoint}', authorize([...]), async (req, res) => {
  try {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;

    // Your logic here
    const data = await prisma.{model}.findMany({
      where: {
        organizationId, // Multi-tenant!
      }
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**Commit:**
```bash
git add backend/src/routes/{domain}Routes.js
git commit -m "feat(api): Add GET /{endpoint} endpoint"
```

---

## Step 2: Add Authorization

**Roles:**
```javascript
authorize(['SUPER_ADMIN']) // Only super admin
authorize(['ADMIN', 'SUPER_ADMIN']) // Admins
authorize(['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']) // HR+
authorize() // All authenticated users
```

**Always include organizationId filter for multi-tenant!**

---

## Step 3: Test with Python

**Script:**
```python
import requests

BASE = 'http://localhost:8102'

# Login
r = requests.post(f'{BASE}/api/v1/auth/login',
                  json={'email': 'test-admin@test-org-1.com',
                        'password': 'TestPass123!'})
token = r.json()['token']

# Test endpoint
r = requests.get(f'{BASE}/api/v1/{endpoint}',
                 headers={'Authorization': f'Bearer {token}'})

print(f"Status: {r.status_code}")
print(f"Data: {r.json()}")
```

**Expected:** 200 OK + data ✅

---

## Step 4: Check Logs

```bash
docker logs ikai-backend --tail 50 | grep -i "error"
```

**If errors → Fix → Commit → Re-test**

---

## Step 5: Report

**Format:**
```
✅ /{endpoint} API tamamlandı
Method: GET
Auth: {ROLES}
Test: 200 OK
```

---

## Verification (for Mod)

**Check route exists:**
```bash
grep -n "router.get('/{endpoint}'" backend/src/routes/{domain}Routes.js
```

**Test API:**
```python
# (Mod runs same Python test)
# Compare status code
```

**Expected:** Route exists + 200 OK ✅
