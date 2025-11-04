#!/bin/bash

echo "Testing template creation..."

# Get token
TOKEN=$(python3 -c "
import requests
r = requests.post('http://localhost:8102/api/v1/auth/login', json={'email': 'info@gaiai.ai', 'password': '23235656'})
print(r.json()['token'])
" 2>/dev/null)

echo "Token: ${TOKEN:0:30}..."

# Create template
curl -s -X POST "http://localhost:8102/api/v1/offer-templates" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Senior Developer Template",
    "description": "Template for senior developer offers",
    "position": "Senior Software Developer",
    "department": "Engineering",
    "salaryMin": 60000,
    "salaryMax": 90000,
    "currency": "TRY",
    "workType": "office",
    "benefits": {"insurance": true, "meal": 1000, "transportation": true, "gym": false, "education": true},
    "terms": "Standard employment terms apply",
    "emailSubject": "Job Offer - {position}",
    "emailBody": "We are pleased to offer you the position of {position}"
  }' | python3 -m json.tool

echo ""
echo "Template creation test completed!"
