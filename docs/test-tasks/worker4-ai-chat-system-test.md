# 🤖 Worker #4 - AI Chat System Test (Analysis Chat + Milvus)

**Task ID:** worker4-ai-chat-system-test
**Assigned To:** Worker #4
**Created By:** Master Claude (Mod)
**Date:** 2025-11-04
**Priority:** HIGH
**Estimated Time:** 60-75 minutes

---

## 🎯 Objective

Test the **AI Chat system** for CV analysis - verify Gemini AI integration, Milvus vector database, context management, and response quality.

**Core Components:**
- ✅ Gemini AI (gemini-2.0-flash-exp)
- ✅ Milvus Vector DB (semantic search)
- ✅ Context Management (40 base + 100 candidates + 8 semantic)
- ✅ Chat History (persistent storage)
- ✅ Analysis-specific chat (per CV analysis)

**Expected Outcome:** Full confidence that AI chat works correctly for end users.

---

## 📋 Background

### AI Chat Architecture

```
User Question
    ↓
Backend API (/api/v1/analysis-chat/:analysisId/chat)
    ↓
Context Builder
    ├─→ Analysis data (CV + job posting)
    ├─→ Recent messages (last 40)
    ├─→ All candidates (max 100)
    └─→ Milvus semantic search (8 relevant)
    ↓
Gemini AI (gemini-2.0-flash-exp)
    ↓
Response
    ↓
Save to DB + Return to User
```

### Context Limits
- **Base context:** Last 40 messages
- **All candidates:** Up to 100 candidates
- **Semantic search:** Top 8 relevant candidates (Milvus)
- **Total token limit:** ~30K tokens

### Milvus Collection
- **Name:** `analysis_chat_contexts`
- **Dimensions:** 768 (text-embedding-004)
- **Index:** IVF_FLAT
- **Metric:** COSINE similarity

---

## 🛠️ Phase 1: Environment & Dependencies Check (15 min)

### Task 1.1: Check Milvus Status

```bash
# Check Milvus container
docker ps --filter name=ikai-milvus

# Expected: Container running (Up X hours)

# Check Milvus health
curl -s http://localhost:8130/healthz

# Expected: {"status":"ok"} or similar
```

**Verification:**
- ✅ Milvus container running
- ✅ Port 8130 accessible
- ✅ Health check passes

---

### Task 1.2: Check Gemini API Configuration

```bash
# Check .env.local for Gemini key
grep "GEMINI_API_KEY" backend/.env.local

# Expected: GEMINI_API_KEY=AIzaSy...

# Test Gemini API directly
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello, are you working?"}]}]}' | jq

# Expected: Response with "candidates" array
```

**Verification:**
- ✅ Gemini API key exists
- ✅ API responds to test request
- ✅ No rate limit errors

---

### Task 1.3: Check Analysis Chat Routes

```bash
# Check if routes are registered
grep -r "analysis-chat" backend/src/routes/

# Expected: analysisChatRoutes.js found

# Check route file content
cat backend/src/routes/analysisChatRoutes.js
```

**Verification:**
- ✅ Routes file exists
- ✅ POST /analysis-chat/:analysisId/chat endpoint defined
- ✅ GET /analysis-chat/:analysisId/history endpoint defined

---

## 🧪 Phase 2: Basic Chat Functionality (20 min)

### Task 2.1: Create Test Analysis

**Prerequisites:** Need an existing analysis with CV

**Option A: Use existing analysis**
```python
python3 -i scripts/test-helper.py

helper = IKAITestHelper()
helper.login('test-hr_specialist@test-org-1.com', 'TestPass123!')

# Get existing analyses
analyses = helper.get('/api/v1/analyses')
print(f'Found {len(analyses)} analyses')

# Pick first one
if len(analyses) > 0:
    analysis_id = analyses[0]['id']
    print(f'Using analysis: {analysis_id}')
else:
    print('No analyses found! Need to create one.')
```

