# Streaming API - Detaylı Açıklama

**Tarih:** 2025-11-02
**Konu:** Gemini API Streaming vs Non-Streaming

---

## 📖 Streaming Nedir?

**Streaming**, API'den gelen yanıtın **parça parça** (chunk by chunk) alınmasıdır. Tüm yanıtı beklemek yerine, her küçük parça hazır olduğunda hemen işlenir.

---

## 🔄 Normal API Call (Non-Streaming)

### **Nasıl Çalışır:**

```
Client → Request → API
Client ← .......... ← API (waiting...)
Client ← .......... ← API (waiting...)
Client ← FULL JSON ← API (response complete!)
```

**Kod Örneği:**
```javascript
// Normal (Non-Streaming) - ŞU ANKİ SİSTEM
const response = await fetch('https://api.gemini.com/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt: '25 CV analiz et' })
});

const data = await response.json();
console.log(data); // Tüm JSON bir anda geliyor
```

**Timeline:**
```
0s    → Request gönderildi
1s    → Gemini düşünüyor...
5s    → Gemini düşünüyor...
10s   → Gemini düşünüyor...
20s   → Gemini düşünüyor...
30s   → ❌ Token limit aşıldı, JSON kesildi!
```

### **Sorunlar:**

1. **Token Limit Aşımı:**
   - maxOutputTokens = 8192
   - 25 CV analizi ~15,000 token gerektiriyor
   - Response 8192'de kesiliyor → JSON invalid!

2. **Timeout Risk:**
   - Uzun süre bekliyor
   - Network timeout (30s-60s)

3. **Kullanıcı Deneyimi:**
   - 30 saniye boş ekran
   - Progress yok
   - Başarısız mı anlayamıyor

---

## 🌊 Streaming API Call

### **Nasıl Çalışır:**

```
Client → Request → API
Client ← CHUNK 1  ← API (first candidate...)
Client ← CHUNK 2  ← API (second candidate...)
Client ← CHUNK 3  ← API (third candidate...)
...
Client ← CHUNK 25 ← API (done!)
```

**Kod Örneği:**
```javascript
// Streaming - ÖNERİLEN SİSTEM
const response = await fetch('https://api.gemini.com/generate', {
  method: 'POST',
  body: JSON.stringify({
    prompt: '25 CV analiz et',
    stream: true  // ← STREAMING ENABLE
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  console.log('Chunk received:', chunk);

  // Her chunk'ı hemen işle!
  processChunk(chunk);
}
```

**Timeline:**
```
0s    → Request gönderildi
2s    → ✅ CHUNK 1: Candidate 1 analizi geldi!
4s    → ✅ CHUNK 2: Candidate 2 analizi geldi!
6s    → ✅ CHUNK 3: Candidate 3 analizi geldi!
...
50s   → ✅ CHUNK 25: Tamamlandı!
```

### **Avantajlar:**

1. **Token Limit YOK:**
   - Her chunk ayrı işleniyor
   - Toplam 1M token bile gelebilir
   - maxOutputTokens sadece chunk size'ı sınırlıyor

2. **Hızlı Feedback:**
   - İlk sonuç 2 saniyede
   - Kullanıcı hemen görüyor
   - Progress bar update

3. **Hata Toleransı:**
   - Chunk 15'te hata olsa, ilk 14'ü kaydedilmiş
   - Partial success mümkün

4. **Memory Efficient:**
   - Tüm response bellekte tutulmuyor
   - Her chunk işlenip garbage collect

---

## 🔧 Teknik Detaylar

### **Gemini API Streaming Format:**

**Request:**
```json
{
  "contents": [{ "parts": [{ "text": "..." }] }],
  "generationConfig": {
    "temperature": 0.4,
    "maxOutputTokens": 8192
  },
  "stream": true
}
```

**Response (SSE - Server-Sent Events):**
```
data: {"candidates":[{"content":{"parts":[{"text":"Candidate 1 analysis..."}]}}]}

data: {"candidates":[{"content":{"parts":[{"text":"Candidate 2 analysis..."}]}}]}

data: {"candidates":[{"content":{"parts":[{"text":"Candidate 3 analysis..."}]}}]}

data: [DONE]
```

### **Node.js Implementation:**

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

