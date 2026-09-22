const isProduction = process.env.NODE_ENV === 'production';

export function getRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name];

  if (value && value.trim().length > 0) {
    return value.trim();
  }

  if (isProduction) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Missing environment variable: ${name}`);
}

export function getJwtSecret(): string {
  return getRequiredEnv('JWT_SECRET', 'dev-local-jwt-secret-change-me');
}

export function getAuthCredentialValue(name: string, fallback: string): string {
  return getRequiredEnv(name, fallback);
}
