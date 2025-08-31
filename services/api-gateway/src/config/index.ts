interface Config {
  SERVICE_NAME: string;
  PORT: number;
  DEFAULT_TIMEOUT: number;
  AUTH_JWT_SECRET: string;
  GATEWAY_JWT_SECRET: string;
  GATEWAY_JWT_EXPIRES_IN: string;
  LOG_LEVEL: string;
  REDIS_URL: string;
  USER_SERVICE: string;
  CHAT_SERVICE: string;
  AI_SERVICE: string;
  PERSISTENCE_SERVICE: string;
  NODE_ENV: string;
}

export const config: Config = {
  SERVICE_NAME: require("../../package.json").name,
  PORT: Number(process.env.PORT) || 3000,
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT || "30000"),
  AUTH_JWT_SECRET:
    process.env.AUTH_JWT_SECRET || "your-default-auth-secret-key",
  GATEWAY_JWT_SECRET:
    process.env.GATEWAY_JWT_SECRET || "your-default-gateway-secret-key",
  GATEWAY_JWT_EXPIRES_IN: process.env.GATEWAY_JWT_EXPIRES_IN || "1m",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  USER_SERVICE: process.env.USER_SERVICE_URL || "http://localhost:4001",
  CHAT_SERVICE: process.env.CHAT_SERVICE_URL || "http://localhost:4003",
  AI_SERVICE: process.env.AI_SERVICE_URL || "http://localhost:4004",
  PERSISTENCE_SERVICE:
    process.env.PERSISTENCE_SERVICE_URL || "http://localhost:4005",
  NODE_ENV: process.env.NODE_ENV || "development",
};
