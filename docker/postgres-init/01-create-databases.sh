#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE n8ndb;
    GRANT ALL PRIVILEGES ON DATABASE n8ndb TO ikaiuser;
EOSQL

echo "Database n8ndb created successfully!"
