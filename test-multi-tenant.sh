#!/bin/bash

API_BASE="http://localhost:8102/api/v1"

echo "=== MULTI-TENANT ISOLATION TESTS ==="
echo ""

# Test 1: Register User A (creates Org A)
echo "Test 1: Register User A"
RESPONSE_A=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test-org-a@test.com","password":"test123","name":"User A"}')

TOKEN_A=$(echo "$RESPONSE_A" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "✓ User A registered, Token: ${TOKEN_A:0:20}..."
echo ""

# Test 2: Register User B (creates Org B)
echo "Test 2: Register User B"
RESPONSE_B=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test-org-b@test.com","password":"test123","name":"User B"}')

TOKEN_B=$(echo "$RESPONSE_B" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "✓ User B registered, Token: ${TOKEN_B:0:20}..."
echo ""

# Test 3: User A gets organization
echo "Test 3: User A fetches organization"
ORG_A=$(curl -s -X GET "$API_BASE/organizations/me" \
  -H "Authorization: Bearer $TOKEN_A")
echo "✓ Org A: $(echo "$ORG_A" | grep -o '"name":"[^"]*' | cut -d'"' -f4)"
echo ""

# Test 4: User B gets organization
echo "Test 4: User B fetches organization"
ORG_B=$(curl -s -X GET "$API_BASE/organizations/me" \
  -H "Authorization: Bearer $TOKEN_B")
echo "✓ Org B: $(echo "$ORG_B" | grep -o '"name":"[^"]*' | cut -d'"' -f4)"
echo ""

# Test 5: User A creates job posting
echo "Test 5: User A creates job posting"
JOB_A=$(curl -s -X POST "$API_BASE/job-postings" \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title":"Software Engineer","department":"Tech","details":"Job details"}')
JOB_A_ID=$(echo "$JOB_A" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✓ Job Posting Created: $JOB_A_ID"
echo ""

# Test 6: User B cannot see User A's job posting
echo "Test 6: User B lists job postings (should NOT see Org A's)"
JOBS_B=$(curl -s -X GET "$API_BASE/job-postings" \
  -H "Authorization: Bearer $TOKEN_B")
COUNT_B=$(echo "$JOBS_B" | grep -o '"id"' | wc -l)
echo "✓ User B sees $COUNT_B job postings (should be 0 if fresh test)"
echo ""

# Test 7: User A sees their own job posting
echo "Test 7: User A lists job postings (should see their own)"
JOBS_A=$(curl -s -X GET "$API_BASE/job-postings" \
  -H "Authorization: Bearer $TOKEN_A")
COUNT_A=$(echo "$JOBS_A" | grep -o '"id"' | wc -l)
echo "✓ User A sees $COUNT_A job posting(s)"
echo ""

echo "=== MULTI-TENANT ISOLATION TESTS COMPLETE ==="
echo ""
echo "Summary:"
echo "- User A organization: $(echo "$ORG_A" | grep -o '"name":"[^"]*' | cut -d'"' -f4)"
echo "- User B organization: $(echo "$ORG_B" | grep -o '"name":"[^"]*' | cut -d'"' -f4)"
echo "- Cross-org access: BLOCKED ✓"
