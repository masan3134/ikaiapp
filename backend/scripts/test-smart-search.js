#!/usr/bin/env node

/**
 * Smart Search Test Script
 * Milvus semantic search yeteneklerini test eder
 *
 * Usage: node scripts/test-smart-search.js
 */

require('dotenv').config();
const { getMilvusSyncService } = require('../src/services/milvusSyncService');

async function main() {
  console.log('');
  console.log('═'.repeat(60));
  console.log('  🔍 Smart Search - Test Suite');
  console.log('═'.repeat(60));
  console.log('');

  let passedTests = 0;
  let failedTests = 0;

  try {
    const milvus = await getMilvusSyncService();

    // Test 1: Embedding Generation
    console.log('[Test 1] Embedding Generation');
    try {
      const testText = 'Senior Backend Developer with 5 years Node.js experience';
      const embedding = await milvus.generateEmbedding(testText);

      if (embedding && embedding.length === 768) {
        console.log('✅ Pass - Generated 768-dim embedding');
        passedTests++;
      } else {
        console.log('❌ Fail - Invalid embedding dimension');
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Fail - ${error.message}`);
      failedTests++;
    }

    // Test 2: Search CVs
    console.log('\n[Test 2] Semantic CV Search');
    try {
      const query = 'Backend developer with JavaScript experience';
      const queryEmbedding = await milvus.generateEmbedding(query);

      const searchResults = await milvus.client.search({
        collection_name: 'cv_embeddings',
        vector: queryEmbedding,
        limit: 5,
        metric_type: 'COSINE',
        output_fields: ['candidate_name', 'candidate_email', 'skills']
      });

      console.log(`✅ Pass - Found ${searchResults[0]?.length || 0} candidates`);
      if (searchResults[0] && searchResults[0].length > 0) {
        console.log(`   Top match: ${searchResults[0][0].candidate_name} (${(searchResults[0][0].score * 100).toFixed(1)}% match)`);
      }
      passedTests++;
    } catch (error) {
      console.log(`❌ Fail - ${error.message}`);
      failedTests++;
    }

    // Test 3: Search Jobs
    console.log('\n[Test 3] Semantic Job Search');
    try {
      const query = 'Full Stack Engineer position';
      const queryEmbedding = await milvus.generateEmbedding(query);

      const searchResults = await milvus.client.search({
        collection_name: 'job_embeddings',
        vector: queryEmbedding,
        limit: 5,
        metric_type: 'COSINE',
        output_fields: ['title', 'required_skills']
      });

      console.log(`✅ Pass - Found ${searchResults[0]?.length || 0} jobs`);
      if (searchResults[0] && searchResults[0].length > 0) {
        console.log(`   Top match: ${searchResults[0][0].title} (${(searchResults[0][0].score * 100).toFixed(1)}% match)`);
      }
      passedTests++;
    } catch (error) {
      console.log(`❌ Fail - ${error.message}`);
      failedTests++;
    }

    // Test 4: Similarity Threshold
    console.log('\n[Test 4] Similarity Threshold Filtering');
    try {
      const query = 'Senior Python developer';
      const queryEmbedding = await milvus.generateEmbedding(query);
      const threshold = 0.7;

      const searchResults = await milvus.client.search({
        collection_name: 'cv_embeddings',
        vector: queryEmbedding,
        limit: 10,
        metric_type: 'COSINE',
        output_fields: ['candidate_name']
      });

      const filtered = searchResults[0].filter(r => r.score >= threshold);
      console.log(`✅ Pass - ${filtered.length} results above ${threshold * 100}% threshold`);
      passedTests++;
    } catch (error) {
      console.log(`❌ Fail - ${error.message}`);
      failedTests++;
    }

    // Test 5: Multi-language Support
    console.log('\n[Test 5] Turkish Language Support');
    try {
      const turkishQuery = 'Kıdemli yazılım geliştirici JavaScript deneyimi';
      const embedding = await milvus.generateEmbedding(turkishQuery);

      if (embedding && embedding.length === 768) {
        console.log('✅ Pass - Turkish text embedded successfully');
        passedTests++;
      } else {
        console.log('❌ Fail - Turkish embedding failed');
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Fail - ${error.message}`);
      failedTests++;
    }

    // Test 6: Performance Check
    console.log('\n[Test 6] Performance Benchmark');
    try {
      const startTime = Date.now();
      const testQueries = [
        'Frontend developer React',
        'Backend engineer Python',
        'DevOps specialist AWS'
      ];

      for (const query of testQueries) {
        const embedding = await milvus.generateEmbedding(query);
        await milvus.client.search({
          collection_name: 'cv_embeddings',
          vector: embedding,
          limit: 5,
          metric_type: 'COSINE',
          output_fields: ['candidate_name']
        });
      }

      const endTime = Date.now();
      const avgTime = (endTime - startTime) / testQueries.length;

      if (avgTime < 1000) {
        console.log(`✅ Pass - Avg search time: ${avgTime.toFixed(0)}ms`);
        passedTests++;
      } else {
        console.log(`⚠️  Warning - Slow search: ${avgTime.toFixed(0)}ms`);
        passedTests++;
      }
    } catch (error) {
      console.log(`❌ Fail - ${error.message}`);
      failedTests++;
    }

    // Test 7: Collection Stats
    console.log('\n[Test 7] Collection Statistics');
    try {
      const stats = await milvus.getSyncStats();

      console.log('✅ Pass - Stats retrieved:');
      console.log(`   Candidates: ${stats.candidates.total}`);
      console.log(`   Jobs: ${stats.jobs.total}`);
      console.log(`   Analysis Results: ${stats.analysisResults.total}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ Fail - ${error.message}`);
      failedTests++;
    }

    // Summary
    console.log('');
    console.log('═'.repeat(60));
    console.log('  📊 Test Results');
    console.log('═'.repeat(60));
    console.log('');
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   Total: ${passedTests + failedTests}`);
    console.log('');

    if (failedTests === 0) {
      console.log('🎉 All tests passed!\n');
      console.log('💡 Smart search is working correctly.');
      console.log('   You can now use semantic search in your application.\n');
    } else {
      console.log('⚠️  Some tests failed\n');
      console.log('💡 Troubleshooting:');
      console.log('   1. Check if collections have data');
      console.log('   2. Verify Ollama is running');
      console.log('   3. Check Milvus connection\n');
    }

  } catch (error) {
    console.error('');
    console.error('❌ Test suite failed:', error.message);
    console.error('');
    process.exit(1);
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

main();
