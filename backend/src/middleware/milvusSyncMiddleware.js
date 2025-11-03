/**
 * Milvus Sync Middleware
 * Prisma işlemlerinden sonra otomatik Milvus senkronizasyonu
 *
 * Bu middleware her create/update/delete işleminden sonra
 * otomatik olarak Milvus'a senkronizasyon yapar
 */

const { getMilvusSyncService } = require('../services/milvusSyncService');

/**
 * Prisma middleware - tüm Prisma işlemlerini yakalar
 */
async function milvusSyncMiddleware(params, next) {
  // İşlemi çalıştır (önce normal işlem)
  const result = await next(params);

  // Sync sadece belirli işlemler için
  const syncActions = ['create', 'update', 'delete', 'upsert'];
  if (!syncActions.includes(params.action)) {
    return result;
  }

  // Sync etkinleştirilmiş mi kontrol et
  const syncEnabled = process.env.MILVUS_SYNC_ENABLED !== 'false';
  if (!syncEnabled) {
    return result;
  }

  // Background sync (ana işlemi bloklama)
  setImmediate(async () => {
    try {
      const milvus = await getMilvusSyncService();

      // Candidate sync
      if (params.model === 'Candidate') {
        await handleCandidateSync(milvus, params, result);
      }

      // JobPosting sync
      if (params.model === 'JobPosting') {
        await handleJobPostingSync(milvus, params, result);
      }

      // AnalysisResult sync
      if (params.model === 'AnalysisResult') {
        await handleAnalysisResultSync(milvus, params, result);
      }
    } catch (error) {
      // Sync hatası ana işlemi etkilememelidir
      console.error('⚠️ Milvus sync middleware error:', error.message);
    }
  });

  return result;
}

/**
 * Candidate senkronizasyonunu yönet
 */
async function handleCandidateSync(milvus, params, result) {
  try {
    if (params.action === 'delete') {
      // Delete işlemi
      const candidateId = params.args.where?.id;
      if (candidateId) {
        await milvus.deleteCandidateEmbedding(candidateId);
        console.log(`🗑️ Candidate deleted from Milvus: ${candidateId}`);
      }
    } else if (params.action === 'create' || params.action === 'update' || params.action === 'upsert') {
      // Create/Update/Upsert işlemi
      const candidateId = result?.id;
      if (candidateId) {
        await milvus.syncCandidate(candidateId);
        console.log(`✅ Candidate synced to Milvus: ${candidateId}`);
      }
    }
  } catch (error) {
    console.error('Candidate sync error:', error.message);
  }
}

/**
 * JobPosting senkronizasyonunu yönet
 */
async function handleJobPostingSync(milvus, params, result) {
  try {
    if (params.action === 'delete') {
      const jobId = params.args.where?.id;
      if (jobId) {
        await milvus.deleteJobEmbedding(jobId);
        console.log(`🗑️ Job deleted from Milvus: ${jobId}`);
      }
    } else if (params.action === 'create' || params.action === 'update' || params.action === 'upsert') {
      const jobId = result?.id;
      if (jobId) {
        await milvus.syncJobPosting(jobId);
        console.log(`✅ Job synced to Milvus: ${jobId}`);
      }
    }
  } catch (error) {
    console.error('Job sync error:', error.message);
  }
}

/**
 * AnalysisResult senkronizasyonunu yönet
 */
async function handleAnalysisResultSync(milvus, params, result) {
  try {
    if (params.action === 'create' || params.action === 'update') {
      const resultId = result?.id;
      if (resultId) {
        // AnalysisResult için özel sync logic buraya eklenebilir
        console.log(`📊 Analysis result ready for sync: ${resultId}`);
      }
    }
  } catch (error) {
    console.error('Analysis result sync error:', error.message);
  }
}

/**
 * Middleware'i Prisma'ya kaydet
 */
function registerMilvusSyncMiddleware(prisma) {
  prisma.$use(milvusSyncMiddleware);
  console.log('✅ Milvus sync middleware registered');
}

module.exports = {
  milvusSyncMiddleware,
  registerMilvusSyncMiddleware
};
