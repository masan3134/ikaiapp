const { PrismaClient } = require('@prisma/client');
const Redis = require('redis');
const Minio = require('minio');

async function checkPostgres() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL connection successful.');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function checkRedis() {
  const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://redis:6379'
  });
  try {
    await redisClient.connect();
    await redisClient.ping();
    console.log('✅ Redis connection successful.');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  } finally {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  }
}

async function checkMinio() {
  const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'minio',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
  });
  try {
    const bucketName = process.env.MINIO_BUCKET || 'ikai-cv-files';
    const exists = await minioClient.bucketExists(bucketName);
    if (exists) {
      console.log('✅ MinIO connection and bucket check successful.');
    } else {
      console.error(`❌ MinIO connection successful, but bucket '${bucketName}' not found.`);
    }
  } catch (error) {
    console.error('❌ MinIO connection failed:', error);
  }
}

async function runChecks() {
  console.log('--- Running Connection Checks ---');
  await checkPostgres();
  await checkRedis();
  await checkMinio();
  console.log('--- Checks Complete ---');
}

runChecks();
