# Containerization in IntelliColab

## Overview

Containerization is a key aspect of IntelliColab's architecture, enabling consistent deployment across environments, efficient resource utilization, and simplified scaling. Docker and Docker Compose are used to containerize all services and manage their deployment.

## Docker Basics

Docker provides a way to package applications and their dependencies into a standardized unit called a container. Each container includes:

- Application code
- Runtime environment
- System tools
- Libraries
- Settings

### Key Docker Concepts

1. **Images**: Read-only templates used to create containers
2. **Containers**: Running instances of Docker images
3. **Dockerfile**: Script of instructions to build a Docker image
4. **Registry**: Repository for storing and distributing Docker images

## Docker in IntelliColab

Each service in IntelliColab has its own Dockerfile, defining how the service should be containerized.

### API Gateway Dockerfile

```dockerfile
# From services/api-gateway/Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production

# Run the application
CMD ["node", "dist/server.js"]
```

### Best Practices in Dockerfiles

1. **Use specific image versions**: Use specific tags instead of `latest` to ensure consistency
2. **Multi-stage builds**: Use multiple build stages to create smaller production images
3. **Layer caching**: Order Dockerfile commands to maximize cache usage
4. **Non-root user**: Run containers as a non-root user for security
5. **Health checks**: Include health checks to verify service status

#### Example of Multi-stage Build

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 8000
ENV NODE_ENV=production

# Run as non-root user
USER node

CMD ["node", "dist/server.js"]
```

## Docker Compose

Docker Compose is used to define and manage multi-container Docker applications. In IntelliColab, it orchestrates the entire local development environment.

### Docker Compose File

```yaml
# From docker-compose.yml
version: "3.8"

services:
  # API Gateway
  api-gateway:
    build:
      context: ./services/api-gateway
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - PORT=8000
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./services/api-gateway:/app
      - /app/node_modules
    depends_on:
      - redis
    restart: unless-stopped

  # Auth Service
  auth-service:
    build:
      context: ./services/auth-service
    environment:
      - NODE_ENV=development
      - PORT=3001
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./services/auth-service:/app
      - /app/node_modules
    depends_on:
      - redis
    restart: unless-stopped

  # Redis
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: ["redis-server", "--appendonly", "yes"]
    restart: unless-stopped

  # Prometheus
  prometheus:
    image: prom/prometheus:v2.30.3
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    restart: unless-stopped

  # Grafana
  grafana:
    image: grafana/grafana:8.2.2
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - prometheus
    restart: unless-stopped

  # Loki
  loki:
    image: grafana/loki:2.4.1
    ports:
      - "3100:3100"
    volumes:
      - loki-data:/loki
    restart: unless-stopped

  # Redis Insights
  redis-insight:
    image: redislabs/redisinsight:latest
    ports:
      - "8001:8001"
    depends_on:
      - redis
    restart: unless-stopped

volumes:
  redis-data:
  prometheus-data:
  grafana-data:
  loki-data:
```

### Key Docker Compose Concepts

1. **Services**: The containers that make up your application
2. **Volumes**: Persistent data storage that exists outside containers
3. **Networks**: How containers communicate with each other
4. **Environment variables**: Configuration passed to containers
5. **Dependencies**: Order of service startup

## Development vs. Production

Docker configurations often differ between development and production environments:

### Development

- Volume mounts for live code editing
- Debug tools and ports exposed
- Non-optimized builds for faster iteration
- Development-specific environment variables

### Production

- Optimized, multi-stage builds
- Only necessary ports exposed
- Scaled deployments with replicas
- Production-specific environment variables
- Resource constraints defined

## Container Orchestration

For production environments, a container orchestrator like Kubernetes is recommended:

1. **Automatic scaling**: Adjust the number of container instances based on load
2. **Self-healing**: Restart or replace failed containers
3. **Service discovery**: Automatically find and connect to services
4. **Load balancing**: Distribute traffic across container instances
5. **Rolling updates**: Update services without downtime

## Docker Network Architecture

Docker Compose creates a default network that allows containers to communicate using service names as hostnames:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  API Gateway │     │ Auth Service │     │ Chat Service │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────┬───────┴────────────┬──────┘
                    │                    │
           ┌────────┴────────┐  ┌────────┴────────┐
           │     Redis      │  │   Prometheus    │
           └─────────────────┘  └─────────────────┘
```

Services can communicate directly:

```javascript
// Auth service can be reached at http://auth-service:3001
fetch("http://auth-service:3001/validate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token }),
});
```

## Data Persistence

Docker containers are ephemeral, meaning any data not stored in a volume is lost when the container stops. IntelliColab uses named volumes to persist data:

```yaml
volumes:
  redis-data: # Persists Redis data
  prometheus-data: # Persists Prometheus metrics
  grafana-data: # Persists Grafana dashboards
  loki-data: # Persists Loki logs
```

## Security Best Practices

1. **Minimal base images**: Use Alpine or distroless images to reduce attack surface
2. **Regular updates**: Keep base images updated with security patches
3. **Scan images**: Use tools like Trivy or Clair to scan for vulnerabilities
4. **Least privilege**: Run containers with minimal permissions
5. **Secure secrets**: Use environment variables or secret management for sensitive data

## Practical Exercises

1. Modify the API Gateway Dockerfile to use a multi-stage build
2. Add a health check to each service in the Docker Compose file
3. Create a production-ready Docker Compose configuration
4. Implement a basic Kubernetes deployment for IntelliColab
5. Set up a CI/CD pipeline to build and publish Docker images

## Common Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs for a specific service
docker-compose logs -f api-gateway

# Stop all services
docker-compose down

# Rebuild a specific service
docker-compose build auth-service

# Execute a command in a running container
docker-compose exec api-gateway sh

# View running containers
docker-compose ps
```

## Further Reading

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [Production-Ready Docker Compose](https://docs.docker.com/compose/production/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
