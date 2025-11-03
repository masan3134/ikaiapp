#!/bin/sh
set -e

echo "🔍 Checking node_modules..."

# Check if node_modules exists and has next binary
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo "✅ Dependencies installed"
else
  echo "✅ node_modules already exists"
fi

echo "🚀 Starting Next.js dev server..."
exec npm run dev
