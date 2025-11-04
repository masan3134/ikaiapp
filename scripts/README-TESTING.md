# 🧪 Testing Scripts Guide

**Updated:** 2025-11-04 (AsanMod v15.5)

---

## 🎯 Quick Token Helper (ÖNERİLİR!)

**Script:** `scripts/get-token.sh`

### Kullanım:

```bash
# USER token
TOKEN=$(./scripts/get-token.sh USER)
curl http://localhost:8102/api/v1/dashboard/user -H "Authorization: Bearer $TOKEN" | jq .

# HR_SPECIALIST token
TOKEN=$(./scripts/get-token.sh HR_SPECIALIST)
curl http://localhost:8102/api/v1/dashboard/hr-specialist -H "Authorization: Bearer $TOKEN" | jq .

# MANAGER token
TOKEN=$(./scripts/get-token.sh MANAGER)
curl http://localhost:8102/api/v1/dashboard/manager -H "Authorization: Bearer $TOKEN" | jq .

# ADMIN token
TOKEN=$(./scripts/get-token.sh ADMIN)
curl http://localhost:8102/api/v1/dashboard/admin -H "Authorization: Bearer $TOKEN" | jq .

# SUPER_ADMIN token
TOKEN=$(./scripts/get-token.sh SUPER_ADMIN)
curl http://localhost:8102/api/v1/dashboard/super-admin -H "Authorization: Bearer $TOKEN" | jq .
```

### Özellikler:
- ✅ Tek satır (kolay!)
- ✅ Tüm roller destekleniyor
- ✅ Hata kontrolü var
- ✅ jq ile parse edilmiş token

---

## 🐍 Python Test Helper (Alternatif)

**Script:** `scripts/test-helper.py`

### Kullanım:

```python
from test_helper import IKAITestHelper, TEST_USERS

# Initialize
helper = IKAITestHelper()

# Login
helper.login_as('USER')

# Test endpoints
result = helper.get('/dashboard/user')
print(result)
```

**Daha fazla:** `docs/test-tasks/WORKER-SCRIPT-GUIDE.md`

---

## 📋 Hangisini Kullanmalı?

| Durum | Öneri |
|-------|-------|
| Hızlı API test (curl) | ✅ **get-token.sh** (Bash) |
| Kompleks test senaryosu | ✅ **test-helper.py** (Python) |
| AsanMod verification | ✅ **get-token.sh** (standart) |
| Automation script | ✅ **test-helper.py** (güçlü) |

---

## 🎯 AsanMod Standardı

**Worker'lar için:**
- API test raporlarında `get-token.sh` kullan
- Mod aynı script'i kullanarak verify edebilsin

**Örnek Rapor:**
```markdown
## API Test

**Command:**
```bash
TOKEN=$(./scripts/get-token.sh USER)
curl http://localhost:8102/api/v1/dashboard/user -H "Authorization: Bearer $TOKEN" | jq .
```

**Output:**
```json
{
  "success": true,
  "data": {...}
}
```
```

---

**Location:** `/home/asan/Desktop/ikai/scripts/`
