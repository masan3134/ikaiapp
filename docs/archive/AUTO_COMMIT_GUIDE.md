# 🚀 IKAI Auto Commit & Push Sistemi

Proje değişikliklerini otomatik olarak hem yerel hem de uzak depoya commit eden sistem.

## ✅ Kurulum Tamamlandı

Aşağıdaki özellikler aktif:

### 1. 📝 Post-Commit Hook
Her commit sonrası otomatik olarak GitHub'a push yapılır.

### 2. 🛠️ Manuel Script
Terminal'den kullanım:
```bash
# Otomatik commit mesajı ile
./scripts/auto-commit.sh

# Özel commit mesajı ile
./scripts/auto-commit.sh "feat: New feature added"
```

### 3. ⌨️ VS Code Keyboard Shortcuts

| Kısayol | Açıklama |
|---------|----------|
| **Ctrl+Shift+S** | Hızlı kaydet (otomatik commit mesajı) |
| **Ctrl+Shift+G** | Commit & Push (manuel mesaj gir) |

## 📖 Kullanım

### Yöntem 1: Normal Git Workflow (Otomatik Push)
```bash
git add .
git commit -m "Your message"
# 🚀 Otomatik push yapılır!
```

### Yöntem 2: Script ile
```bash
./scripts/auto-commit.sh "Update: Database schema"
```

### Yöntem 3: VS Code Task
- **Ctrl+Shift+P** → "Tasks: Run Task"
- "⚡ Git: Quick Save" seç

### Yöntem 4: Keyboard Shortcut
- **Ctrl+Shift+S** → Anında commit & push

## 🔧 Sistem Detayları

### Post-Commit Hook
**Dosya:** `.git/hooks/post-commit`

Her commit sonrası otomatik çalışır:
1. Değişiklikleri commit eder
2. `origin/main` branch'ine push eder
3. Hata durumunda bildirim verir

### Auto-Commit Script
**Dosya:** `scripts/auto-commit.sh`

Özellikleri:
- Değişiklik yoksa çalışmaz
- Renkli terminal çıktısı
- Hata yönetimi
- Timestamp ile otomatik mesaj

### VS Code Tasks
**Dosya:** `.vscode/tasks.json`

İki task mevcut:
1. **Quick Save:** Otomatik mesaj
2. **Commit & Push:** Manuel mesaj

## ⚙️ Yapılandırma

### Git Remote
```bash
# Mevcut remote'u göster
git remote -v

# Remote değiştir (gerekirse)
git remote set-url origin <new-url>
```

### Git Config
```bash
# Kullanıcı bilgileri
git config user.name "IKAI Development"
git config user.email "info@gaiai.ai"

# Branch default
git config --global init.defaultBranch main
```

## 🚨 Önemli Notlar

### Auto-Push Devre Dışı Bırakma
Eğer otomatik push istemiyorsan:
```bash
# Hook'u devre dışı bırak
chmod -x .git/hooks/post-commit

# Hook'u geri aktif et
chmod +x .git/hooks/post-commit
```

### Conflict Yönetimi
Auto-push conflict'e düşerse:
```bash
# Pull yapıp yeniden push et
git pull origin main --rebase
git push origin main
```

### Büyük Dosyalar
`.gitignore` dosyası otomatik olarak şunları hariç tutar:
- `node_modules/`
- `_archive/`
- `.env` dosyaları (`.env.local` hariç)
- Build klasörleri
- Log dosyaları

## 📊 Commit Mesaj Formatı

**Otomatik mesaj:** `Auto-commit: 2025-11-03 15:30:45`

**Önerilen manuel formatlar:**
```bash
# Feature
./scripts/auto-commit.sh "feat: Add new user dashboard"

# Fix
./scripts/auto-commit.sh "fix: Resolve login bug"

# Update
./scripts/auto-commit.sh "update: Improve performance"

# Docs
./scripts/auto-commit.sh "docs: Update README"

# Refactor
./scripts/auto-commit.sh "refactor: Clean up API routes"
```

## 🔐 GitHub Authentication

### HTTPS ile (Şu anki)
GitHub Personal Access Token kullanıyor.

Token yoksa:
1. GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. `repo` permission ver
4. Token'ı kullan

### SSH ile (Önerilen)
```bash
# SSH key oluştur
ssh-keygen -t ed25519 -C "info@gaiai.ai"

# SSH key'i GitHub'a ekle
cat ~/.ssh/id_ed25519.pub

# Remote'u SSH'a çevir
git remote set-url origin git@github.com:masan3134/ikaiapp.git
```

## 📈 İstatistikler

Auto-commit sistemi ile:
- ✅ Her değişiklik güvenli
- ✅ Otomatik yedekleme
- ✅ Hızlı deployment
- ✅ Takım çalışması kolaylaşır

---

**Son Güncellenme:** 2025-11-03
**Sistem Durumu:** ✅ Aktif
**Remote:** https://github.com/masan3134/ikaiapp.git
**Branch:** main
