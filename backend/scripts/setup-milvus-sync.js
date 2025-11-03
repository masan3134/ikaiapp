#!/usr/bin/env node

/**
 * Milvus Sync System Setup Script
 * İlk kurulum ve yapılandırma için kullanılır
 *
 * Usage: node scripts/setup-milvus-sync.js
 */

require('dotenv').config();
const { getMilvusSyncService } = require('../src/services/milvusSyncService');
const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('');
  console.log('═'.repeat(60));
  console.log('  🚀 Milvus Sync System - Setup');
  console.log('═'.repeat(60));
  console.log('');

  try {
    // Step 1: Milvus Bağlantı Kontrolü
    console.log('📡 Step 1: Checking Milvus connection...');
    const milvus = await getMilvusSyncService();
    console.log('✅ Milvus connected successfully\n');

    // Step 2: Collections Kontrolü
    console.log('📦 Step 2: Verifying collections...');
    const stats = await milvus.getSyncStats();
    console.log(`✅ cv_embeddings: ${stats.candidates.total} records`);
    console.log(`✅ job_embeddings: ${stats.jobs.total} records`);
    console.log(`✅ analysis_results: ${stats.analysisResults.total} records\n`);

    // Step 3: PostgreSQL Veri Sayısı
    console.log('📊 Step 3: Checking PostgreSQL data...');
    const candidatesCount = await prisma.candidate.count({
      where: { isDeleted: false }
    });
    const jobsCount = await prisma.jobPosting.count({
      where: { isDeleted: false }
    });
    console.log(`   Candidates in PostgreSQL: ${candidatesCount}`);
    console.log(`   Jobs in PostgreSQL: ${jobsCount}\n`);

    // Step 4: Sync Gerekli mi?
    const needsSync = candidatesCount > stats.candidates.total || jobsCount > stats.jobs.total;

    if (needsSync) {
      console.log('⚠️  Milvus\'ta eksik veriler var!\n');
      console.log(`   Candidates: ${candidatesCount} → ${stats.candidates.total} (${candidatesCount - stats.candidates.total} eksik)`);
      console.log(`   Jobs: ${jobsCount} → ${stats.jobs.total} (${jobsCount - stats.jobs.total} eksik)\n`);

      const answer = await question('   İlk senkronizasyonu başlatmak ister misiniz? (y/n): ');

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\n🔄 Başlatılıyor...\n');

        // Candidates sync
        if (candidatesCount > stats.candidates.total) {
          console.log('📝 Syncing candidates...');
          const candidatesResult = await milvus.syncAllCandidates();
          console.log(`✅ Candidates: ${candidatesResult.synced}/${candidatesResult.total} synced`);
          if (candidatesResult.errors > 0) {
            console.log(`⚠️  Errors: ${candidatesResult.errors}`);
          }
        }

        // Jobs sync
        if (jobsCount > stats.jobs.total) {
          console.log('📝 Syncing jobs...');
          const jobsResult = await milvus.syncAllJobPostings();
          console.log(`✅ Jobs: ${jobsResult.synced}/${jobsResult.total} synced`);
          if (jobsResult.errors > 0) {
            console.log(`⚠️  Errors: ${jobsResult.errors}`);
          }
        }

        console.log('\n✅ İlk senkronizasyon tamamlandı!\n');
      } else {
        console.log('\n   Senkronizasyon atlandı.\n');
      }
    } else {
      console.log('✅ Tüm veriler senkronize!\n');
    }

    // Step 5: Configuration Check
    console.log('⚙️  Step 5: Configuration check...');
    const config = {
      ollamaUrl: process.env.OLLAMA_URL,
      ollamaModel: process.env.OLLAMA_MODEL,
      milvusUrl: process.env.MILVUS_URL,
      syncEnabled: process.env.MILVUS_SYNC_ENABLED,
      syncCron: process.env.MILVUS_SYNC_CRON,
      syncConcurrency: process.env.MILVUS_SYNC_CONCURRENCY
    };

    console.log('   Current configuration:');
    console.log(`   - Ollama URL: ${config.ollamaUrl || 'http://ollama:11434 (default)'}`);
    console.log(`   - Ollama Model: ${config.ollamaModel || 'nomic-embed-text (default)'}`);
    console.log(`   - Milvus URL: ${config.milvusUrl || 'http://milvus:19530 (default)'}`);
    console.log(`   - Sync Enabled: ${config.syncEnabled || 'true (default)'}`);
    console.log(`   - Sync Cron: ${config.syncCron || '0 2 * * * (default - 2 AM daily)'}`);
    console.log(`   - Sync Concurrency: ${config.syncConcurrency || '5 (default)'}\n`);

    // Step 6: Test Sync
    console.log('🧪 Step 6: Test sync capabilities...');
    const testAnswer = await question('   Test sync yapmak ister misiniz? (y/n): ');

    if (testAnswer.toLowerCase() === 'y' || testAnswer.toLowerCase() === 'yes') {
      console.log('\n🧪 Testing embedding generation...');
      const testEmbedding = await milvus.generateEmbedding('Test CV text for embedding generation');
      console.log(`✅ Embedding generated successfully (${testEmbedding.length} dimensions)\n`);
    }

    // Summary
    console.log('');
    console.log('═'.repeat(60));
    console.log('  ✅ Setup Complete!');
    console.log('═'.repeat(60));
    console.log('');
    console.log('📚 Next steps:');
    console.log('   1. Real-time sync: Add Prisma middleware to index.js');
    console.log('   2. API routes: Add /api/v1/milvus-sync routes');
    console.log('   3. Worker: Start milvusSyncWorker');
    console.log('   4. Schedule: Enable daily sync cron job');
    console.log('');
    console.log('📖 Documentation:');
    console.log('   - Quick Start: MILVUS_SYNC_QUICK_START.md');
    console.log('   - Full Guide: MILVUS_SYNC_SYSTEM.md');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Setup failed:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check if Milvus is running: docker-compose ps milvus');
    console.error('   2. Check if Ollama is running: curl http://localhost:11434/api/tags');
    console.error('   3. Check environment variables in .env file');
    console.error('');
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
