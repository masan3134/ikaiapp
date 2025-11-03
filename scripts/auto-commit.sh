#!/bin/bash

# IKAI Auto Commit & Push Script
# Automatically commits and pushes changes to both local and remote repository

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 IKAI Auto Commit & Push${NC}"
echo "================================"

# Get commit message from argument or use default
COMMIT_MSG="${1:-Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')}"

# Check if there are changes
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}ℹ️  No changes to commit${NC}"
    exit 0
fi

echo -e "${GREEN}📝 Changes detected${NC}"

# Show status
echo ""
git status --short

# Add all changes
echo ""
echo -e "${GREEN}➕ Adding all changes...${NC}"
git add -A

# Commit
echo -e "${GREEN}💾 Committing...${NC}"
git commit -m "$COMMIT_MSG"

# Push to remote
echo ""
echo -e "${GREEN}🚀 Pushing to remote (origin/main)...${NC}"
git push origin main

echo ""
echo -e "${GREEN}✅ Successfully committed and pushed!${NC}"
echo "================================"
