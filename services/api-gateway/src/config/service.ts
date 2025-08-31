import { Application } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { config } from ".";
import logger from "./logger";
import { ProxyErrorResponse, ServiceConfig } from "../types";

class ServiceProxy {
  private static readonly serviceConfigs: ServiceConfig[] = [
    {
      path: "/api/v1/user",
      url: config.USER_SERVICE,
      pathRewrite: { "^/api/v1/user": "" },
      name: "user-service",
      timeout: 5000,
    },
    {
      path: "/api/v1/chat",
      url: config.CHAT_SERVICE,
      pathRewrite: { "^/api/v1/chat": "" },
      name: "chat-service",
      timeout: 5000,
    },
    {
      path: "/api/v1/ai",
      url: config.AI_SERVICE,
      pathRewrite: { "^/api/v1/ai": "" },
      name: "ai-service",
      timeout: 10000, // AI operations might take longer
    },
    {
      path: "/api/v1/persistence",
      url: config.PERSISTENCE_SERVICE,
      pathRewrite: { "^/api/v1/persistence": "" },
      name: "persistence-service",
      timeout: 5000,
    },
  ];

  private static createProxyOptions(service: ServiceConfig): Options {
    return {
      target: service.url,
      changeOrigin: true,
      pathRewrite: service.pathRewrite,
      timeout: service.timeout || config.DEFAULT_TIMEOUT,
      logger: logger,
      on: {
        error: ServiceProxy.handleProxyError,
        proxyReq: ServiceProxy.handleProxyRequest,
        proxyRes: ServiceProxy.handleProxyResponse,
      },
    };
  }

  private static handleProxyError(err: Error, req: any, res: any): void {
    logger.error(`Proxy error for ${req.path}:`, {
      error: err.message,
      path: req.path,
      method: req.method,
    });

    const errorResponse: ProxyErrorResponse = {
      message: "Service unavailable",
      status: 503,
      timestamp: new Date().toISOString(),
    };

    if (!res.headersSent) {
      res
        .status(503)
        .setHeader("Content-Type", "application/json")
        .end(JSON.stringify(errorResponse));
    }
  }

  private static handleProxyRequest(proxyReq: any, req: any): void {
    logger.info(`Proxying request`, {
      originalPath: req.path,
      method: req.method,
      target: proxyReq.path,
    });
  }

  private static handleProxyResponse(proxyRes: any, req: any): void {
    logger.info(`Received response`, {
      path: req.path,
      method: req.method,
      statusCode: proxyRes.statusCode,
    });
  }

  public static setupProxy(app: Application): void {
    ServiceProxy.serviceConfigs.forEach((service) => {
      const proxyOptions = ServiceProxy.createProxyOptions(service);
      app.use(service.path, createProxyMiddleware(proxyOptions));
      logger.info(
        `Configured proxy for ${service.name} at ${service.path} -> ${service.url}`
      );
    });
  }
}

export const proxyServices = (app: Application): void => {
  ServiceProxy.setupProxy(app);
};
