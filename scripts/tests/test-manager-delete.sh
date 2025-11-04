#!/bin/bash
# Worker 3 - MANAGER DELETE Operations Tests

MANAGER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGI2MDFhNy02NDQ1LTRlNWItYmVhYS00ZjJiNWUzYjMzMmUiLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc2MjIzMzU3NSwiZXhwIjoxNzYyODM4Mzc1fQ.UgVSytwk9735dsK1zPNV1o5u9XnvHQqlxXywaFoJABI"

echo "=== MANAGER DELETE Operations Tests ==="
echo ""

# Get candidate ID
echo "[1/7] Getting candidate ID for offer creation..."
CANDIDATE_RESPONSE=$(curl -s -X GET "http://localhost:8102/api/v1/candidates" -H "Authorization: Bearer $MANAGER_TOKEN")
CANDIDATE_ID=$(echo "$CANDIDATE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Candidate ID: $CANDIDATE_ID"

if [ -z "$CANDIDATE_ID" ]; then
  echo "⚠️ No candidates found, skipping offer tests"
else
  # Create offer
  echo ""
  echo "[2/7] Creating offer for DELETE test..."
  OFFER_RESPONSE=$(curl -s -X POST "http://localhost:8102/api/v1/offers" \
    -H "Authorization: Bearer $MANAGER_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"candidateId\":\"$CANDIDATE_ID\",\"position\":\"Test Position for DELETE\",\"salary\":50000,\"currency\":\"TRY\",\"startDate\":\"2025-12-01\"}")

  OFFER_ID=$(echo "$OFFER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "Offer created: $OFFER_ID"
  echo "Response: $OFFER_RESPONSE" | head -c 200

  if [ ! -z "$OFFER_ID" ]; then
    # Test DELETE offer
    echo ""
    echo "[3/7] Test: DELETE /offers/$OFFER_ID (MANAGER - SHOULD BE 200/204)"
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "http://localhost:8102/api/v1/offers/$OFFER_ID" \
      -H "Authorization: Bearer $MANAGER_TOKEN")
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
    BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")
    echo "Status: $HTTP_STATUS"
    echo "Body: $BODY"

    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "204" ]; then
      echo "✅ PASS: MANAGER can DELETE offers"
    elif [ "$HTTP_STATUS" = "403" ]; then
      echo "❌ FAIL: Got 403 - MANAGER should be able to delete offers (BUG!)"
    else
      echo "⚠️ Got $HTTP_STATUS (check response body)"
    fi
  else
    echo "⚠️ Offer creation failed, skipping delete test"
  fi
fi

# Get job posting ID for delete test (should fail)
echo ""
echo "[4/7] Test: DELETE job posting (MANAGER - SHOULD BE 403)"
JOB_ID="6d031be1-6be5-4303-bb12-403cbc491d0c"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "http://localhost:8102/api/v1/job-postings/$JOB_ID" \
  -H "Authorization: Bearer $MANAGER_TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "403" ]; then
  echo "✅ PASS: MANAGER correctly blocked from deleting job postings"
else
  echo "❌ FAIL: Expected 403, got $HTTP_STATUS (BUG - MANAGER should NOT delete job postings!)"
fi

# Create and delete interview
echo ""
echo "[5/7] Creating interview for DELETE test..."
INTERVIEW_RESPONSE=$(curl -s -X POST "http://localhost:8102/api/v1/interviews" \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"candidateId\":\"$CANDIDATE_ID\",\"scheduledAt\":\"2025-12-15T10:00:00Z\",\"type\":\"TECHNICAL\",\"notes\":\"Test interview for DELETE\"}")

INTERVIEW_ID=$(echo "$INTERVIEW_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Interview created: $INTERVIEW_ID"
echo "Response: $INTERVIEW_RESPONSE" | head -c 200

if [ ! -z "$INTERVIEW_ID" ] && [ "$INTERVIEW_ID" != "null" ]; then
  echo ""
  echo "[6/7] Test: DELETE /interviews/$INTERVIEW_ID (MANAGER - SHOULD BE 200/204)"
  RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "http://localhost:8102/api/v1/interviews/$INTERVIEW_ID" \
    -H "Authorization: Bearer $MANAGER_TOKEN")
  HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
  BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")
  echo "Status: $HTTP_STATUS"
  echo "Body: $BODY"

  if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "204" ]; then
    echo "✅ PASS: MANAGER can DELETE interviews"
  elif [ "$HTTP_STATUS" = "403" ]; then
    echo "❌ FAIL: Got 403 - MANAGER should be able to delete interviews (BUG!)"
  else
    echo "⚠️ Got $HTTP_STATUS"
  fi
else
  echo "⚠️ Interview creation failed, skipping delete test"
fi

# Test DELETE candidate (should fail)
echo ""
echo "[7/7] Test: DELETE candidate (MANAGER - SHOULD BE 403)"
if [ ! -z "$CANDIDATE_ID" ]; then
  RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "http://localhost:8102/api/v1/candidates/$CANDIDATE_ID" \
    -H "Authorization: Bearer $MANAGER_TOKEN")
  HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
  echo "Status: $HTTP_STATUS"
  if [ "$HTTP_STATUS" = "403" ]; then
    echo "✅ PASS: MANAGER correctly blocked from deleting candidates"
  else
    echo "❌ FAIL: Expected 403, got $HTTP_STATUS (BUG!)"
  fi
fi

echo ""
echo "=== DELETE Operations Tests Complete ==="
echo ""
echo "Summary:"
echo "- DELETE offers: MANAGER CAN ✅"
echo "- DELETE interviews: MANAGER CAN ✅"
echo "- DELETE job postings: MANAGER CANNOT ❌ (ADMIN only)"
echo "- DELETE candidates: MANAGER CANNOT ❌ (ADMIN only)"
