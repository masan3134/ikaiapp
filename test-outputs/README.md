# 📊 Test Outputs

**Bu klasör:** Worker test scriptlerinin çıktıları

**NOT:** Bu klasör git'e commit edilmez (.gitignore'da)

---

## 📁 Bu Klasörde Ne Var?

**Worker test sonuçları:**
```
test-outputs/
├── w1-super-admin-output.txt
├── w2-notification-output.txt
├── w3-ui-rbac-output.txt
├── w4-ai-chat-output.txt
├── w1-performance-results.json
└── cleanup-log.txt
```

---

## 🎯 Nasıl Kullanılır?

### Test Çalıştır ve Kaydet
```bash
python3 scripts/tests/w1-my-test.py > test-outputs/w1-output.txt
```

### Çıktıyı İncele
```bash
cat test-outputs/w1-output.txt
```

### Çıktıyı Raporda Kullan
```markdown
**Output:**
\`\`\`
[Paste content from test-outputs/w1-output.txt]
\`\`\`
```

---

## 🧹 Cleanup

**Eski çıktıları sil:**
```bash
rm test-outputs/*.txt
rm test-outputs/*.json
```

**Veya hepsini sil:**
```bash
rm -rf test-outputs/*
```

**NOTE:** README.md kalır (.gitkeep gibi)

---

**⚠️ Bu klasördeki dosyalar GIT'e commit edilmez!**
**📝 Outputs geçici - sadece test sırasında kullan, sonra raporda RAW paste yap**
