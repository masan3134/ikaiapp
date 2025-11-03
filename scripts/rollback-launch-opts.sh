#!/bin/bash
set -e

echo "🚨 EMERGENCY ROLLBACK - Launch Optimizations"
echo "=============================================="

# Step 1: Feature flags OFF
echo "Step 1: Disabling all features..."
cat > backend/.env.launch << EOF
RATE_LIMITER_ENABLED=false
INTENT_ROUTER_EXPANDED=false
METRICS_ENABLED=false
EOF

# Step 2: Restore .env
echo "Step 2: Restoring .env..."
cp backend/.env.before-launch backend/.env

# Step 3: Restart backend
echo "Step 3: Restarting backend..."
docker compose restart backend

# Step 4: Wait and verify
echo "Step 4: Verifying (10 seconds)..."
sleep 10
curl -f http://localhost:3001/health && echo "✅ Rollback successful" || echo "❌ Rollback failed!"

echo ""
echo "🚨 ROLLBACK COMPLETE"
