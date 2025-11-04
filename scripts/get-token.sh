#!/bin/bash

# IKAI Token Helper Script
# Usage: ./scripts/get-token.sh [ROLE]
# Example: TOKEN=$(./scripts/get-token.sh USER)

ROLE=${1:-USER}

case $ROLE in
  USER)
    EMAIL="test-user@test-org-1.com"
    PASS="TestPass123!"
    ;;
  HR_SPECIALIST)
    EMAIL="test-hr_specialist@test-org-1.com"
    PASS="TestPass123!"
    ;;
  MANAGER)
    EMAIL="test-manager@test-org-1.com"
    PASS="TestPass123!"
    ;;
  ADMIN)
    EMAIL="test-admin@test-org-1.com"
    PASS="TestPass123!"
    ;;
  SUPER_ADMIN)
    EMAIL="info@gaiai.ai"
    PASS="23235656"
    ;;
  *)
    echo "Error: Invalid role. Use: USER, HR_SPECIALIST, MANAGER, ADMIN, SUPER_ADMIN" >&2
    exit 1
    ;;
esac

# Login and extract token
curl -s -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" | \
  jq -r '.token'
