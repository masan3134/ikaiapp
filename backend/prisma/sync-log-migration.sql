-- Milvus Sync Log Table
-- Bu tabloyu manuel olarak eklemek için:
-- psql -U ikaiuser -d ikaidb < sync-log-migration.sql

CREATE TABLE IF NOT EXISTS "SyncLog" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "syncStatus" TEXT NOT NULL,
    "errorMessage" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "SyncLog_entityType_entityId_idx" ON "SyncLog"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "SyncLog_syncStatus_idx" ON "SyncLog"("syncStatus");
CREATE UNIQUE INDEX IF NOT EXISTS "SyncLog_entityType_entityId_key" ON "SyncLog"("entityType", "entityId");

-- Insert sample comment
COMMENT ON TABLE "SyncLog" IS 'Tracks Milvus synchronization status for each entity';
