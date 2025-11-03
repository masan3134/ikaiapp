const express = require('express');
const router = express.Router();
const { getMilvusSyncService } = require('../services/milvusSyncService');

router.post('/candidates', async (req, res) => {
  try {
    const { query, limit = 10, threshold = 0.5 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    const milvus = await getMilvusSyncService();
    const queryEmbedding = await milvus.generateEmbedding(query);

    const searchResults = await milvus.client.search({
      collection_name: 'cv_embeddings',
      data: [queryEmbedding],
      anns_field: 'vector',
      limit: limit,
      metric_type: 'COSINE',
      params: { nprobe: 10 },
      output_fields: ['candidate_id', 'candidate_name', 'candidate_email', 'cv_text', 'skills', 'experience_years']
    });

    console.log('Search executed, results:', searchResults.results?.length || 0);

    const results = (searchResults.results || [])
      .filter(result => result.score >= threshold)
      .map(result => ({
        candidateId: result.candidate_id,
        name: result.candidate_name,
        email: result.candidate_email,
        cvSummary: result.cv_text?.substring(0, 200),
        skills: JSON.parse(result.skills || '[]'),
        experienceYears: result.experience_years,
        similarity: parseFloat((result.score * 100).toFixed(2))
      }));

    res.json({ success: true, query, resultsCount: results.length, results });
  } catch (error) {
    console.error('Smart search error:', error);
    res.status(500).json({ error: 'Smart search failed', details: error.message });
  }
});

router.get('/test', async (req, res) => {
  res.json({ success: true, message: 'Smart search API is ready!' });
});

module.exports = router;
