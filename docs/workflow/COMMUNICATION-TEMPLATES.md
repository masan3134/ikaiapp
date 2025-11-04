# 📨 AsanMod Communication Templates

**Version:** 1.0
**Created:** 2025-11-04
**Purpose:** Kolay copy-paste ile Mod ↔ Worker iletişimi

---

## 🎯 Kullanım

**User rolü:** Message courier (mesaj taşıyıcı)

**Mod → Worker:** Task dağıtımı (bu template'i kopyala, worker terminaline yapıştır)
**Worker → Mod:** Rapor iletimi (bu template'i kopyala, mod terminaline yapıştır)

---

## 📋 TEMPLATE 1: Mod → Worker (Görev Dağıtımı)

### Format:
```
═══════════════════════════════════════════
📋 [WORKER] GÖREV
═══════════════════════════════════════════
Dosya: [TASK_FILE_PATH]
Özet: [1-line description]
Süre: [ESTIMATED_TIME]
───────────────────────────────────────────
BAŞLAT:
"sen workersin"
📖 Oku: [TASK_FILE_PATH]
BAŞLA!
═══════════════════════════════════════════
```

### Örnek 1: Dashboard Görevi
```
═══════════════════════════════════════════
📋 W1 GÖREV
═══════════════════════════════════════════
Dosya: docs/test-tasks/worker1-user-dashboard-design.md
Özet: USER dashboard (8 widget, Slate tema, real API)
Süre: 4-5 saat
───────────────────────────────────────────
BAŞLAT:
"sen workersin"
📖 Oku: docs/test-tasks/worker1-user-dashboard-design.md
BAŞLA!
═══════════════════════════════════════════
```

### Örnek 2: RBAC Görevi
```
═══════════════════════════════════════════
📋 W2 GÖREV
═══════════════════════════════════════════
Dosya: docs/test-tasks/worker2-hr-specialist-rbac-audit.md
Özet: HR_SPECIALIST role audit (30 pages, 6 bugs expected)
Süre: 3-4 saat
───────────────────────────────────────────
BAŞLAT:
"sen workersin"
📖 Oku: docs/test-tasks/worker2-hr-specialist-rbac-audit.md
BAŞLA!
═══════════════════════════════════════════
```

### Örnek 3: Validation Görevi
```
═══════════════════════════════════════════
📋 W3 GÖREV
═══════════════════════════════════════════
Dosya: docs/test-tasks/PAGE-COMPLETION-PROMPTS.md
Özet: Oluşturduğun sayfaları tamamla (NO placeholder!)
Süre: 2-3 saat
───────────────────────────────────────────
BAŞLAT:
"sen workersin"
📖 Oku: docs/test-tasks/PAGE-COMPLETION-PROMPTS.md (W3 bölümü)
BAŞLA!
═══════════════════════════════════════════
```

---

## 📋 TEMPLATE 2: Worker → Mod (Rapor İletimi)

### Format:
```
═══════════════════════════════════════════
✅ [WORKER] TAMAMLANDI
═══════════════════════════════════════════
Rapor: [REPORT_FILE_PATH]
Özet: [1-2 line summary with key metrics]
───────────────────────────────────────────
MOD VERİFY ET:
📖 Oku: [REPORT_FILE_PATH]
🔍 Spot-check yap (5 test)
═══════════════════════════════════════════
```

### Örnek 1: Dashboard Tamamlandı
```
═══════════════════════════════════════════
✅ W1 TAMAMLANDI
═══════════════════════════════════════════
Rapor: docs/reports/worker1-user-dashboard-verification.md
Özet: 8 widget, 7 commit, %100 real data, API test PASS
───────────────────────────────────────────
MOD VERİFY ET:
📖 Oku: docs/reports/worker1-user-dashboard-verification.md
🔍 Spot-check:
  - Prisma count (line X-Y)
  - Mock data (0 expected)
  - API test (curl ...)
  - Widget count (8 expected)
  - Commits (7 expected)
═══════════════════════════════════════════
```

### Örnek 2: RBAC Tamamlandı
```
═══════════════════════════════════════════
✅ W2 TAMAMLANDI
═══════════════════════════════════════════
Rapor: docs/reports/worker2-hr-specialist-rbac-audit-report.md
Özet: 6 bugs buldu & düzeltti, 30 sayfa test, 6 commit
───────────────────────────────────────────
MOD VERİFY ET:
📖 Oku: docs/reports/worker2-hr-specialist-rbac-audit-report.md
🔍 Spot-check:
  - Bug count (6 claimed)
  - withRoleProtection count
  - Build success
  - Console clean
═══════════════════════════════════════════
```

### Örnek 3: Validation Tamamlandı
```
═══════════════════════════════════════════
✅ W3 TAMAMLANDI
═══════════════════════════════════════════
Rapor: docs/reports/w3-page-completion-report.md
Özet: 3 sayfa tamamlandı, 5 API eklendi, 0 placeholder
───────────────────────────────────────────
MOD VERİFY ET:
📖 Oku: docs/reports/w3-page-completion-report.md
🔍 Spot-check:
  - Placeholder count (0 expected)
  - API test (curl outputs)
  - Browser test results
═══════════════════════════════════════════
```

---

## 📋 TEMPLATE 3: Mod → Worker (Re-Do Request)

### Format:
```
═══════════════════════════════════════════
❌ [WORKER] RE-DO REQUIRED
═══════════════════════════════════════════
Sebep: [verification mismatch details]
───────────────────────────────────────────
Düzelt:
1. [Issue 1]
2. [Issue 2]
───────────────────────────────────────────
YENİDEN BAŞLAT:
"sen workersin"
📖 Oku: [ORIGINAL_TASK_FILE]
⚠️ ÖNCEKİ HATALAR:
  - [list issues]
BAŞLA!
═══════════════════════════════════════════
```

### Örnek: Verification Failed
```
═══════════════════════════════════════════
❌ W2 RE-DO REQUIRED
═══════════════════════════════════════════
Sebep: Verification mismatch (2/5 failed)
───────────────────────────────────────────
Sorunlar:
1. Prisma count: Sen 18 dedin, ben 8 buldum
   → Sadece KENDİ endpoint'ini say! (line 136-300)

2. Mock data: Sen 0 dedin, ben 3 buldum
   → Line 156, 234, 289'da MOCK comment'leri var!
───────────────────────────────────────────
YENİDEN BAŞLAT:
"sen workersin"
📖 Oku: docs/test-tasks/worker2-hr-specialist-dashboard-design.md
⚠️ ÖNCEKİ HATALAR:
  - Tüm dosya yerine sadece KENDİ endpoint'i say
  - Mock comment'leri temizle (line 156, 234, 289)
BAŞLA!
═══════════════════════════════════════════
```

---

## 📋 TEMPLATE 4: Worker → Mod (Soru/Yardım)

### Format:
```
═══════════════════════════════════════════
❓ [WORKER] SORU
═══════════════════════════════════════════
Durum: [current situation]
Soru: [specific question]
───────────────────────────────────────────
MOD CEVAP VER:
[Mod will provide guidance]
═══════════════════════════════════════════
```

### Örnek 1: Scope Question
```
═══════════════════════════════════════════
❓ W1 SORU
═══════════════════════════════════════════
Durum: admin-dashboard.tsx'te syntax error görüyorum
Soru: Bu benim dosyam değil (W4'ün). Düzeltmeli miyim?
───────────────────────────────────────────
MOD CEVAP VER:
❌ HAYIR! W4'ün dosyası, DOKUNMA!
Mod: "W4, admin-dashboard.tsx'te syntax error var, düzelt"
Sen devam et kendi görevine.
═══════════════════════════════════════════
```

### Örnek 2: Technical Question
```
═══════════════════════════════════════════
❓ W3 SORU
═══════════════════════════════════════════
Durum: /analytics sayfası için API gerekiyor
Soru: analyticsRoutes.js VAR ama /overview endpoint yok. Eklemeli miyim?
───────────────────────────────────────────
MOD CEVAP VER:
✅ EVET! Ekle.
analyticsRoutes.js SENİN scope'unda (analytics page için gerekli)
Endpoint ekle → Commit → Test et
═══════════════════════════════════════════
```

---

## 📋 TEMPLATE 5: Mod Verification Result

### Format:
```
═══════════════════════════════════════════
🔍 [WORKER] VERİFİCATION RESULT
═══════════════════════════════════════════
Status: ✅ VERIFIED / ⚠️ PARTIAL / ❌ REJECTED
───────────────────────────────────────────
Spot-Check Results (5/5):
1. [Test 1]: ✅ MATCH / ❌ MISMATCH
2. [Test 2]: ✅ MATCH / ❌ MISMATCH
3. [Test 3]: ✅ MATCH / ❌ MISMATCH
4. [Test 4]: ✅ MATCH / ❌ MISMATCH
5. [Test 5]: ✅ MATCH / ❌ MISMATCH
───────────────────────────────────────────
Decision: [ACCEPT / RE-DO / CONDITIONAL]
═══════════════════════════════════════════
```

### Örnek: Verified
```
═══════════════════════════════════════════
🔍 W1 VERİFİCATION RESULT
═══════════════════════════════════════════
Status: ✅ VERIFIED (5/5 MATCH)
───────────────────────────────────────────
Spot-Check Results:
1. Prisma queries: 4 = 4 ✅
2. Mock data: 0 = 0 ✅
3. API test: 200 OK ✅
4. Widget count: 8 = 8 ✅
5. Commits: 7 = 7 ✅
───────────────────────────────────────────
Decision: ✅ ACCEPTED
Worker dürüst, iş kaliteli, production-ready!
═══════════════════════════════════════════
```

### Örnek: Rejected
```
═══════════════════════════════════════════
🔍 W2 VERİFİCATION RESULT
═══════════════════════════════════════════
Status: ❌ REJECTED (2/5 MATCH)
───────────────────────────────────────────
Spot-Check Results:
1. Prisma queries: 18 ≠ 8 ❌ (Worker tüm dosyayı saymış!)
2. Mock data: 0 ≠ 3 ❌ (3 mock var, Worker görmemiş!)
3. API test: 200 OK ✅
4. Widget count: 9 = 9 ✅
5. Commits: 7 = 7 ✅
───────────────────────────────────────────
Decision: ❌ RE-DO REQUIRED
Issues:
- Endpoint-specific count yap (tüm dosya değil!)
- Mock temizle (line 156, 234, 289)

W2'ye geri gönder: TEMPLATE 3 kullan
═══════════════════════════════════════════
```

---

## 🚀 Quick Copy-Paste Örnekleri

### Mod Terminal'de (Task Dağıtımı):

**5 Worker'a Paralel Görev:**
```
Copy-paste for User:

════ W1 ════
📋 W1 GÖREV: docs/test-tasks/worker1-user-dashboard.md
Özet: USER dashboard (8 widget, 4-5h)
Başla: "sen workersin, oku: docs/test-tasks/worker1-user-dashboard.md, BAŞLA!"

════ W2 ════
📋 W2 GÖREV: docs/test-tasks/worker2-hr-dashboard.md
Özet: HR dashboard (9 widget, 5-6h)
Başla: "sen workersin, oku: docs/test-tasks/worker2-hr-dashboard.md, BAŞLA!"

════ W3 ════
📋 W3 GÖREV: docs/test-tasks/worker3-manager-dashboard.md
Özet: MANAGER dashboard (8 widget, 5-6h)
Başla: "sen workersin, oku: docs/test-tasks/worker3-manager-dashboard.md, BAŞLA!"

════ W4 ════
📋 W4 GÖREV: docs/test-tasks/worker4-admin-dashboard.md
Özet: ADMIN dashboard (9 widget, 5-6h)
Başla: "sen workersin, oku: docs/test-tasks/worker4-admin-dashboard.md, BAŞLA!"

════ W5 ════
📋 W5 GÖREV: docs/test-tasks/worker5-super-admin-dashboard.md
Özet: SUPER_ADMIN dashboard (9 widget, 6-7h)
Başla: "sen workersin, oku: docs/test-tasks/worker5-super-admin-dashboard.md, BAŞLA!"
```

**User'ın Yapacağı:**
1. W1'in kısmını kopyala
2. W1 terminaline yapıştır
3. W2'nin kısmını kopyala
4. W2 terminaline yapıştır
5. ... (5 worker için tekrar)

---

### Worker Terminal'de (Rapor Bildirimi):

**Worker Bitirdiğinde Yazacağı:**
```
Copy-paste for User (Mod'a götür):

════ W1 BİTTİ ════
✅ TAMAMLANDI
Rapor: docs/reports/worker1-user-dashboard-verification.md
Özet: 8 widget, 7 commit, %100 real data, API test PASS
────────────────
MOD'A GÖTÜR:
"W1 bitti, rapor: docs/reports/worker1-user-dashboard-verification.md"
════════════════
```

**User'ın Yapacağı:**
1. Worker terminalinden kopyala
2. Mod terminaline yapıştır
3. Mod verify eder

---

## 📋 TEMPLATE 6: Mod Quick Verification Commands

**Her Worker İçin Hazır Komutlar:**

### W1 Verification:
```bash
# Copy-paste to Mod terminal:

echo "════ W1 VERIFICATION ════"

# 1. Prisma count
sed -n '23,135p' backend/src/routes/dashboardRoutes.js | grep -c "await prisma\."

# 2. Mock count
sed -n '23,135p' backend/src/routes/dashboardRoutes.js | grep -ic "mock\|TODO"

# 3. Widget count
find frontend/components/dashboard/user -name "*.tsx" | wc -l

# 4. API test
TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"test-user@test-org-1.com","password":"TestPass123!"}' | jq -r '.token')
curl -s http://localhost:8102/api/v1/dashboard/user -H "Authorization: Bearer $TOKEN" | jq '.data | keys | length'

# 5. Commit count
git log --oneline --grep="W1\|user.*dashboard" --since="6 hours ago" | wc -l

echo "════ Compare with W1 report! ════"
```

### W2 Verification:
```bash
echo "════ W2 VERIFICATION ════"

# Find HR endpoint range
HR_START=$(grep -n "router.get('/hr-specialist'" backend/src/routes/dashboardRoutes.js | cut -d: -f1)
NEXT=$(grep -n "router.get('/manager'\|router.get('/admin'" backend/src/routes/dashboardRoutes.js | head -1 | cut -d: -f1)

# 1. Prisma count (HR endpoint only!)
sed -n "${HR_START},$((NEXT - 1))p" backend/src/routes/dashboardRoutes.js | grep -c "await prisma\."

# 2. Mock count
sed -n "${HR_START},$((NEXT - 1))p" backend/src/routes/dashboardRoutes.js | grep -ic "mock"

# 3. Widget count
find frontend/components/dashboard/hr-specialist -name "*.tsx" | wc -l

# 4. API test
TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"test-hr_specialist@test-org-1.com","password":"TestPass123!"}' | jq -r '.token')
curl -s http://localhost:8102/api/v1/dashboard/hr-specialist -H "Authorization: Bearer $TOKEN" | jq '.success'

# 5. Commits
git log --oneline --grep="W2\|hr.*dashboard" --since="6 hours ago" | wc -l

echo "════ Compare with W2 report! ════"
```

### W3-W5: Similar pattern...

---

## 📋 TEMPLATE 7: Bulk Worker Status Check

**Mod'un Tüm Worker'ları Kontrol Etmesi:**

```bash
# Copy-paste to Mod terminal:

echo "════════════════════════════════════"
echo "📊 WORKER STATUS CHECK"
echo "════════════════════════════════════"

for w in w1 w2 w3 w4 w5; do
  echo ""
  echo "─── $w ───"

  # Latest report
  latest=$(ls -t docs/reports/${w}-* 2>/dev/null | head -1)

  if [ -n "$latest" ]; then
    echo "📄 Latest: $latest"
    echo "📅 Modified: $(stat -c %y "$latest" | cut -d. -f1)"

    # Check if completed
    if grep -q "Status.*COMPLETE\|Overall.*SUCCESS" "$latest" 2>/dev/null; then
      echo "✅ Status: COMPLETED"
    else
      echo "⏳ Status: IN PROGRESS"
    fi
  else
    echo "❌ No report yet"
  fi
done

echo ""
echo "════════════════════════════════════"
```

**Output Örneği:**
```
════════════════════════════════════════════
📊 WORKER STATUS CHECK
════════════════════════════════════════════

─── w1 ───
📄 Latest: docs/reports/w1-user-dashboard-verification.md
📅 Modified: 2025-11-04 10:30:15
✅ Status: COMPLETED

─── w2 ───
📄 Latest: docs/reports/w2-hr-dashboard-verification.md
📅 Modified: 2025-11-04 10:18:42
⏳ Status: IN PROGRESS

─── w3 ───
❌ No report yet

─── w4 ───
📄 Latest: docs/reports/w4-admin-dashboard-verification.md
📅 Modified: 2025-11-04 10:28:03
✅ Status: COMPLETED

─── w5 ───
📄 Latest: docs/reports/w5-super-admin-dashboard-verification.md
📅 Modified: 2025-11-04 10:32:11
✅ Status: COMPLETED

════════════════════════════════════════════
```

---

## 🎯 User Workflow (Simplified)

### Görev Dağıtımı:
1. Mod terminal'de bekle
2. Mod hazır olduğunda TEMPLATE 1 üretecek (5 worker için)
3. Sen kopyala-yapıştır (her worker terminaline)

### Rapor Toplama:
1. Worker terminal'lerde bekle
2. Worker bitirince TEMPLATE 2 yazacak
3. Sen kopyala-yapıştır (mod terminaline)

### Verification:
1. Mod TEMPLATE 6 kullanır (hazır komutlar)
2. Mod TEMPLATE 5 ile sonuç verir
3. Sen okursun

---

## 📝 AsanMod'a Eklenecek Bölüm

**MOD-PLAYBOOK.md:**
```markdown
## Communication Templates

Görev dağıtırken TEMPLATE 1 kullan:
- Dosya yolu ver
- Kısa özet ver
- "sen workersin, oku: [file]" format

Verification sonucu TEMPLATE 5 kullan:
- 5/5 test sonucu
- ACCEPT/REJECT karar
```

**WORKER-PLAYBOOK.md:**
```markdown
## Rapor Bildirimi

Bitirdiğinde TEMPLATE 2 kullan:
- Rapor dosya yolu
- Kısa özet (1-2 satır)
- "MOD'A GÖTÜR: oku: [file]" format
```

---

**Created by:** Mod Claude
**Purpose:** User'ın işini kolaylaştır (copy-paste courier!)
