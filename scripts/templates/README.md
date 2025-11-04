# 📋 Test Script Templates

**6 hazır template** - Worker'ların test scriptleri yazması için

---

## 🚀 Quick Start

```bash
# 1. Template'i kopyala
cp scripts/templates/api-test-template.py scripts/tests/w1-my-test.py

# 2. Senaryonu düzenle
nano scripts/tests/w1-my-test.py

# 3. Çalıştır
python3 scripts/tests/w1-my-test.py > test-outputs/w1-output.txt
```

---

## 📚 Available Templates

| Template | Purpose | Complexity | Time |
|----------|---------|------------|------|
| [api-test-template.py](api-test-template.py) | Basic CRUD testing | ⭐ Easy | 5 min |
| [rbac-test-template.py](rbac-test-template.py) | Role permission testing | ⭐⭐ Medium | 10 min |
| [workflow-test-template.py](workflow-test-template.py) | Full hiring workflow | ⭐⭐⭐ Complex | 15 min |
| [performance-test-template.py](performance-test-template.py) | Response time testing | ⭐⭐ Medium | 10 min |
| [ai-chat-test-template.py](ai-chat-test-template.py) | AI chat testing | ⭐⭐ Medium | 10 min |
| [cleanup-test-template.py](cleanup-test-template.py) | Cleanup test data | ⭐ Easy | 5 min |

---

## 🎯 Template Details

### 1. api-test-template.py
**What it does:** Basic API endpoint testing (GET, POST, PUT, DELETE)
**Includes:** Login, CRUD operations, cleanup, error handling
**Good for:** Quick API verification

### 2. rbac-test-template.py
**What it does:** Test endpoint with all 5 roles (SUPER_ADMIN → USER)
**Includes:** Multi-role testing, permission matrix, expected vs actual
**Good for:** RBAC Layer 1 & 2 verification

### 3. workflow-test-template.py
**What it does:** Complete hiring workflow (CV upload → Analysis → Offer → Interview)
**Includes:** File upload, queue wait, role switching, multi-step process
**Good for:** Integration testing, end-to-end scenarios

### 4. performance-test-template.py
**What it does:** Measure API response times (10 runs per endpoint)
**Includes:** Statistics (avg, median, min, max, std dev), performance assessment
**Good for:** Performance benchmarking, slow endpoint detection

### 5. ai-chat-test-template.py
**What it does:** Test AI chat functionality, context, response quality
**Includes:** Multiple questions, follow-up (context test), response time, quality review
**Good for:** AI system verification

### 6. cleanup-test-template.py
**What it does:** Remove test items created during testing
**Includes:** Filter by field, multi-category cleanup, delete summary
**Good for:** Test data hygiene, cleanup after tests

---

## 📖 Full Documentation

**Complete guide:** [`docs/test-tasks/WORKER-SCRIPT-GUIDE.md`](../../docs/test-tasks/WORKER-SCRIPT-GUIDE.md)

---

## ⚠️ Important Rules

**READONLY files:**
- ❌ Don't modify `scripts/test-helper.py`
- ❌ Don't modify templates in `scripts/templates/`
- ❌ Don't modify test data in `test-data/`

**YOUR files:**
- ✅ Copy templates to `scripts/tests/`
- ✅ Save outputs to `test-outputs/`
- ✅ Reference in reports

---

**🚀 Copy, Customize, Run!**
