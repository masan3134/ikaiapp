#!/bin/bash
# Worker 3 - MANAGER Analytics Tests

MANAGER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGI2MDFhNy02NDQ1LTRlNWItYmVhYS00ZjJiNWUzYjMzMmUiLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc2MjIzMzU3NSwiZXhwIjoxNzYyODM4Mzc1fQ.UgVSytwk9735dsK1zPNV1o5u9XnvHQqlxXywaFoJABI"

# Get HR_SPECIALIST token for comparison
HR_TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test-hr_specialist@test-org-1.com\",\"password\":\"TestPass123!\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "=== Analytics RBAC Tests ==="
echo ""

# Test 1: MANAGER access analytics
echo "[1/6] Test: GET /analytics/summary (MANAGER - SHOULD BE 200)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "http://localhost:8102/api/v1/analytics/summary" -H "Authorization: Bearer $MANAGER_TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: MANAGER can access analytics/summary"
else
  echo "❌ FAIL: Expected 200, got $HTTP_STATUS (BUG!)"
fi

echo ""
echo "[2/6] Test: GET /analytics/time-to-hire (MANAGER - SHOULD BE 200)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "http://localhost:8102/api/v1/analytics/time-to-hire" -H "Authorization: Bearer $MANAGER_TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: MANAGER can access analytics/time-to-hire"
else
  echo "❌ FAIL: Expected 200, got $HTTP_STATUS"
fi

echo ""
echo "[3/6] Test: GET /analytics/funnel (MANAGER - SHOULD BE 200)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "http://localhost:8102/api/v1/analytics/funnel" -H "Authorization: Bearer $MANAGER_TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ PASS: MANAGER can access analytics/funnel"
else
  echo "❌ FAIL: Expected 200, got $HTTP_STATUS"
fi

# Test 2: HR_SPECIALIST blocked
echo ""
echo "[4/6] Test: GET /analytics/summary (HR_SPECIALIST - SHOULD BE 403)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "http://localhost:8102/api/v1/analytics/summary" -H "Authorization: Bearer $HR_TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "403" ]; then
  echo "✅ PASS: HR_SPECIALIST correctly blocked from analytics"
else
  echo "❌ FAIL: Expected 403, got $HTTP_STATUS (BUG - security risk!)"
fi

echo ""
echo "[5/6] Test: GET /analytics/time-to-hire (HR_SPECIALIST - SHOULD BE 403)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "http://localhost:8102/api/v1/analytics/time-to-hire" -H "Authorization: Bearer $HR_TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "403" ]; then
  echo "✅ PASS: HR_SPECIALIST blocked"
else
  echo "❌ FAIL: Expected 403, got $HTTP_STATUS"
fi

echo ""
echo "[6/6] Test: GET /analytics/funnel (HR_SPECIALIST - SHOULD BE 403)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "http://localhost:8102/api/v1/analytics/funnel" -H "Authorization: Bearer $HR_TOKEN")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "403" ]; then
  echo "✅ PASS: HR_SPECIALIST blocked"
else
  echo "❌ FAIL: Expected 403, got $HTTP_STATUS"
fi

echo ""
echo "=== Analytics Tests Complete ==="
