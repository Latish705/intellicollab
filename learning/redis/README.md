# Redis Integration in IntelliColab

## Overview

Redis is an in-memory data structure store used in IntelliColab for caching, message brokering, and implementing distributed patterns like rate limiting. Its high performance and versatility make it an ideal solution for these use cases in a microservices architecture.

## Key Use Cases

### 1. Caching

Redis provides fast, in-memory caching to reduce database load and improve response times:

```typescript
// From api-gateway/src/services/user-service.ts
import { redisClient } from "../config/redis";

export async function getUserProfile(userId: string) {
  // Try to get from cache first
  const cachedProfile = await redisClient.get(`user:${userId}`);

  if (cachedProfile) {
    return JSON.parse(cachedProfile);
  }

  // If not in cache, fetch from database
  const profile = await fetchUserProfileFromDatabase(userId);

  // Cache the result for 10 minutes
  await redisClient.set(`user:${userId}`, JSON.stringify(profile), "EX", 600);

  return profile;
}
```

#### Caching Strategies

1. **Cache-Aside (Lazy Loading)**: Load data into the cache on demand, as shown above
2. **Write-Through**: Update the cache whenever the database is updated
3. **Write-Behind**: Write to cache first, then asynchronously update the database
4. **Refresh-Ahead**: Predict which cache entries will be needed and refresh them before expiration

#### Cache Invalidation

Proper cache invalidation is crucial to prevent stale data:

```typescript
// When user profile is updated
export async function updateUserProfile(
  userId: string,
  profileData: UserProfile
) {
  // Update in database
  await updateUserProfileInDatabase(userId, profileData);

  // Invalidate cache
  await redisClient.del(`user:${userId}`);

  return profileData;
}
```

### 2. Rate Limiting

Redis is used to implement rate limiting in the API Gateway:

```typescript
// From api-gateway/src/middlewares/rate-limiter.middleware.ts
import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const key = `rate-limit:${ip}`;

  try {
    // Increment the counter for this IP
    const requests = await redisClient.incr(key);

    // If this is the first request, set an expiration
    if (requests === 1) {
      await redisClient.expire(key, 60); // 1 minute window
    }

    // Check if the limit has been exceeded
    if (requests > 100) {
      // 100 requests per minute
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: await redisClient.ttl(key),
      });
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    // If Redis is down, allow the request
    next();
  }
};
```

#### Advanced Rate Limiting

For more sophisticated rate limiting, consider using the Token Bucket algorithm:

```typescript
// Token Bucket implementation
export const tokenBucketRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const key = `token-bucket:${ip}`;

  try {
    const now = Date.now();
    const bucketSize = 10; // Maximum tokens
    const refillRate = 1; // Tokens per second

    // Get current bucket state
    let bucket = await redisClient.hgetall(key);

    if (!bucket.tokens) {
      // Initialize bucket if it doesn't exist
      bucket = {
        tokens: bucketSize.toString(),
        lastRefill: now.toString(),
      };
    }

    // Calculate token refill
    const tokens = parseInt(bucket.tokens);
    const lastRefill = parseInt(bucket.lastRefill);
    const elapsedSeconds = (now - lastRefill) / 1000;
    const refill = Math.floor(elapsedSeconds * refillRate);

    // Update bucket tokens
    const newTokens = Math.min(tokens + refill, bucketSize);

    // Take a token if available
    if (newTokens >= 1) {
      await redisClient.hmset(key, {
        tokens: (newTokens - 1).toString(),
        lastRefill: now.toString(),
      });

      // Set expiration to clean up inactive buckets
      await redisClient.expire(key, 3600); // 1 hour

      next();
    } else {
      res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil(1 / refillRate),
      });
    }
  } catch (err) {
    console.error("Rate limiter error:", err);
    next();
  }
};
```

### 3. Message Broker

Redis pub/sub enables asynchronous communication between microservices:

```typescript
// Publisher (auth-service)
import { createClient } from "redis";

const publisher = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

async function publishUserCreated(userId: string, userData: any) {
  await publisher.connect();

  await publisher.publish(
    "user:created",
    JSON.stringify({
      userId,
      userData,
      timestamp: Date.now(),
    })
  );

  await publisher.disconnect();
}

// Subscriber (email-service)
import { createClient } from "redis";

const subscriber = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

async function subscribeToUserEvents() {
  await subscriber.connect();

  await subscriber.subscribe("user:created", async (message) => {
    const data = JSON.parse(message);

    // Send welcome email
    await sendWelcomeEmail(data.userData.email);
  });
}
```

#### Redis Streams

For more advanced message processing, Redis Streams provide consumer groups and message persistence:

```typescript
// Producer
async function addUserEvent(userId: string, event: string, data: any) {
  await redisClient.xadd(
    "user-events",
    "*", // Auto-generate ID
    "userId",
    userId,
    "event",
    event,
    "data",
    JSON.stringify(data),
    "timestamp",
    Date.now().toString()
  );
}

// Consumer Group
async function setupConsumerGroup() {
  try {
    // Create stream if not exists with MKSTREAM
    await redisClient.xgroup(
      "CREATE",
      "user-events",
      "email-service",
      "0",
      "MKSTREAM"
    );
  } catch (err) {
    // Group already exists
  }
}

// Consumer
async function processUserEvents() {
  await setupConsumerGroup();

  while (true) {
    try {
      // Read new messages for this consumer
      const results = await redisClient.xreadgroup(
        "GROUP",
        "email-service",
        "consumer-1",
        "COUNT",
        "10",
        "BLOCK",
        "2000",
        "STREAMS",
        "user-events",
        ">"
      );

      if (results) {
        const [stream, messages] = results[0];

        for (const [id, fields] of messages) {
          // Process fields (convert array to object)
          const message = {};
          for (let i = 0; i < fields.length; i += 2) {
            message[fields[i]] = fields[i + 1];
          }

          // Process message
          await processMessage(message);

          // Acknowledge message
          await redisClient.xack("user-events", "email-service", id);
        }
      }
    } catch (err) {
      console.error("Error processing messages:", err);
      // Sleep before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
```

### 4. Session Store

Redis is ideal for storing user sessions in a distributed environment:

```typescript
// From api-gateway/src/app.ts
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import { redisClient } from "./config/redis";

const app = express();

const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
```

## Redis Configuration

The Redis client is configured in a centralized location:

```typescript
// From api-gateway/src/config/redis.ts
import { createClient } from "redis";
import { logger } from "./logger";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: redisUrl,
});

// Connect to Redis
(async () => {
  redisClient.on("error", (err) => {
    logger.error("Redis connection error", { error: err.message });
  });

  redisClient.on("connect", () => {
    logger.info("Connected to Redis");
  });

  await redisClient.connect();
})();

// Clean up on application shutdown
process.on("SIGINT", async () => {
  await redisClient.disconnect();
  process.exit(0);
});
```

## Redis Data Structures

Redis supports various data structures, each suited for different use cases:

1. **Strings**: Simple key-value storage, good for caching scalar values
2. **Lists**: Collections of strings, good for queues and stacks
3. **Sets**: Unordered collections of unique strings, good for tagging and relationships
4. **Sorted Sets**: Sets with scores, good for leaderboards and priority queues
5. **Hashes**: Maps of field-value pairs, good for storing objects
6. **Streams**: Append-only log data structure, good for message queues
7. **Geospatial Indexes**: Store and query location data
8. **Bitmaps**: Bit-level operations, good for compact data representation
9. **HyperLogLog**: Probabilistic data structure for cardinality estimation

## Redis Persistence

Redis provides multiple persistence options:

1. **RDB (Redis Database)**: Point-in-time snapshots, good for backups
2. **AOF (Append-Only File)**: Logs every write operation, good for durability
3. **RDB + AOF**: Combines both approaches for optimal durability and performance

In IntelliColab, the production environment uses RDB + AOF:

```
# redis.conf
save 900 1     # Save if at least 1 key changed in 15 minutes
save 300 10    # Save if at least 10 keys changed in 5 minutes
save 60 10000  # Save if at least 10000 keys changed in 1 minute

appendonly yes
appendfsync everysec
```

## Redis in Docker Compose

Redis is configured in the IntelliColab Docker Compose file:

```yaml
# docker-compose.yml
services:
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: ["redis-server", "--appendonly", "yes"]
    restart: unless-stopped

  redis-insight:
    image: redislabs/redisinsight:latest
    ports:
      - "8001:8001"
    depends_on:
      - redis
    restart: unless-stopped

volumes:
  redis-data:
```

## Practical Exercises

1. Implement a distributed locking mechanism using Redis
2. Create a leaderboard using Redis Sorted Sets
3. Build a simple chat application using Redis Pub/Sub
4. Implement a job queue with Redis Lists or Streams
5. Create a rate limiter with different limits for authenticated and anonymous users

## Best Practices

1. **Use connection pooling**: Reuse Redis connections to reduce overhead
2. **Set appropriate TTLs**: Always set expiration times for cached data
3. **Consider Redis Cluster**: For high availability and horizontal scaling
4. **Monitor Redis metrics**: Track memory usage, hit/miss rates, and connection count
5. **Use Lua scripts**: For atomic operations involving multiple commands

## Further Reading

- [Redis Documentation](https://redis.io/documentation)
- [Redis Best Practices](https://redis.io/docs/management/optimization/benchmarks/)
- [Redis in Action](https://redislabs.com/ebook/redis-in-action/) by Josiah L. Carlson
- [Pattern: Caching](https://microservices.io/patterns/caching.html)