**Option B: Create new analysis**
```python
# Upload CV for analysis
import requests

cv_path = 'test-data/cvs/org1-junior-frontend-developer/cv-01-high-match.txt'

# Get job posting ID first
job_postings = helper.get('/api/v1/job-postings')
job_id = job_postings[0]['id']

# Upload CV
with open(cv_path, 'rb') as f:
    files = {'file': ('cv-01-high-match.txt', f, 'text/plain')}
    data = {'jobPostingId': job_id}

    response = requests.post(
        'http://localhost:8102/api/v1/analyses',
        headers={'Authorization': f'Bearer {helper.token}'},
        files=files,
        data=data
    )

    analysis = response.json()
    analysis_id = analysis['id']
    print(f'Created analysis: {analysis_id}')

# Wait for analysis to complete
import time
time.sleep(60)  # Wait 60 seconds for AI analysis

# Check status
analysis = helper.get(f'/api/v1/analyses/{analysis_id}')
print(f'Status: {analysis["status"]}')  # Should be COMPLETED
```

---

### Task 2.2: Send First Chat Message

```python
# Send first question
chat_request = {
    "message": "Bu adayın en güçlü yönleri neler?"
}

response = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    chat_request
)

print('=== AI Response ===')
print(response['response'])
print(f'\nResponse time: {response.get("responseTime", "N/A")}ms')
```

**Expected Output:**
```
{
  "id": "chat-message-uuid",
  "analysisId": "analysis-uuid",
  "message": "Bu adayın en güçlü yönleri neler?",
  "response": "AHMET YILMAZ'ın en güçlü yönleri:\n\n1. **Teknik Yetkinlik**: 2 yıl React, TypeScript ve Next.js deneyimi...",
  "responseTime": 2500,
  "createdAt": "2025-11-04T..."
}
```

**Verification:**
- ✅ Response received (no 500 error)
- ✅ Response is in Turkish
- ✅ Response is relevant to CV content
- ✅ Response time < 5000ms (5 seconds)

---

### Task 2.3: Test Multiple Questions (Conversation)

```python
# Question 2
q2 = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "TypeScript deneyimi ne kadar?"}
)
print('Q2:', q2['response'][:100], '...')

# Question 3
q3 = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "Hangi şirketlerde çalışmış?"}
)
print('Q3:', q3['response'][:100], '...')

# Question 4 (follow-up)
q4 = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "Bu şirketlerde ne kadar süre çalışmış?"}
)
print('Q4:', q4['response'][:100], '...')
```

**Verification:**
- ✅ AI remembers previous questions (context works)
- ✅ Follow-up questions get contextual answers
- ✅ No duplicate responses

---

### Task 2.4: Get Chat History

```python
# Get all chat history for this analysis
history = helper.get(f'/api/v1/analysis-chat/{analysis_id}/history')

print(f'\n=== Chat History ===')
print(f'Total messages: {len(history)}')

for msg in history:
    print(f'\nUser: {msg["message"]}')
    print(f'AI: {msg["response"][:80]}...')
    print(f'Time: {msg["createdAt"]}')
```

**Expected:**
- ✅ All 4 questions in history
- ✅ Chronological order (oldest first)
- ✅ Each message has user + AI response

---

## 🔍 Phase 3: Advanced Features Test (25 min)

### Task 3.1: Test Comparison Questions

```python
# Upload another CV (for comparison)
cv_path_2 = 'test-data/cvs/org1-junior-frontend-developer/cv-02-good-match.txt'

with open(cv_path_2, 'rb') as f:
    files = {'file': ('cv-02-good-match.txt', f, 'text/plain')}
    data = {'jobPostingId': job_id}

    response = requests.post(
        'http://localhost:8102/api/v1/analyses',
        headers={'Authorization': f'Bearer {helper.token}'},
        files=files,
        data=data
    )

# Wait for completion
time.sleep(60)

# Now ask comparison question in first chat
comparison = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "Bu adayı diğer adaylarla karşılaştır. En iyi 3 aday kimler?"}
)

print('=== Comparison Response ===')
print(comparison['response'])
```

**Verification:**
- ✅ AI can access other candidates (context includes all candidates)
- ✅ Comparison is meaningful
- ✅ Mentions multiple candidates

---

### Task 3.2: Test Context Limits (40 Messages)

