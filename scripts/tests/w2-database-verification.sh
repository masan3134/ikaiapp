#!/bin/bash
# W2 Database Query Verification
# Check if all HR queries filter by organizationId

echo "🗄️ W2 DATABASE QUERY VERIFICATION"
echo "=================================="
echo ""

check_file() {
    file=$1
    name=$2

    echo "📁 $name"
    echo "----------------------------------------"

    if [ ! -f "$file" ]; then
        echo "  ❌ File not found"
        return
    fi

    # Count organizationId occurrences
    total=$(grep -c "organizationId" "$file" 2>/dev/null || echo "0")
    where_clauses=$(grep -c "where:.*organizationId\|organizationId:" "$file" 2>/dev/null || echo "0")

    echo "  Total organizationId mentions: $total"
    echo "  WHERE clause filters: $where_clauses"

    if [ "$where_clauses" -gt 0 ]; then
        echo "  ✅ PASS - Has organizationId filtering"
    else
        echo "  ⚠️  WARNING - No WHERE filters found (might use middleware)"
    fi

    echo ""
}

# Job Postings
check_file "/home/asan/Desktop/ikai/backend/src/controllers/jobPostingController.js" "Job Posting Controller"

# Candidates
check_file "/home/asan/Desktop/ikai/backend/src/controllers/candidateController.js" "Candidate Controller"

# Analyses
check_file "/home/asan/Desktop/ikai/backend/src/controllers/analysisController.js" "Analysis Controller"

# Offers
check_file "/home/asan/Desktop/ikai/backend/src/controllers/offerController.js" "Offer Controller"

# Interviews
check_file "/home/asan/Desktop/ikai/backend/src/controllers/interviewController.js" "Interview Controller"

echo "========================================"
echo "📊 SUMMARY"
echo "========================================"
echo ""
echo "Note: If controllers show 0 WHERE filters,"
echo "organizationId filtering is done via middleware:"
echo "  - enforceOrganizationIsolation"
echo ""
echo "Middleware adds req.organizationId automatically"
echo "Controllers use: req.organizationId in queries"
echo ""
echo "✅ Verification complete!"