async function streamAnalysis(prompt) {
  const result = await model.generateContentStream(prompt);

  let fullResponse = '';

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullResponse += chunkText;

    console.log('Chunk:', chunkText);

    // Real-time processing
    emitToClient(chunkText);
  }

  return fullResponse;
}
```

### **Frontend (React) Implementation:**

```typescript
async function startAnalysisWithStreaming(analysisId: string) {
  const response = await fetch(`/api/v1/analyses/${analysisId}/stream`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Parse JSON chunks
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));

        // Update UI in real-time
        updateAnalysisResult(data);
      }
    }
  }
}
```

---

## 📊 Karşılaştırma Tablosu

| Özellik | Normal API | Streaming API |
|---------|-----------|---------------|
| **Token Limit** | 8,192 (hard limit) | Unlimited (per chunk 8K) |
| **İlk Sonuç** | 30 saniye | 2-3 saniye |
| **Son Sonuç** | 30 saniye | 50 saniye (ama görünür) |
| **Memory** | Tüm response RAM'de | Chunk by chunk |
| **Hata Durumu** | Tüm data kaybolur | Partial data kaydedilir |
| **UX** | Boş ekran 30s | Progress bar + sonuçlar |
| **Complexity** | Basit | Orta (async handling) |
| **Retry Logic** | Tüm request tekrar | Sadece failed chunk |

---

## 🎯 IKAI HR Platform İçin Önerilen Mimari

### **Backend (Node.js):**

```javascript
// routes/analysisRoutes.js
router.get('/analyses/:id/stream',
  authenticateToken,
  streamAnalysisResults
);

// controllers/analysisController.js
async function streamAnalysisResults(req, res) {
  const { id } = req.params;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const analysis = await getAnalysis(id);
    const candidates = await getCandidates(analysis.candidateIds);

    // Stream each candidate analysis
    for (const candidate of candidates) {
      const result = await analyzeCandidateStream(candidate, analysis.jobPosting);

      // Send chunk to client
      res.write(`data: ${JSON.stringify(result)}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: {"error": "${error.message}"}\n\n`);
    res.end();
  }
}
```

### **Frontend (React):**

```typescript
// components/AnalysisStreamViewer.tsx
function AnalysisStreamViewer({ analysisId }: { analysisId: string }) {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(25);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/v1/analyses/${analysisId}/stream?token=${getToken()}`
    );

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        eventSource.close();
        return;
      }

      const result = JSON.parse(event.data);

      setResults(prev => [...prev, result]);
      setProgress(prev => prev + 1);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [analysisId]);

  return (
    <div>
      <ProgressBar value={progress} max={total} />
      {results.map(result => (
        <AnalysisCard key={result.candidateId} data={result} />
      ))}
    </div>
  );
}
```

---

## 🚀 İmplementasyon Adımları

### **Phase 1: Backend Streaming (3-4 saat)**

1. ✅ Gemini SDK'yı `generateContentStream` kullanacak şekilde değiştir
2. ✅ SSE endpoint oluştur (`/analyses/:id/stream`)
3. ✅ Database'e her chunk'ı kaydet (partial results)
4. ✅ Error handling (chunk fail → skip, continue)

### **Phase 2: Frontend Integration (2-3 saat)**

1. ✅ EventSource veya fetch + ReadableStream kullan
2. ✅ Real-time UI update (results array'e append)
3. ✅ Progress bar (completed / total)
4. ✅ Error handling (reconnect logic)

### **Phase 3: Testing (1 saat)**

1. ✅ 1 CV test
2. ✅ 10 CV test
3. ✅ 25 CV test
4. ✅ 50 CV test
5. ✅ Network drop test (reconnect)

---

## 💡 Alternatif: Quick Fix (Şimdi Yapabiliriz)

**Streaming implement etmeden önce:**

### **Option A: Batch Size Reduction**
```javascript
// geminiDirectService.js
const MAX_BATCH_SIZE = 10; // 25 → 10

// 25 CV → 3 batch:
// Batch 1: CV 1-10
// Batch 2: CV 11-20
// Batch 3: CV 21-25
```

**Avantaj:** 5 dakikada uygulanır
**Dezavantaj:** Streaming kadar iyi değil

### **Option B: Token Limit Increase**
```javascript
// geminiDirectService.js
maxOutputTokens: 16384 // 8192 → 16K
```

**Avantaj:** 1 dakikada uygulanır
**Dezavantaj:** Yine de limit var, 40 CV'de patlar

---

## 🎯 Final Recommendation

**SHORT TERM (Bugün):**
- Batch size 10'a düşür
- maxOutputTokens 16K'ya çık

**LONG TERM (Bu hafta):**
- Streaming implement et
- Batch size 15-20'ye çık
- maxOutputTokens 8K'da kal (streaming ile gerek yok)

---

## 📚 Kaynaklar

- [Gemini API Streaming Docs](https://ai.google.dev/gemini-api/docs/text-generation?lang=node#generate-a-text-stream)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Fetch Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)

---

**Sonuç:** Streaming = Netflix'teki progress bar gibi. Video hemen başlıyor, arka planda indirmeye devam ediyor. Aynı mantık! 🎬
