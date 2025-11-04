#!/bin/bash
# Worker 3 - MANAGER RBAC Test Script

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGI2MDFhNy02NDQ1LTRlNWItYmVhYS00ZjJiNWUzYjMzMmUiLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc2MjIzMzU3NSwiZXhwIjoxNzYyODM4Mzc1fQ.UgVSytwk9735dsK1zPNV1o5u9XnvHQqlxXywaFoJABI"

echo "=== Worker 3: MANAGER RBAC Tests ==="
echo ""

# Get IDs
echo "[1/7] Getting test data IDs..."
JOB_ID="6d031be1-6be5-4303-bb12-403cbc491d0c"
echo "Job ID: $JOB_ID"

# Test 1: DELETE Job Posting (should be 403)
echo ""
echo "[2/7] Test: DELETE job posting (SHOULD BE 403 - ADMIN only)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "http://localhost:8102/api/v1/job-postings/$JOB_ID" -H "Authorization: Bearer $TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")
echo "Status: $HTTP_STATUS"
echo "Body: $BODY"
if [ "$HTTP_STATUS" = "403" ]; then
  echo "✅ PASS: MANAGER correctly blocked from deleting job postings"
else
  echo "❌ FAIL: Expected 403, got $HTTP_STATUS (BUG!)"
fi

# Test 2: GET Offers
echo ""
echo "[3/7] Getting offers for DELETE test..."
OFFERS_RESPONSE=$(curl -s -X GET "http://localhost:8102/api/v1/offers" -H "Authorization: Bearer $TOKEN")
echo "$OFFERS_RESPONSE" | head -c 300
OFFER_ID=$(echo "$OFFERS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo ""
echo "Offer ID: $OFFER_ID"

# Test 3: DELETE Offer (should be 200/204)
if [ ! -z "$OFFER_ID" ] && [ "$OFFER_ID" != "null" ]; then
  echo ""
  echo "[4/7] Test: DELETE offer (SHOULD BE 200/204 - MANAGER CAN DELETE!)"
  RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "http://localhost:8102/api/v1/offers/$OFFER_ID" -H "Authorization: Bearer $TOKEN")
  HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
  BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")
  echo "Status: $HTTP_STATUS"
  echo "Body: $BODY"
  if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "204" ]; then
    echo "✅ PASS: MANAGER can delete offers"
  elif [ "$HTTP_STATUS" = "403" ]; then
    echo "❌ FAIL: Got 403 - MANAGER should be able to delete offers (BUG!)"
  else
    echo "⚠️ Got $HTTP_STATUS (check if offer exists or other error)"
  fi
else
  echo "[4/7] SKIP: No offers found (create one to test delete)"
fi

# Test 4: GET Analytics (ANALYTICS_VIEWERS)
echo ""
echo "[5/7] Test: GET analytics/offers (SHOULD BE 200 - ANALYTICS_VIEWERS)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "http://localhost:8102/api/v1/analytics/offers" -H "Authorization: Bearer $TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")
echo "Status: $HTTP_STATUS"
echo "Body: $BODY" | head -c 200
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: MANAGER can access analytics"
elif [ "$HTTP_STATUS" = "403" ]; then
  echo "❌ FAIL: Got 403 - MANAGER should access analytics (BUG!)"
elif [ "$HTTP_STATUS" = "404" ]; then
  echo "⚠️ 404: Analytics endpoint might not exist yet"
else
  echo "⚠️ Got $HTTP_STATUS"
fi

# Test 5: GET Team (read-only)
echo ""
echo "[6/7] Test: GET team (SHOULD BE 200 - MANAGER can view)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "http://localhost:8102/api/v1/team" -H "Authorization: Bearer $TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")
echo "Status: $HTTP_STATUS"
echo "Body: $BODY" | head -c 200
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: MANAGER can view team"
elif [ "$HTTP_STATUS" = "403" ]; then
  echo "❌ FAIL: Got 403 - MANAGER should view team (BUG!)"
else
  echo "⚠️ Got $HTTP_STATUS"
fi

# Test 6: POST Team Invite (should be 403)
echo ""
echo "[7/7] Test: POST team/invite (SHOULD BE 403 - ADMIN only)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "http://localhost:8102/api/v1/team/invite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","role":"HR_SPECIALIST"}')
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")
echo "Status: $HTTP_STATUS"
echo "Body: $BODY"
if [ "$HTTP_STATUS" = "403" ]; then
  echo "✅ PASS: MANAGER correctly blocked from inviting team"
else
  echo "❌ FAIL: Expected 403, got $HTTP_STATUS (BUG!)"
fi

echo ""
echo "=== Tests Complete ==="
