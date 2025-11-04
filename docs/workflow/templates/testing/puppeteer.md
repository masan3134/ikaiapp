# 🎭 Template: Puppeteer Browser Test

**Use case:** Automated browser testing (login, count, verify)
**Duration:** 30 minutes
**Difficulty:** Medium

---

## Step 1: Setup Script

**File:** `scripts/tests/w{N}-{feature}-test.py`

```python
#!/usr/bin/env python3
"""
W{N}: {Feature} Test
"""

import requests
from bs4 import BeautifulSoup

BASE = 'http://localhost:8102'
FRONTEND = 'http://localhost:8103'

print('=' * 60)
print('W{N}: {FEATURE} TEST')
print('=' * 60)

# Login
r = requests.post(f'{BASE}/api/v1/auth/login',
                  json={'email': '{email}', 'password': 'TestPass123!'})
token = r.json()['token']

print(f'✅ Login OK - Token: {token[:20]}...')

# Test your feature here
```

---

## Step 2: Add Test Logic

**Example: Count sidebar items**
```python
# Fetch page
r = requests.get(f'{FRONTEND}/dashboard',
                 cookies={'auth_token': token})

# Parse HTML (if SSR)
soup = BeautifulSoup(r.text, 'html.parser')
sidebar_items = soup.find_all('nav-item')  # Adjust selector

print(f'Sidebar items: {len(sidebar_items)}')
```

**Or read code:**
```python
# Alternative: Code analysis
with open('frontend/app/(authenticated)/layout.tsx', 'r') as f:
    content = f.read()
    # Count conditional renders
    user_items = content.count('user?.role === "USER"')
    print(f'USER role checks: {user_items}')
```

---

## Step 3: Run Test

```bash
python3 scripts/tests/w{N}-{feature}-test.py
```

**Check output:**
```
✅ Login OK
✅ Sidebar: 10 items (expected: 10)
✅ Test PASS
```

---

## Step 4: Create Report

**File:** `docs/reports/w{N}-{feature}-verification.md`

```markdown
# W{N}: {Feature} Verification

**Date:** 2025-11-04
**Test Role:** {ROLE}
**Expected:** {EXPECTED}
**Actual:** {ACTUAL}

## Test Output

\`\`\`
[Paste exact terminal output]
\`\`\`

## Result

✅ PASS - {ACTUAL} matches {EXPECTED}

## Verification Commands (for Mod)

\`\`\`bash
python3 scripts/tests/w{N}-{feature}-test.py
\`\`\`
```

**Commit:**
```bash
git add scripts/tests/w{N}-{feature}-test.py
git commit -m "test({feature}): Add {ROLE} test script"

git add docs/reports/w{N}-{feature}-verification.md
git commit -m "docs(w{N}): {Feature} verification report"
```

---

## Step 5: Report

**Format:**
```
✅ {Feature} test tamamlandı
Role: {ROLE}
Result: {ACTUAL}/{EXPECTED} ✅
Script: scripts/tests/w{N}-{feature}-test.py
```

---

## Verification (for Mod)

**Re-run script:**
```bash
python3 scripts/tests/w{N}-{feature}-test.py
```

**Compare outputs:**
```
Worker: 10 items
Mod: 10 items
→ ✅ MATCH
```
