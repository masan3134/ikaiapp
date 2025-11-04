# 🚀 AsanMod v16.0 - Quick Start

**5 dakikada sisteme gir, çalışmaya başla!**

---

## 📖 Adım 1: Core'u Oku (2 dakika)

```bash
Read: docs/workflow/ASANMOD-CORE.md
```

**Öğreneceklerin:**
- 5 temel kural
- Template sistemi
- Communication format

---

## 🎭 Adım 2: Rolünü Seç (1 dakika)

### Sen MOD'san:
```
Görevin:
- Task oluştur (template ref ver)
- Worker'ları koordine et
- Sonuçları verify et

Oku: Template README
(docs/workflow/templates/README.md)
```

### Sen WORKER'san:
```
Görevin:
- Task al
- Template takip et
- Kısa rapor ver

Oku: Template README
(docs/workflow/templates/README.md)
```

---

## 📋 Adım 3: Template'leri Gözden Geçir (2 dakika)

**12 template var:**

```
frontend/
- widget.md (widget ekle)
- protect.md (sayfa koru)

backend/
- api.md (endpoint ekle)

database/
- migration.md (kolon ekle)

testing/
- puppeteer.md (browser test)
- verify.md (mod verification)

maintenance/
- fix.md (bug fix)
```

**Hepsini ezberleme! Gerekince bak.**

---

## ✅ Adım 4: Çalışmaya Başla!

### MOD workflow:
```
1. Task belirle: "USER dashboard'a widget"
2. Template seç: widget.md
3. Worker'a ver: "W1: widget.md, Role: USER, Name: RecentActivity"
4. Worker bitirince verify et
```

### WORKER workflow:
```
1. Task al: "widget.md, Role: USER, Name: RecentActivity"
2. Template aç: docs/workflow/templates/frontend/widget.md
3. Adımları takip et
4. Rapor ver: "✅ RecentActivity done, Commit: abc123"
```

---

## 💬 Communication Format

**Task assignment (3 satır):**
```
W1: widget.md
Role: USER
Name: RecentActivity
```

**Task report (3 satır):**
```
✅ RecentActivity tamamlandı
Commit: abc123
Test: PASS
```

**Verification (2 satır):**
```
✅ Verified
Count: 5/5 ✅
```

---

## 🎯 İlk Göreviniz

### MOD için:
```
1. 5 worker'a basit görev ver
2. Template ref kullan (widget.md vs)
3. Raporları topla
4. Verify et
```

### WORKER için:
```
1. Task'ı oku
2. Template'i aç
3. Uygula
4. Kısa rapor ver
```

---

## 📚 Daha Fazla Bilgi?

**Detaylı bilgi (opsiyonel):**
- `docs/workflow/reference/MOD-PLAYBOOK.md` (eski detaylı)
- `docs/workflow/reference/WORKER-PLAYBOOK.md` (eski detaylı)
- `docs/workflow/reference/ASANMOD-METHODOLOGY.md` (theory)

**Ama zorunlu değil! Template'ler yeterli.**

---

## ✨ v16.0 Farkı

**Eski sistem:**
- 8,000 satır playbook
- 500 satır task
- 800 satır report
- 5 dakika copy-paste

**Yeni sistem (v16.0):**
- 100 satır core + templates
- 3 satır task
- 3 satır report
- 10 saniye copy-paste

**50x daha hızlı!** 🚀

---

**Hazırsın! Çalışmaya başla!** 💪
