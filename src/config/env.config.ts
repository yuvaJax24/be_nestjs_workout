export interface AppConfig {
  nodeEnv: string;
  port: number;
  corsOrigins: string[];
}

export const envConfig = (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
});

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const port = Number.parseInt(String(config.PORT ?? 3000), 10);

  if (Number.isNaN(port) || port <= 0 || port > 65535) {
    throw new Error('Invalid PORT environment variable. PORT must be a valid number between 1 and 65535.');
  }

  return {
    ...config,
    PORT: port,
  };
}
