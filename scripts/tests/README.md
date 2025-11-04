# 🧪 Worker Test Scripts

**Bu klasör:** Worker'ların yazdığı test scriptleri

**NOT:** Template'leri `scripts/templates/` klasöründen kopyala, buraya yapıştır, düzenle!

---

## 📋 Mevcut Test Scripts

*Şu an boş - Worker'lar test scriptlerini buraya yazacak*

**Örnek:**
```
scripts/tests/
├── w1-super-admin-cross-org-test.py
├── w2-notification-preferences-test.py
├── w3-ui-rbac-integration-test.py
└── w4-ai-chat-context-test.py
```

---

## 🚀 Nasıl Kullanılır?

### 1. Template Kopyala
```bash
cp scripts/templates/api-test-template.py scripts/tests/w1-my-test.py
```

### 2. Düzenle
```bash
nano scripts/tests/w1-my-test.py
```

### 3. Çalıştır
```bash
python3 scripts/tests/w1-my-test.py > test-outputs/w1-output.txt
```

---

## 📚 Documentation

**Full Guide:** [`docs/test-tasks/WORKER-SCRIPT-GUIDE.md`](../../docs/test-tasks/WORKER-SCRIPT-GUIDE.md)
**Templates:** [`scripts/templates/README.md`](../templates/README.md)
**Test Helper:** [`scripts/test-helper.py`](../test-helper.py)

---

**⚠️ Bu klasördeki scriptler GIT'e commit edilmeyebilir (optional)**
**📊 Outputs `test-outputs/` klasöründe (ignored by git)**
