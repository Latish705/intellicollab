# API Gateway in intellicollab

## Overview

The API Gateway serves as the single entry point for all client requests in the intellicollab platform. It abstracts the underlying microservice architecture from clients and provides cross-cutting concerns like authentication, rate limiting, and request routing.

## Key Responsibilities

### 1. Request Routing

The API Gateway routes incoming requests to the appropriate microservice based on the URL path.

```typescript
// From app.ts
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { serviceConfig } from "./config/service";

const app = express();

// Dynamic service routing based on configuration
Object.entries(serviceConfig).forEach(([path, config]) => {
  app.use(
    `/${path}`,
    createProxyMiddleware({
      target: config.url,
      changeOrigin: true,
      pathRewrite: { [`^/${path}`]: "" },
    })
  );
});
```

### 2. Rate Limiting

To protect backend services from abuse, the API Gateway implements rate limiting:

```typescript
// From rate-limiter.middleware.ts
import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const key = `rate-limit:${ip}`;

  const requests = await redisClient.incr(key);

  if (requests === 1) {
    await redisClient.expire(key, 60); // 1 minute window
  }

  if (requests > 100) {
    // 100 requests per minute
    return res.status(429).send("Too many requests");
  }

  next();
};

// Usage in app.ts
app.use(rateLimiter);
```

### 3. Authentication Middleware

The API Gateway verifies JWT tokens before forwarding requests to protected services:

```typescript
// From auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).send('Invalid or expired token');
  }
};

// Usage for protected routes
app.use('/users', authenticateJWT, createProxyMiddleware({ ... }));
```

### 4. Error Handling

Centralized error handling for all services:

```typescript
// From error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error processing request: ${err.message}`, {
    method: req.method,
    path: req.path,
    error: err.stack,
  });

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
};

// Usage in app.ts
app.use(errorHandler);
```

### 5. Logging and Monitoring

The API Gateway logs all requests and collects metrics:

```typescript
// From logging.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    logger.info(`${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers["user-agent"],
    });
  });

  next();
};

// Usage in app.ts
app.use(requestLogger);
```

## Configuration

The API Gateway is configured using environment variables and configuration files:

```typescript
// From config/index.ts
export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

// Service routing configuration
// From config/service.ts
export const serviceConfig = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    timeout: 5000,
  },
  chat: {
    url: process.env.CHAT_SERVICE_URL || "http://localhost:3002",
    timeout: 10000,
  },
};
```

## Practical Exercises

1. Implement a circuit breaker pattern in the API Gateway to handle service failures gracefully.
2. Add request transformation middleware to normalize request formats before forwarding to services.
3. Implement API versioning to support multiple versions of backend services.

## Best Practices

1. **Keep it Light**: The API Gateway should focus on routing, security, and cross-cutting concerns, not business logic.
2. **Avoid Single Point of Failure**: Consider deploying multiple instances of the API Gateway behind a load balancer.
3. **Throttle at the Edge**: Implement rate limiting as early as possible in the request processing pipeline.
4. **Comprehensive Logging**: Log all requests, including metadata like client IP, user agent, and timing information.
5. **Cache When Possible**: Use response caching for frequently accessed, read-only resources.

## Further Reading

- [Pattern: API Gateway](https://microservices.io/patterns/apigateway.html)
- [Building Microservices: Designing Fine-Grained Systems](https://www.oreilly.com/library/view/building-microservices/9781491950340/) - Chapter 5
- [Express.js Documentation](https://expressjs.com/)
