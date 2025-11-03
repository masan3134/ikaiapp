/**
 * Environment Safety Check - Prevents Database Mixups
 * Validates that development doesn't use production database
 */

const chalk = require('chalk');

class EnvironmentCheck {
  static validate() {
    const env = process.env.NODE_ENV || 'development';
    const dbUrl = process.env.DATABASE_URL || '';

    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.bold('🔍 IKAI Environment Check'));
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

    // Show environment
    const envIcon = env === 'production' ? '☁️' : '🖥️';
    const envColor = env === 'production' ? chalk.red : chalk.green;
    console.log(envColor(`${envIcon}  Environment: ${env.toUpperCase()}`));

    // Critical check: Production cannot use localhost
    if (env === 'production' && dbUrl.includes('localhost')) {
      console.log(chalk.red.bold('\n🚨 CRITICAL ERROR: PRODUCTION CANNOT USE LOCALHOST DATABASE!'));
      console.log(chalk.yellow('Database URL contains "localhost" but NODE_ENV is "production"'));
      console.log(chalk.yellow(`DATABASE_URL: ${dbUrl.substring(0, 30)}...`));
      console.log(chalk.red('\n❌ Server startup aborted for safety.'));
      console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      process.exit(1);
    }

    // Warning: Development using remote database
    if (env === 'development' && !dbUrl.includes('localhost')) {
      console.log(chalk.yellow('\n⚠️  WARNING: Development using remote database!'));
      console.log(chalk.yellow('This is allowed but be careful with data modifications.'));
      console.log(chalk.yellow(`Database: ${dbUrl.substring(0, 50)}...`));
    }

    // Show database info (masked)
    const dbInfo = this.parseDatabaseUrl(dbUrl);
    console.log(chalk.cyan(`📊 Database: ${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`));

    // Show Redis info
    const redisUrl = process.env.REDIS_URL || 'not configured';
    if (redisUrl !== 'not configured') {
      const redisHost = redisUrl.includes('localhost') ? 'localhost' : 'remote';
      console.log(chalk.cyan(`🔴 Redis: ${redisHost}`));
    }

    // Show MinIO info
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'not configured';
    console.log(chalk.cyan(`📦 MinIO: ${minioEndpoint}`));

    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    return true;
  }

  static parseDatabaseUrl(url) {
    try {
      const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
      const match = url.match(regex);

      if (match) {
        return {
          user: match[1],
          host: match[3],
          port: match[4],
          database: match[5]
        };
      }
    } catch (error) {
      // Ignore parsing errors
    }

    return {
      host: 'unknown',
      port: 'unknown',
      database: 'unknown'
    };
  }

  static getEnvironmentInfo() {
    return {
      environment: process.env.NODE_ENV || 'development',
      isProduction: process.env.NODE_ENV === 'production',
      isDevelopment: process.env.NODE_ENV !== 'production',
      database: this.parseDatabaseUrl(process.env.DATABASE_URL || ''),
      redis: process.env.REDIS_URL || 'not configured',
      minio: process.env.MINIO_ENDPOINT || 'not configured'
    };
  }
}

module.exports = EnvironmentCheck;
