/**
 * Turkish Error Message Mapping
 * Converts technical/English errors to user-friendly Turkish messages
 */

interface ErrorMessageMap {
  [key: string]: string;
}

const ERROR_MESSAGES: ErrorMessageMap = {
  // Network Errors
  "Network Error":
    "İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin.",
  "Failed to fetch": "Sunucuya bağlanılamadı. Lütfen tekrar deneyin.",
  "Request failed": "İstek başarısız oldu. Lütfen tekrar deneyin.",

  // Authentication
  Unauthorized: "Oturum süreniz doldu. Lütfen tekrar giriş yapın.",
  "Invalid credentials": "Kullanıcı adı veya şifre hatalı.",
  "Token expired": "Oturum süreniz doldu. Lütfen tekrar giriş yapın.",

  // Validation
  "Validation Error": "Lütfen tüm gerekli alanları doldurun.",
  "Invalid email": "Geçerli bir email adresi girin.",
  "Invalid phone": "Geçerli bir telefon numarası girin.",

  // File Upload
  "File too large": "Dosya boyutu çok büyük (maksimum 10MB).",
  "Invalid file type":
    "Geçersiz dosya tipi. PDF, DOCX, DOC, HTML, TXT veya CSV yükleyin.",
  "Upload failed": "Dosya yüklenemedi. Lütfen tekrar deneyin.",
  "Tüm dosyalar yüklenemedi":
    "Tüm dosyalar yüklenemedi. Lütfen başarısız dosyaları kontrol edin.",

  // Analysis
  "Analysis failed": "Analiz işlemi başarısız oldu. Lütfen tekrar deneyin.",
  "Job posting not found": "İş ilanı bulunamadı.",
  "Candidate not found": "Aday bulunamadı.",
  "No candidates selected": "Lütfen en az bir aday seçin.",

  // Server Errors
  "Internal Server Error":
    "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
  "Service Unavailable":
    "Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.",

  // Job Posting
  "İş ilanı oluşturulamadı":
    "İş ilanı oluşturulamadı. Lütfen tüm alanları doldurun.",
  "İş ilanları yüklenemedi":
    "İş ilanları yüklenemedi. Lütfen sayfayı yenileyin.",

  // CV Upload
  "CV yükleme başarısız oldu":
    "CV yüklenemedi. Lütfen dosyayı kontrol edip tekrar deneyin.",
  "Adaylar yüklenemedi": "Adaylar yüklenemedi. Lütfen sayfayı yenileyin.",

  // Test System
  "Test oluşturulamadı": "Test oluşturulamadı. Lütfen tekrar deneyin.",
  "Test gönderiminde hata oluştu":
    "Test emaili gönderilemedi. Lütfen email adresini kontrol edin.",

  // Generic
  "Bir hata oluştu": "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
  "Maksimum 10 CV seçebilirsiniz": "En fazla 10 CV seçebilirsiniz.",
};

/**
 * Get Turkish error message
 * @param error - Error object or string
 * @returns User-friendly Turkish error message
 */
export function getTurkishErrorMessage(error: any): string {
  if (!error) {
    return "Bilinmeyen bir hata oluştu.";
  }

  // If error is a string, check direct mapping
  if (typeof error === "string") {
    return ERROR_MESSAGES[error] || error;
  }

  // If error object has message
  if (error.message) {
    const errorMessage = error.message as string;

    // Check exact match
    if (ERROR_MESSAGES[errorMessage]) {
      return ERROR_MESSAGES[errorMessage];
    }

    // Check partial match
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // Return original message if no match
    return errorMessage;
  }

  // If error object has error field
  if (error.error && ERROR_MESSAGES[error.error]) {
    return ERROR_MESSAGES[error.error];
  }

  // If error object has status code
  if (error.status) {
    switch (error.status) {
      case 400:
        return "Geçersiz istek. Lütfen bilgileri kontrol edin.";
      case 401:
        return "Oturum süreniz doldu. Lütfen tekrar giriş yapın.";
      case 403:
        return "Bu işlem için yetkiniz yok.";
      case 404:
        return "Aranan kayıt bulunamadı.";
      case 409:
        return "Bu kayıt zaten mevcut.";
      case 422:
        return "Girilen bilgiler geçersiz.";
      case 429:
        return "Çok fazla istek gönderildi. Lütfen bekleyin.";
      case 500:
        return "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
      case 502:
        return "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.";
      case 503:
        return "Servis şu anda kullanılamıyor.";
      default:
        return `Hata kodu: ${error.status}. Lütfen tekrar deneyin.`;
    }
  }

  return "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.";
}

/**
 * Add new error message to the map (for future use)
 */
export function addErrorMessage(key: string, value: string): void {
  ERROR_MESSAGES[key] = value;
}

/**
 * Get all error messages (for debugging)
 */
export function getAllErrorMessages(): ErrorMessageMap {
  return { ...ERROR_MESSAGES };
}
