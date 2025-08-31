# Observability in IntelliColab

## Overview

Observability is a critical aspect of microservices architecture, providing insights into the behavior, performance, and health of distributed systems. IntelliColab implements a comprehensive observability stack consisting of metrics, logging, and tracing to ensure all aspects of the system are monitored and troubleshooting is efficient.

## Components of the Observability Stack

### 1. Prometheus - Metrics Collection

Prometheus is an open-source monitoring and alerting toolkit designed for reliability and scalability. In IntelliColab, it:

- Collects metrics from all services
- Stores time-series data
- Provides a query language (PromQL) for data analysis
- Supports alerting based on metric thresholds

#### Configuration

The Prometheus configuration file (`prometheus.yml`) specifies scrape targets and intervals:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "api-gateway"
    static_configs:
      - targets: ["api-gateway:8000"]

  - job_name: "auth-service"
    static_configs:
      - targets: ["auth-service:3001"]
```

#### Metrics Implementation

Services expose metrics endpoints that Prometheus scrapes. Here's an example of implementing metrics in the API Gateway:

```typescript
// From api-gateway/src/app.ts
import express from "express";
import client from "prom-client";

const app = express();

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();

  res.on("finish", () => {
    end({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
  });

  next();
});

// Expose metrics endpoint for Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
```

### 2. Grafana - Visualization and Dashboards

Grafana provides visualization of metrics collected by Prometheus, enabling:

- Real-time dashboards for system monitoring
- Custom dashboards for specific services or features
- Alerts based on metric thresholds
- Annotation of events (deployments, incidents, etc.)

#### Example Dashboard Configuration

A typical Grafana dashboard for the API Gateway might include:

- Request rate by service
- Error rate by service
- Request duration percentiles
- System resources (CPU, memory)
- Rate limiter statistics

#### Dashboard JSON Example

```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "gnetId": null,
  "graphTooltip": 0,
  "id": 1,
  "links": [],
  "panels": [
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "Prometheus",
      "fill": 1,
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 0,
        "y": 0
      },
      "id": 2,
      "legend": {
        "avg": false,
        "current": false,
        "max": false,
        "min": false,
        "show": true,
        "total": false,
        "values": false
      },
      "lines": true,
      "linewidth": 1,
      "nullPointMode": "null",
      "percentage": false,
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "expr": "sum(rate(http_request_duration_seconds_count[5m])) by (route)",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Request Rate by Route",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "short",
          "label": "Requests/sec",
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    }
  ],
  "refresh": "5s",
  "schemaVersion": 20,
  "style": "dark",
  "tags": [],
  "templating": {
    "list": []
  },
  "time": {
    "from": "now-1h",
    "to": "now"
  },
  "timepicker": {},
  "timezone": "",
  "title": "API Gateway",
  "uid": "api-gateway",
  "version": 1
}
```

### 3. Loki - Centralized Logging

Loki is a horizontally-scalable, highly-available log aggregation system designed to be cost-effective and easy to operate. In IntelliColab, it:

- Collects logs from all services
- Indexes logs by labels (like service name, pod name)
- Provides a query language (LogQL) for log analysis
- Integrates with Grafana for visualization

#### Structured Logging Implementation

Services in IntelliColab use structured logging to make log analysis easier:

```typescript
// From api-gateway/src/config/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "api-gateway" },
  transports: [
    new winston.transports.Console(),
    // In production, we'd add a transport that sends logs to Loki
  ],
});

// Usage
logger.info("Request received", {
  method: "GET",
  path: "/users",
  userId: "123",
  duration: 45,
});
```

#### Promtail Configuration

Promtail is an agent that ships logs from containers to Loki:

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: containers
    static_configs:
      - targets:
          - localhost
        labels:
          job: containerlogs
          __path__: /var/log/containers/*log
    pipeline_stages:
      - json:
          expressions:
            stream: stream
            logtag: logtag
            log: log
      - labels:
          stream:
          logtag:
      - output:
          source: log
```

## Distributed Tracing

Distributed tracing tracks the flow of requests across multiple services, providing insights into the end-to-end request flow. While not currently implemented in IntelliColab, it's a recommended addition using tools like Jaeger or Zipkin.

A typical implementation would use OpenTelemetry:

```typescript
// Example of distributed tracing implementation
import { NodeTracerProvider } from "@opentelemetry/node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { BatchSpanProcessor } from "@opentelemetry/tracing";

// Create a tracer provider
const provider = new NodeTracerProvider();

// Configure the Zipkin exporter
const exporter = new ZipkinExporter({
  url: "http://zipkin:9411/api/v2/spans",
  serviceName: "api-gateway",
});

// Add the exporter to the provider
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// Register as global provider
provider.register();

// Register instrumentations
registerInstrumentations({
  instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
});

// Now all Express and HTTP calls will be automatically traced
```

## Alerting

Alerting notifies operators of potential issues before they impact users. Prometheus and Grafana both support alerting:

### Prometheus Alert Rules

```yaml
groups:
  - name: example
    rules:
      - alert: HighRequestLatency
        expr: http_request_duration_seconds{quantile="0.95"} > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High request latency on {{ $labels.instance }}"
          description: "95th percentile latency is above 1s (current value: {{ $value }}s)"
```

### Grafana Alert

Grafana alerts can be configured directly in dashboards and can use any data source, including Prometheus and Loki.

## Practical Exercises

1. Set up a local observability stack using Docker Compose
2. Create custom metrics for a specific business process
3. Build a comprehensive Grafana dashboard for monitoring service health
4. Implement log correlation with request IDs across services
5. Create alerting rules for common failure scenarios

## Best Practices

1. **Use structured logging**: Always log in a structured format (JSON) with consistent fields
2. **Include context in logs**: Add relevant context like request IDs, user IDs, and correlation IDs
3. **Monitor the right metrics**: Focus on the Four Golden Signals: latency, traffic, errors, and saturation
4. **Set appropriate alert thresholds**: Avoid alert fatigue by setting meaningful thresholds
5. **Implement graceful degradation**: Design services to handle monitoring system outages

## Further Reading

- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [Google's Site Reliability Engineering Book](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Distributed Systems Observability](https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/) by Cindy Sridharan