```python
# Send 45 messages (over the 40 limit)
print('\n=== Testing 40 Message Context Limit ===')

for i in range(45):
    msg = helper.post(
        f'/api/v1/analysis-chat/{analysis_id}/chat',
        {"message": f"Test message {i+1}: What is the candidate's name?"}
    )
    print(f'Message {i+1} sent')
    time.sleep(1)  # Avoid rate limiting

# Check if AI still remembers early messages
test_memory = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "İlk sorumda ne sormuştum?"}
)

print('\n=== Memory Test ===')
print('Response:', test_memory['response'])
```

**Expected:**
- ✅ All 45 messages sent successfully
- ✅ AI may NOT remember the very first question (context window = 40)
- ✅ Recent messages (last 40) are remembered

---

### Task 3.3: Test Milvus Semantic Search

**Check if Milvus collection exists:**

```bash
# List Milvus collections
docker exec ikai-milvus curl -X GET "http://localhost:19530/api/v1/collections" || echo "Milvus API not accessible via curl"
```

**Test semantic search via chat:**

```python
# Ask a question that requires semantic search
semantic_test = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "React deneyimi olan diğer adaylar kimler?"}
)

print('\n=== Semantic Search Test ===')
print(semantic_test['response'])
```

**Verification:**
- ✅ Response mentions multiple candidates with React experience
- ✅ Semantic search finds relevant candidates (not just keyword match)

---

### Task 3.4: Test Error Handling

**Test 1: Invalid Analysis ID**
```python
try:
    invalid = helper.post(
        '/api/v1/analysis-chat/invalid-uuid/chat',
        {"message": "Test"}
    )
except Exception as e:
    print(f'✅ Error handled correctly: {e}')
```

**Test 2: Empty Message**
```python
try:
    empty = helper.post(
        f'/api/v1/analysis-chat/{analysis_id}/chat',
        {"message": ""}
    )
except Exception as e:
    print(f'✅ Empty message rejected: {e}')
```

**Test 3: Very Long Message (>10K chars)**
```python
long_msg = "Test " * 3000  # ~15K chars

try:
    long = helper.post(
        f'/api/v1/analysis-chat/{analysis_id}/chat',
        {"message": long_msg}
    )
    print(f'Long message accepted (may timeout)')
except Exception as e:
    print(f'Long message rejected: {e}')
```

**Expected:**
- ✅ Invalid ID → 404 or 400 error
- ✅ Empty message → 400 error
- ✅ Long message → Either accepted or 400 error (payload too large)

---

## 📊 Phase 4: Performance & Quality Test (15 min)

### Task 4.1: Response Time Test

```python
import time

# Test 10 questions and measure response time
response_times = []

questions = [
    "Adayın en güçlü yönleri neler?",
    "TypeScript deneyimi var mı?",
    "Hangi projelerde çalışmış?",
    "Eğitim durumu nedir?",
    "Sertifikaları neler?",
    "İngilizce seviyesi nedir?",
    "Neden bu pozisyon için uygun?",
    "Maaş beklentisi nedir?",
    "Ne zaman başlayabilir?",
    "Referansları var mı?"
]

for q in questions:
    start = time.time()
    resp = helper.post(
        f'/api/v1/analysis-chat/{analysis_id}/chat',
        {"message": q}
    )
    end = time.time()

    response_time = (end - start) * 1000  # Convert to ms
    response_times.append(response_time)
    print(f'{q[:30]}... → {response_time:.0f}ms')

# Calculate stats
avg_time = sum(response_times) / len(response_times)
max_time = max(response_times)
min_time = min(response_times)

print(f'\n=== Response Time Stats ===')
print(f'Average: {avg_time:.0f}ms')
print(f'Min: {min_time:.0f}ms')
print(f'Max: {max_time:.0f}ms')
```

**Expected:**
- ✅ Average response time: 2000-4000ms
- ✅ Max response time: < 8000ms
- ✅ No timeouts

---

### Task 4.2: Response Quality Test

**Manually review 5 responses:**

