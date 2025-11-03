# Chunking Implementation - Test Instructions

**Date:** 2025-11-02
**BATCH_SIZE:** 6 CVs per batch
**Status:** ✅ Implemented, Ready for Testing

---

## ✅ Implementation Complete

### **Modified Files:**
1. `backend/src/services/geminiDirectService.js`
   - Added BATCH_SIZE = 6 constant
   - Added BATCH_DELAY_MS = 2000 constant
   - Created `batchAnalyzeCVsWithChunking()` function (88 lines)
   - Exported new function

2. `backend/src/workers/analysisWorker.js`
   - Changed import: `batchAnalyzeCVs` → `batchAnalyzeCVsWithChunking`
   - Line 72: Updated function call

### **Backend Status:**
- ✅ Restarted at 18:53:53
- ✅ Worker running: "Analysis worker started (Direct Gemini mode)"
- ✅ No errors in logs

---

## 🧪 Manual Test Plan

### **TEST 1: Small Batch (3 CVs - 1 Batch)**

**Expected Behavior:**
- Should use direct batch (3 <= 6)
- Log: "📦 Direct batch: 3 CVs (within limit)"
- No chunking
- Completes in ~10-15 seconds

**Steps:**
1. Go to: http://localhost:8103/wizard
2. Select job posting: "Lojistik Bölge Müdürü"
3. Upload 3 CV files
4. Start analysis
5. Watch backend logs: `docker logs ikai-backend -f`

**Expected Logs:**
```
📦 Direct batch: 3 CVs (within limit)
🚀 Gemini Direct Batch: 3 CVs in 1 API call
✅ Gemini Direct Batch completed: 3 results
✅ Analysis {id} completed (3 CVs, Direct Gemini)
```

---

### **TEST 2: Medium Batch (15 CVs - 3 Batches)**

**Expected Behavior:**
- Should chunk: 3 batches (6+6+3)
- Log: "📦 Chunking enabled: 15 CVs → 3 batches"
- 2-second delay between batches
- Completes in ~40-50 seconds

**Steps:**
1. Go to: http://localhost:8103/wizard
2. Select job posting
3. Upload 15 CV files
4. Start analysis
5. Watch backend logs

**Expected Logs:**
```
📦 Chunking enabled: 15 CVs → 3 batches (6 per batch)
⏳ Processing batch 1/3 (6 CVs)...
✅ Batch 1/3 completed: 6 results
⏸️  Waiting 2000ms before next batch...
⏳ Processing batch 2/3 (6 CVs)...
✅ Batch 2/3 completed: 6 results
⏸️  Waiting 2000ms before next batch...
⏳ Processing batch 3/3 (3 CVs)...
✅ Batch 3/3 completed: 3 results
📊 Chunking summary: 15 successful, 0 failed (total 15)
✅ Analysis {id} completed (15 CVs, Direct Gemini)
```

---

### **TEST 3: Large Batch (25 CVs - 5 Batches)**

**Expected Behavior:**
- Should chunk: 5 batches (6+6+6+6+1)
- Log: "📦 Chunking enabled: 25 CVs → 5 batches"
- 2-second delays (4 delays total)
- Completes in ~70-80 seconds

**Steps:**
1. Go to: http://localhost:8103/wizard
2. Select job posting
3. Upload or select 25 CVs
4. Start analysis
5. Watch backend logs

**Expected Logs:**
```
📦 Chunking enabled: 25 CVs → 5 batches (6 per batch)
⏳ Processing batch 1/5 (6 CVs)...
✅ Batch 1/5 completed: 6 results
⏸️  Waiting 2000ms before next batch...
⏳ Processing batch 2/5 (6 CVs)...
✅ Batch 2/5 completed: 6 results
⏸️  Waiting 2000ms before next batch...
⏳ Processing batch 3/5 (6 CVs)...
✅ Batch 3/5 completed: 6 results
⏸️  Waiting 2000ms before next batch...
⏳ Processing batch 4/5 (6 CVs)...
✅ Batch 4/5 completed: 6 results
⏸️  Waiting 2000ms before next batch...
⏳ Processing batch 5/5 (1 CVs)...
✅ Batch 5/5 completed: 1 results
📊 Chunking summary: 25 successful, 0 failed (total 25)
✅ Analysis {id} completed (25 CVs, Direct Gemini)
```

---

## ✅ Verification Steps

### **After Each Test:**

1. **Check Analysis Status:**
```bash
docker exec ikai-postgres psql -U ikaiuser -d ikaidb -c \
  "SELECT id, status, \"createdAt\", \"completedAt\" FROM analyses ORDER BY \"createdAt\" DESC LIMIT 1;"
```

**Expected:** status = 'COMPLETED'

2. **Count Results:**
```bash
docker exec ikai-postgres psql -U ikaiuser -d ikaidb -c \
  "SELECT COUNT(*) FROM analysis_results WHERE \"analysisId\" = '{ANALYSIS_ID}';"
```

**Expected:** Count = Number of CVs

3. **Check for Errors:**
```bash
docker exec ikai-postgres psql -U ikaiuser -d ikaidb -c \
  "SELECT COUNT(*) FROM analysis_results WHERE \"matchLabel\" = 'Analiz Başarısız';"
```

**Expected:** 0 (no failures)

---

## 🔍 Performance Benchmarks

| Test | CVs | Batches | Expected Time | Actual Time |
|------|-----|---------|---------------|-------------|
| TEST 1 | 3 | 1 | 10-15s | ___ |
| TEST 2 | 15 | 3 | 40-50s | ___ |
| TEST 3 | 25 | 5 | 70-80s | ___ |

---

## 🚨 Error Scenarios to Test

### **Partial Failure Test:**

**Simulate:** Kill network mid-batch

**Expected:**
- Failed batch creates placeholder results
- Other batches continue processing
- Final summary shows: "X successful, Y failed"
- Analysis status: COMPLETED (with partial data)

---

## 📋 Success Criteria

- [ ] All 3 tests pass
- [ ] No JSON truncation errors
- [ ] All CVs have results in database
- [ ] Correct batch count in logs
- [ ] 2-second delays visible in logs
- [ ] Performance within expected range

---

**Ready for Testing!** Backend restarted, chunking active. 🚀
