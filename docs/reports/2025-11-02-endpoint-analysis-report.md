
# Proje API Endpoint Analiz Raporu

Bu rapor, projenin backend ve frontend kod tabanını analiz ederek tanımlanmış tüm API endpoint'lerini, bu endpoint'lerin frontend'de nasıl kullanıldığını ve olası eksiklikleri veya tutarsızlıkları detaylı bir şekilde listeler.

**Raporun Amacı:**

*   Tüm sistemin API haritasını çıkarmak.
*   Backend'de tanımlı olan ancak frontend'de kullanılmayan (atıl) endpoint'leri tespit etmek.
*   Frontend'de çağrılan ancak backend'de karşılığı olmayan (hatalı) çağrıları bulmak.
*   Yetkilendirme ve kullanım tutarlılığını kontrol etmek.

**Durum Göstergeleri:**

*   ✅ **Mevcut ve Kullanılıyor:** Endpoint hem backend'de tanımlı hem de frontend tarafından aktif olarak kullanılıyor.
*   ⚠️ **Kullanımda Değil:** Endpoint backend'de tanımlı ancak frontend servislerinde bu endpoint'e yönelik bir çağrı bulunamadı. (Bu durum, endpoint'in postman gibi araçlarla test için veya gelecekteki bir özellik için oluşturulmuş olabileceğini gösterir.)
*   ❌ **Eksik Endpoint:** Frontend'de bir çağrı yapılıyor ancak bu çağrının karşılığı olan bir endpoint backend'de tanımlı değil. (Bu durum bir hataya işaret eder.)

---

## 1. Kimlik Doğrulama (/api/v1/auth)

| Method | Endpoint | Backend Dosyası | Açıklama | Yetkilendirme | Frontend Kullanımı | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/register` | `authRoutes.js` | Yeni kullanıcı kaydı oluşturur. | Herkese Açık | `authService.ts` -> `register()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/login` | `authRoutes.js` | Kullanıcı girişi yaparak JWT token oluşturur. | Herkese Açık | `authService.ts` -> `login()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/logout` | `authRoutes.js` | Kullanıcının oturumunu sonlandırır (Redis'ten siler). | Giriş Yapmış Kullanıcı | `authService.ts` -> `logout()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/me` | `authRoutes.js` | Mevcut giriş yapmış kullanıcının bilgilerini döndürür. | Giriş Yapmış Kullanıcı | `authService.ts` -> `getCurrentUser()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/refresh` | `authRoutes.js` | Mevcut token'ı yeniler. | Giriş Yapmış Kullanıcı | `authService.ts` -> `refreshToken()` | ✅ Mevcut ve Kullanılıyor |

---

## 2. Aday Yönetimi (/api/v1/candidates)

| Method | Endpoint | Backend Dosyası | Açıklama | Yetkilendirme | Frontend Kullanımı | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/` | `candidateRoutes.js` | Kullanıcının tüm adaylarını listeler. | Giriş Yapmış Kullanıcı | `candidateService.ts` -> `getCandidates()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/check-duplicate` | `candidateRoutes.js` | Yüklenmek istenen bir CV dosyasının daha önce yüklenip yüklenmediğini kontrol eder. | Giriş Yapmış Kullanıcı | `candidateService.ts` -> `checkDuplicate()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/upload` | `candidateRoutes.js` | Yeni bir CV dosyası yükler ve MinIO'ya kaydeder. | Giriş Yapmış Kullanıcı | `candidateService.ts` -> `uploadCV()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id` | `candidateRoutes.js` | Belirli bir adayın detaylarını getirir. | Giriş Yapmış Kullanıcı | `candidateService.ts` -> `getCandidateById()` | ✅ Mevcut ve Kullanılıyor |
| DELETE | `/:id` | `candidateRoutes.js` | Bir adayı arşivler (soft delete). | Giriş Yapmış Kullanıcı | `candidateService.ts` -> `deleteCandidate()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/export/xlsx` | `candidateRoutes.js` | Aday listesini Excel formatında dışa aktarır. | Giriş Yapmış Kullanıcı | `jobPostings/page.tsx` -> `handleExport()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/export/csv` | `candidateRoutes.js` | Aday listesini CSV formatında dışa aktarır. | Giriş Yapmış Kullanıcı | `jobPostings/page.tsx` -> `handleExport()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id/download` | `candidateRoutes.js` | Bir adayın CV dosyasını indirir. | Giriş Yapmış Kullanıcı | `candidateService.ts` -> `downloadCV()` | ⚠️ **Tutarsızlık:** Frontend `/:id/download` endpoint'ini çağırıyor ancak backend'de böyle bir route tanımlı değil. `uploadCV` içindeki MinIO linki doğrudan kullanılıyor olabilir. |

---

## 3. İş İlanı Yönetimi (/api/v1/job-postings)

| Method | Endpoint | Backend Dosyası | Açıklama | Yetkilendirme | Frontend Kullanımı | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/` | `jobPostingRoutes.js` | Kullanıcının tüm iş ilanlarını listeler. | Giriş Yapmış Kullanıcı | `jobPostingService.ts` -> `getJobPostings()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/` | `jobPostingRoutes.js` | Yeni bir iş ilanı oluşturur. | Giriş Yapmış Kullanıcı | `jobPostingService.ts` -> `createJobPosting()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id` | `jobPostingRoutes.js` | Belirli bir iş ilanının detaylarını getirir. | Giriş Yapmış Kullanıcı | `jobPostingService.ts` -> `getJobPostingById()` | ✅ Mevcut ve Kullanılıyor |
| PUT | `/:id` | `jobPostingRoutes.js` | Bir iş ilanını günceller. | Giriş Yapmış Kullanıcı | `jobPostingService.ts` -> `updateJobPosting()` | ✅ Mevcut ve Kullanılıyor |
| DELETE | `/:id` | `jobPostingRoutes.js` | Bir iş ilanını arşivler (soft delete). | Giriş Yapmış Kullanıcı | `jobPostingService.ts` -> `deleteJobPosting()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/export/xlsx` | `jobPostingRoutes.js` | İş ilanlarını Excel formatında dışa aktarır. | Giriş Yapmış Kullanıcı | `jobPostings/page.tsx` -> `handleExport()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/export/csv` | `jobPostingRoutes.js` | İş ilanlarını CSV formatında dışa aktarır. | Giriş Yapmış Kullanıcı | `jobPostings/page.tsx` -> `handleExport()` | ✅ Mevcut ve Kullanılıyor |

---

## 4. Analiz Yönetimi (/api/v1/analyses)

| Method | Endpoint | Backend Dosyası | Açıklama | Yetkilendirme | Frontend Kullanımı | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/` | `analysisRoutes.js` | Yeni bir analiz süreci başlatır. | Giriş Yapmış Kullanıcı | `analysisService.ts` -> `createAnalysis()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/` | `analysisRoutes.js` | Kullanıcının tüm analizlerini listeler. | Giriş Yapmış Kullanıcı | `analysisService.ts` -> `getAnalyses()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id` | `analysisRoutes.js` | Belirli bir analizin detaylarını ve sonuçlarını getirir. | Giriş Yapmış Kullanıcı | `analysisService.ts` -> `getAnalysisById()` | ✅ Mevcut ve Kullanılıyor |
| DELETE | `/:id` | `analysisRoutes.js` | Bir analizi ve ilgili tüm sonuçlarını siler. | Giriş Yapmış Kullanıcı | `analysisService.ts` -> `deleteAnalysis()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/:id/add-candidates` | `analysisRoutes.js` | Mevcut bir analize yeni adaylar ekler. | Giriş Yapmış Kullanıcı | `analysisService.ts` -> `addCandidatesToAnalysis()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/:id/send-feedback` | `analysisRoutes.js` | Düşük puanlı adaylara AI ile geri bildirim e-postası gönderir. | Giriş Yapmış Kullanıcı | ⚠️ Kullanımda Değil | ⚠️ Backend'de var ama frontend'de kullanılmıyor. |
| GET | `/:id/export/xlsx` | `analysisRoutes.js` | Analiz sonuçlarını Excel olarak dışa aktarır. | Giriş Yapmış Kullanıcı | `[id]/page.tsx` -> `handleExport()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id/export/csv` | `analysisRoutes.js` | Analiz sonuçlarını CSV olarak dışa aktarır. | Giriş Yapmış Kullanıcı | `[id]/page.tsx` -> `handleExport()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id/export/html` | `analysisRoutes.js` | Analiz sonuçlarını yazdırılabilir HTML olarak dışa aktarır. | Giriş Yapmış Kullanıcı | `[id]/page.tsx` -> `handleExport()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/:id/send-email` | `analysisRoutes.js` | Analiz raporunu e-posta ile gönderir. | Giriş Yapmış Kullanıcı | `EmailExportModal.tsx` | ✅ Mevcut ve Kullanılıyor |
| POST | `/:id/chat` | `analysisChatRoutes.js` | Analize özel AI sohbet mesajı gönderir. | Giriş Yapmış Kullanıcı | `analysisChatService.ts` -> `sendChatMessage()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id/chat-stats` | `analysisChatRoutes.js` | AI sohbet context'inin durumunu kontrol eder. | Giriş Yapmış Kullanıcı | `analysisChatService.ts` -> `getChatStats()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/:id/prepare-chat` | `analysisChatRoutes.js` | AI sohbet için context'i hazırlar. | Giriş Yapmış Kullanıcı | `analysisChatService.ts` -> `prepareChatContext()` | ⚠️ **Tutarsızlık:** Frontend'de bu endpoint çağrılıyor ancak backend `analysisChatRoutes.js` dosyasında böyle bir route tanımı yok. `getChatStats` içinde bu mantık olabilir. |

---

## 5. Değerlendirme Testleri (/api/v1/tests)

| Method | Endpoint | Backend Dosyası | Açıklama | Yetkilendirme | Frontend Kullanımı | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/` | `testRoutes.js` | Kullanıcının oluşturduğu tüm testleri listeler. | Giriş Yapmış Kullanıcı | ⚠️ Kullanımda Değil | ⚠️ Backend'de var ama frontend'de kullanılmıyor. |
| POST | `/generate` | `testRoutes.js` | İş ilanı veya analize göre yeni bir test oluşturur. | Giriş Yapmış Kullanıcı | `testService.ts` -> `generateTest()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/:testId/send-email` | `testRoutes.js` | Test linkini adaya e-posta ile gönderir. | Giriş Yapmış Kullanıcı | `testService.ts` -> `sendTestEmail()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/submissions` | `testRoutes.js` | Bir adayın tüm test sonuçlarını e-posta ile sorgular. | Giriş Yapmış Kullanıcı | `testService.ts` -> `getTestSubmissionsByEmail()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:testId/submissions` | `testRoutes.js` | Belirli bir testin tüm sonuçlarını listeler. | Giriş Yapmış Kullanıcı | ⚠️ Kullanımda Değil | ⚠️ Backend'de var ama frontend'de kullanılmıyor. |
| GET | `/public/:token` | `testRoutes.js` | Adayın testi çözmesi için test bilgilerini getirir. | Herkese Açık | `testService.ts` -> `getPublicTest()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/public/:token/check-attempts` | `testRoutes.js` | Adayın deneme hakkını kontrol eder. | Herkese Açık | `[token]/page.tsx` | ✅ Mevcut ve Kullanılıyor |
| POST | `/public/:token/submit` | `testRoutes.js` | Adayın test cevaplarını gönderir. | Herkese Açık | `testService.ts` -> `submitTest()` | ✅ Mevcut ve Kullanılıyor |

---

## 6. İş Teklifi Sistemi (/api/v1/offers)

| Method | Endpoint | Backend Dosyası | Açıklama | Yetkilendirme | Frontend Kullanımı | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/wizard` | `offerRoutes.js` | Sihirbaz üzerinden hızlıca yeni teklif oluşturur. | Giriş Yapmış Kullanıcı | `offerWizardStore.ts` | ✅ Mevcut ve Kullanılıyor |
| GET | `/` | `offerRoutes.js` | Teklifleri listeler. | Giriş Yapmış Kullanıcı | `offerService.ts` -> `fetchOffers()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/` | `offerRoutes.js` | Yeni bir teklif oluşturur. | Giriş Yapmış Kullanıcı | `offerService.ts` -> `createOffer()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id` | `offerRoutes.js` | Teklif detaylarını getirir. | Giriş Yapmış Kullanıcı | `offerService.ts` -> `fetchOfferById()` | ✅ Mevcut ve Kullanılıyor |
| PUT | `/:id` | `offerRoutes.js` | Bir teklifi günceller. | Giriş Yapmış Kullanıcı | `offerService.ts` -> `updateOffer()` | ✅ Mevcut ve Kullanılıyor |
| DELETE | `/:id` | `offerRoutes.js` | Bir teklifi siler. | Giriş Yapmış Kullanıcı | `offerService.ts` -> `deleteOffer()` | ✅ Mevcut ve Kullanılıyor |
| PATCH | `/:id/send` | `offerRoutes.js` | Onaylanmış bir teklifi adaya gönderir. | Giriş Yapmış Kullanıcı | `offerService.ts` -> `sendOffer()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/bulk-send` | `offerRoutes.js` | Seçili teklifleri toplu olarak gönderir. | Giriş Yapmış Kullanıcı | `offerService.ts` -> `bulkSendOffers()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/:id/preview-pdf` | `offerRoutes.js` | Teklifin PDF önizlemesini oluşturur. | Giriş Yapmış Kullanıcı | ⚠️ Kullanımda Değil | ⚠️ Backend'de var ama frontend'de kullanılmıyor. |
| GET | `/:id/download-pdf` | `offerRoutes.js` | Teklifin PDF'ini indirir. | Giriş Yapmış Kullanıcı | ⚠️ Kullanımda Değil | ⚠️ Backend'de var ama frontend'de kullanılmıyor. |
| PATCH | `/:id/request-approval` | `offerRoutes.js` | Bir teklifi onaya gönderir. | Giriş Yapmış Kullanıcı | `approvalService.ts` -> `requestApproval()` | ✅ Mevcut ve Kullanılıyor |
| PATCH | `/:id/approve` | `offerRoutes.js` | Bir teklifi onaylar. | Admin/Manager | `approvalService.ts` -> `approveOffer()` | ✅ Mevcut ve Kullanılıyor |
| PATCH | `/:id/reject-approval` | `offerRoutes.js` | Bir teklif onayını reddeder. | Admin/Manager | ❌ **Eksik:** `approvalService.ts` içinde `rejectOffer` fonksiyonu var ancak `/:id/reject-approval` yerine `/:id/reject` endpoint'ini çağırıyor gibi görünüyor. Backend route ile frontend çağrısı arasında bir tutarsızlık var. |
| GET | `/public/:token` | `publicOfferRoutes.js` | Adayın teklifi görüntülemesini sağlar. | Herkese Açık | `publicOfferService.ts` -> `getOfferByToken()` | ✅ Mevcut ve Kullanılıyor |
| PATCH | `/public/:token/accept` | `publicOfferRoutes.js` | Adayın teklifi kabul etmesini sağlar. | Herkese Açık | `publicOfferService.ts` -> `acceptOffer()` | ✅ Mevcut ve Kullanılıyor |
| PATCH | `/public/:token/reject` | `publicOfferRoutes.js` | Adayın teklifi reddetmesini sağlar. | Herkese Açık | `publicOfferService.ts` -> `rejectOffer()` | ✅ Mevcut ve Kullanılıyor |

---

## 7. Sistem ve Yönetim

| Method | Endpoint | Backend Dosyası | Açıklama | Yetkilendirme | Frontend Kullanımı | Durum |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/health` | `index.js` | Sistemin (DB, Redis, MinIO) sağlık durumunu kontrol eder. | Herkese Açık | ⚠️ Kullanımda Değil | ⚠️ Backend'de var ama frontend'de kullanılmıyor. |
| GET | `/api/v1/dashboard/stats` | `dashboardRoutes.js` | Yönetici paneli için istatistikleri getirir. | Admin/Manager | `dashboardService.ts` -> `getDashboardStats()` | ✅ Mevcut ve Kullanılıyor |
| POST | `/api/v1/errors/log` | `errorLoggingRoutes.js` | Frontend'den gelen hataları kaydeder. | Herkese Açık | `errorLoggingService.ts` -> `logError()` | ✅ Mevcut ve Kullanılıyor |
| GET | `/api/v1/users` | `userRoutes.js` | Tüm kullanıcıları listeler. | Admin | ⚠️ Kullanımda Değil | ⚠️ Backend'de var ama frontend'de kullanılmıyor. |
| GET | `/api/v1/cache/stats` | `cacheRoutes.js` | Redis cache istatistiklerini gösterir. | Giriş Yapmış Kullanıcı | ⚠️ Kullanımda Değil | ⚠️ Backend'de var ama frontend'de kullanılmıyor. |

---

## Rapor Özeti ve Sonuç

*   **Genel Durum:** Projenin API yapısı büyük ölçüde tutarlı ve frontend ile entegre çalışıyor.
*   **Potansiyel Atıl Kod:** Backend'de tanımlanmış ancak frontend'de hiçbir servis tarafından çağrılmayan bazı endpoint'ler (örn: `/api/v1/users`, `/health`, bazı test ve export endpoint'leri) bulunmaktadır. Bunlar ya eski kodlar ya da henüz frontend entegrasyonu yapılmamış özellikler olabilir.
*   **Kritik Hatalar:** `candidateService.ts` içinde CV indirme ve `approvalService.ts` içinde teklif reddetme fonksiyonlarında, backend'de karşılığı olmayan veya yanlış tanımlanmış endpoint'lere yapılan çağrılar tespit edildi. Bu durumlar, ilgili özelliklerin çalışmamasına neden olacaktır ve düzeltilmelidir.
*   **İyileştirme Önerisi:** Frontend'de kullanılmayan endpoint'lerin temizlenmesi veya ilgili özelliklerin eklenmesi, kod tabanının daha temiz ve yönetilebilir olmasını sağlayacaktır.