```python
quality_questions = [
    "Bu adayın güçlü yönleri neler?",
    "Zayıf yönleri neler?",
    "Bu pozisyon için uygun mu?",
    "Mülakat için hangi soruları soralım?",
    "Maaş önerimiz ne olmalı?"
]

print('\n=== Response Quality Test ===')
for q in quality_questions:
    resp = helper.post(
        f'/api/v1/analysis-chat/{analysis_id}/chat',
        {"message": q}
    )
    print(f'\n--- {q} ---')
    print(resp['response'])
    print('\n[Manual Review: Is this response helpful? Y/N]')
```

**Manual Checklist:**
- [ ] Responses are in Turkish
- [ ] Responses are relevant to CV content
- [ ] Responses are detailed (not generic)
- [ ] Responses use bullet points / structure
- [ ] No hallucinations (fake information)

---

### Task 4.3: Context Management Test

**Verify context includes:**

```python
# Ask about context awareness
context_test = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "Şu ana kadar kaç soru sordum?"}
)

print('\n=== Context Awareness ===')
print(context_test['response'])

# Ask to summarize conversation
summary_test = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "Bu sohbette hangi konuları konuştuk?"}
)

print('\n=== Conversation Summary ===')
print(summary_test['response'])
```

**Expected:**
- ✅ AI can count previous messages (approx.)
- ✅ AI can summarize conversation topics
- ✅ Context is maintained

---

## 🔧 Phase 5: Milvus Vector DB Verification (10 min)

### Task 5.1: Check Milvus Collection

```bash
# Check if Milvus has the analysis_chat_contexts collection
docker logs ikai-backend --tail 100 | grep -i "milvus\|vector"

# Look for messages like:
# "Milvus collection created: analysis_chat_contexts"
# "Vector stored in Milvus"
```

---

### Task 5.2: Database Chat History Check

```bash
# Check if chat messages are stored in PostgreSQL
docker exec ikai-backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const chatCount = await prisma.analysisChatMessage.count();
  console.log('Total chat messages in DB:', chatCount);

  const recentChats = await prisma.analysisChatMessage.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      message: true,
      response: true,
      createdAt: true
    }
  });

  console.log('\\nRecent chats:');
  recentChats.forEach(chat => {
    console.log('User:', chat.message.substring(0, 50));
    console.log('AI:', chat.response.substring(0, 80));
    console.log('---');
  });

  await prisma.\$disconnect();
})()
"
```

**Expected:**
- ✅ Chat messages stored in database
- ✅ Count matches number of messages sent
- ✅ Recent chats visible

---

## ✅ Verification Checklist

### Phase 1: Environment
- [ ] Milvus container running
- [ ] Milvus health check passes
- [ ] Gemini API key configured
- [ ] Gemini API responds to test
- [ ] Analysis chat routes exist

### Phase 2: Basic Chat
- [ ] Analysis created successfully
- [ ] First chat message works
- [ ] Response is relevant and in Turkish
- [ ] Response time < 5 seconds
- [ ] Multiple questions work (conversation)
- [ ] Chat history retrieval works

### Phase 3: Advanced Features
- [ ] Comparison questions work (multi-candidate context)
- [ ] 40+ messages sent successfully
- [ ] Context window works (remembers last 40)
- [ ] Semantic search works (Milvus)
- [ ] Error handling works (invalid ID, empty message)

### Phase 4: Performance & Quality
- [ ] Average response time: 2-4 seconds
- [ ] Max response time < 8 seconds
- [ ] Responses are helpful and accurate
- [ ] No hallucinations
- [ ] Context awareness works

### Phase 5: Infrastructure
- [ ] Milvus collection exists
- [ ] Chat messages stored in PostgreSQL
- [ ] Vector embeddings stored in Milvus

---

## 📊 Success Criteria

### Critical (Must Pass)
- ✅ **Chat responses work** (no 500 errors)
- ✅ **Responses are relevant** (match CV content)
- ✅ **Context maintained** (follow-up questions work)
- ✅ **Response time acceptable** (< 5 seconds avg)
- ✅ **Chat history persists** (stored in DB)
- ✅ **No hallucinations** (fake information)

### Optional (Nice to Have)
- ✅ Milvus semantic search functional
- ✅ 40 message context limit enforced
- ✅ Comparison queries work
- ✅ Error handling graceful

