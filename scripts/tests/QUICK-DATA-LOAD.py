#!/usr/bin/env python3
"""HIZLI DATA LOAD - Master Worker Test için tüm data"""
import subprocess
import json

print("⚡ HIZLI DATA LOAD BAŞLIYOR...")
print("="*80)

ORG_ID = "8a0e7fd0-0cf7-456e-8558-d01cbfaa6e7f"
BUSE_ID = "fc02b284-1ffa-449a-8202-60e9dd66f7d3"
GIZEM_ID = "96890880-0482-44b8-aae8-f0986ef50671"
ANALYSIS_ID = "1b0f1db3-a1cf-4965-8686-793331599e8c"

# Get interview IDs
print("\n📋 Getting interview IDs...")
result = subprocess.run([
    'docker', 'exec', 'ikai-postgres', 'psql', '-U', 'ikaiuser', '-d', 'ikaidb', '-t', '-c',
    "SELECT id FROM interviews WHERE \"organizationId\" = '8a0e7fd0-0cf7-456e-8558-d01cbfaa6e7f' ORDER BY date, time;"
], capture_output=True, text=True)
interview_ids = [line.strip() for line in result.stdout.strip().split('\n') if line.strip()]
print(f"✅ {len(interview_ids)} interviews found")

# Get candidate IDs (top 3 from analysis)
print("\n📋 Getting candidate IDs...")
result = subprocess.run([
    'docker', 'exec', 'ikai-postgres', 'psql', '-U', 'ikaiuser', '-d', 'ikaidb', '-t', '-c',
    f"SELECT \"candidateId\" FROM analysis_results WHERE \"analysisId\" = '{ANALYSIS_ID}' ORDER BY \"compatibilityScore\" DESC LIMIT 3;"
], capture_output=True, text=True)
candidate_ids = [line.strip() for line in result.stdout.strip().split('\n') if line.strip()]
print(f"✅ Top 3 candidates: {len(candidate_ids)}")

# Link interviews to candidates
print("\n📋 Linking interviews to candidates...")
for i, (interview_id, candidate_id) in enumerate(zip(interview_ids, candidate_ids)):
    sql = f"""
    INSERT INTO interview_candidates (id, \"interviewId\", \"candidateId\", attended, rating, feedback, \"createdAt\", \"updatedAt\")
    VALUES (gen_random_uuid(), '{interview_id}', '{candidate_id}', true, {[5,4,3][i]}, 'Interview feedback {i+1}', NOW(), NOW())
    ON CONFLICT DO NOTHING;
    """
    subprocess.run(['docker', 'exec', 'ikai-postgres', 'psql', '-U', 'ikaiuser', '-d', 'ikaidb', '-c', sql], capture_output=True)
    print(f"✅ Interview {i+1} → Candidate {i+1} (rating: {[5,4,3][i]})")

# Create 4 job offers (top 4 candidates)
print("\n📋 Creating 4 job offers...")
result = subprocess.run([
    'docker', 'exec', 'ikai-postgres', 'psql', '-U', 'ikaiuser', '-d', 'ikaidb', '-t', '-c',
    f"SELECT \"candidateId\" FROM analysis_results WHERE \"analysisId\" = '{ANALYSIS_ID}' ORDER BY \"compatibilityScore\" DESC LIMIT 4;"
], capture_output=True, text=True)
offer_candidate_ids = [line.strip() for line in result.stdout.strip().split('\n') if line.strip()]

salaries = [45000, 43000, 40000, 42000]
statuses = ['accepted', 'accepted', 'rejected', 'rejected']

for i, (cand_id, salary, status) in enumerate(zip(offer_candidate_ids, salaries, statuses)):
    token = f"offer-token-{i+1}-{cand_id[:8]}"
    sql = f"""
    INSERT INTO job_offers (
      id, \"candidateId\", \"jobPostingId\", \"createdBy\", position, department,
      salary, currency, \"startDate\", \"workType\", benefits, terms,
      \"expiresAt\", \"acceptanceToken\", status, \"approvalStatus\",
      \"sentAt\", \"respondedAt\", {f'\"acceptedAt\"' if status == 'accepted' else '\"rejectedAt\"'},
      \"organizationId\", \"createdAt\", \"updatedAt\"
    ) VALUES (
      gen_random_uuid(),
      '{cand_id}',
      'b2d8e87e-6360-4a4c-853a-e063a4f5a259',
      '{BUSE_ID}',
      'Senior Backend Developer',
      'Engineering',
      {salary},
      'TRY',
      '2025-12-01',
      'Hybrid',
      '["Health insurance", "Meal card", "Training budget"]'::jsonb,
      'Standard employment terms',
      NOW() + interval '10 days',
      '{token}',
      '{status}'::"OfferStatus",
      'approved'::"ApprovalStatus",
      NOW(),
      NOW(),
      NOW(),
      '{ORG_ID}',
      NOW(),
      NOW()
    );
    """
    subprocess.run(['docker', 'exec', 'ikai-postgres', 'psql', '-U', 'ikaiuser', '-d', 'ikaidb', '-c', sql], capture_output=True)
    print(f"✅ Offer {i+1} → {status.upper()} (salary: {salary:,} TL)")

# Update usage count
print("\n📋 Updating usage metrics...")
subprocess.run([
    'docker', 'exec', 'ikai-postgres', 'psql', '-U', 'ikaiuser', '-d', 'ikaidb', '-c',
    f"UPDATE organizations SET \"monthlyAnalysisCount\" = 1, \"monthlyCvCount\" = 5 WHERE id = '{ORG_ID}';"
], capture_output=True)
print("✅ Usage updated: 1/50 analyses, 5/200 CVs, 3/10 users")

print("\n" + "="*80)
print("✅ HIZLI DATA LOAD TAMAMLANDI!")
print("="*80)
print("\n📊 FINAL DATABASE STATE:")

# Final stats
result = subprocess.run([
    'docker', 'exec', 'ikai-postgres', 'psql', '-U', 'ikaiuser', '-d', 'ikaidb', '-c',
    f"""
    SELECT
      'Users' as metric, COUNT(*)::text as value FROM users WHERE \"organizationId\" = '{ORG_ID}'
    UNION ALL SELECT 'Job Postings', COUNT(*)::text FROM job_postings WHERE \"organizationId\" = '{ORG_ID}'
    UNION ALL SELECT 'Candidates', COUNT(*)::text FROM candidates WHERE \"organizationId\" = '{ORG_ID}'
    UNION ALL SELECT 'Analyses', COUNT(*)::text FROM analyses WHERE \"organizationId\" = '{ORG_ID}'
    UNION ALL SELECT 'Analysis Results', COUNT(*)::text FROM analysis_results WHERE \"organizationId\" = '{ORG_ID}'
    UNION ALL SELECT 'Interviews', COUNT(*)::text FROM interviews WHERE \"organizationId\" = '{ORG_ID}'
    UNION ALL SELECT 'Job Offers', COUNT(*)::text FROM job_offers WHERE \"organizationId\" = '{ORG_ID}'
    UNION ALL SELECT 'Offers Accepted', COUNT(*)::text FROM job_offers WHERE \"organizationId\" = '{ORG_ID}' AND status = 'accepted'
    UNION ALL SELECT 'Offers Rejected', COUNT(*)::text FROM job_offers WHERE \"organizationId\" = '{ORG_ID}' AND status = 'rejected';
    """
], capture_output=True, text=True)
print(result.stdout)
print("="*80)
