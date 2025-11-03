#!/bin/bash

# IKAI Auto Git Commit Script
# Automatically commits all changes with smart commit messages
# Usage: ./scripts/auto-git-commit.sh

echo "🔄 IKAI Auto-Commit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if in git repo
if [ ! -d ".git" ]; then
  echo "❌ Not a git repository"
  exit 1
fi

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ No changes to commit"
  exit 0
fi

# Count changes
MODIFIED=$(git status --porcelain | grep '^ M' | wc -l)
ADDED=$(git status --porcelain | grep '^??' | wc -l)
DELETED=$(git status --porcelain | grep '^ D' | wc -l)

# Generate commit message
DATE=$(date '+%Y-%m-%d %H:%M:%S')
TOTAL=$((MODIFIED + ADDED + DELETED))

if [ $TOTAL -eq 0 ]; then
  echo "✅ No changes to commit"
  exit 0
fi

# Build message
MESSAGE="Auto-commit: IKAI Development Changes

📊 Changes:
- Modified: $MODIFIED files
- Added: $ADDED files
- Deleted: $DELETED files

🕐 Date: $DATE
🤖 Auto-committed by IKAI system
"

# Git add all
git add .

# Commit
git commit -m "$MESSAGE"

if [ $? -eq 0 ]; then
  echo "✅ Changes committed successfully!"
  echo "   Modified: $MODIFIED | Added: $ADDED | Deleted: $DELETED"
  echo ""
  echo "📝 Last commit:"
  git log -1 --oneline
else
  echo "❌ Commit failed"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