---

## 🚨 Common Issues & Fixes

### Issue 1: Chat returns 500 error

**Symptom:** POST /analysis-chat returns 500
**Debug:**
```bash
docker logs ikai-backend --tail 50 | grep -i error
```
**Likely Causes:**
- Gemini API key invalid
- Milvus connection failed
- Analysis not found

**Fix:** Check environment variables, restart backend

---

### Issue 2: Response is generic/unhelpful

**Symptom:** AI says "I don't have enough information"
**Likely Cause:** Analysis data not included in context
**Fix:** Check if analysis has completed (status: COMPLETED)

---

### Issue 3: Response time > 10 seconds

**Symptom:** Very slow responses
**Debug:**
```bash
docker logs ikai-backend | grep "Gemini API"
```
**Likely Causes:**
- Gemini API rate limiting
- Large context (100+ candidates)
- Network latency

**Fix:** Check Gemini quota, optimize context size

---

### Issue 4: Milvus connection failed

**Symptom:** Semantic search doesn't work
**Debug:**
```bash
docker logs ikai-milvus --tail 50
curl http://localhost:8130/healthz
```
**Fix:** Restart Milvus container

---

## 📝 Deliverables

### Required: Test Report

**Filename:** `docs/reports/worker1-ai-chat-system-test-report.md`

**Required Sections:**
1. **Executive Summary** (Pass/Fail overview)
2. **Environment Check** (Milvus, Gemini API status)
3. **Basic Chat Test** (10 Q&A examples with responses)
4. **Advanced Features** (comparison, context limits, semantic search)
5. **Performance Metrics** (response time stats, chart)
6. **Response Quality** (manual review of 5 responses)
7. **Infrastructure Verification** (Milvus collection, DB records)
8. **Issues Found** (if any)
9. **Recommendations** (improvements)

### Optional
- Response time chart (bar chart or line graph)
- Sample conversation (full transcript)
- Screenshots of chat UI (if tested in frontend)

---

## ⏱️ Estimated Time

**Total: 60-75 minutes**

- Phase 1 (Environment): 15 min
- Phase 2 (Basic Chat): 20 min
- Phase 3 (Advanced): 25 min
- Phase 4 (Performance): 15 min
- Phase 5 (Infrastructure): 10 min
- Report Writing: 20 min

---

## 🎯 AsanMod Rules

**STRICT_MODE Enabled:**
- ❌ NO simulation - Send REAL chat messages
- ❌ NO fake responses - Test ACTUAL AI responses
- ✅ RAW outputs - Paste full AI responses
- ✅ REAL performance - Measure actual response times

**After Each Phase:**
- ✅ Paste RAW terminal/Python outputs to report
- ✅ Note any errors/warnings
- ✅ Verify expected vs actual

**After Task:**
- ✅ Write comprehensive report with examples
- ✅ Include response time stats
- ✅ Manual quality review (is AI helpful?)
- ✅ Git commit report
- ✅ Report to Mod with summary

---

## 📚 Reference Documents

- **AI Chat Implementation:** [`docs/reports/2025-11-02-ai-chat-optimization-for-large-analysis.md`](../reports/2025-11-02-ai-chat-optimization-for-large-analysis.md)
- **Test Accounts:** [`docs/test-tasks/COMPLETE-TEST-DATA-REFERENCE.md`](COMPLETE-TEST-DATA-REFERENCE.md)
- **Python Test Helper:** [`scripts/test-helper.py`](../../scripts/test-helper.py)

---

## 🧪 Quick Test Script

**For rapid testing:**

```python
# Quick AI Chat Test
python3 -i scripts/test-helper.py

helper = IKAITestHelper()
helper.login('test-hr_specialist@test-org-1.com', 'TestPass123!')

# Get analysis
analyses = helper.get('/api/v1/analyses')
analysis_id = analyses[0]['id']

# Ask question
resp = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "Bu adayın güçlü yönleri neler?"}
)

print(resp['response'])
```

---

**🚀 START: Phase 1, Task 1.1 (Check Milvus Status)**

**IMPORTANT:** Test with REAL AI responses! Paste full outputs to report!
