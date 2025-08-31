# IntelliCollab - AI Powered Chat Platform for Teams

## Architecture

<img width="3351" height="1703" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/f5a08f1f-aaf6-422c-8fc7-0e6183b8cf86" />

## Data Model

<img width="3895" height="2636" alt="Data Model Diagram" src="https://github.com/user-attachments/assets/5c58ab73-a9e1-4a3f-a774-f9b4dd6c6884" />

---

# Index

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Accessing Local Services](#️-accessing-local-services)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Overview

**IntelliCollab** is a scalable and resilient chat platform built on a **cloud-native, microservices architecture**. It provides a secure foundation for team communication, complete with a robust **observability stack** and a **centralized API Gateway** to manage client interactions.  
This project is designed as a **powerful starting point** for building a feature-rich, **AI-enhanced collaboration tool**.

---

## 🚀 Key Features

- 🔐 **Secure Authentication**: JWT-based authentication and authorization managed by a dedicated **Auth Service**.
- 🌐 **Centralized API Gateway**: A single entry point for all services, handling routing, composition, and security.
- 🛡️ **Rate Limiting**: Protects backend services from abuse with configurable request limits.
- 🔍 **Service Discovery**: Automatically routes traffic to appropriate microservices for seamless scaling.
- 📊 **Comprehensive Monitoring**: Metrics collection with **Prometheus** and pre-configured dashboards in **Grafana**.
- 📝 **Centralized Logging**: Aggregated structured logs from all services using **Loki**.
- 🐳 **Containerized Environment**: Fully containerized using **Docker** and **Docker Compose** for consistency and easy deployment.

---

## 💻 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Caching / Messaging**: Redis
- **Observability**:
  - Prometheus (Metrics)
  - Grafana (Dashboards & Visualization)
  - Loki (Logging)
- **Containerization**: Docker, Docker Compose

---

## ⚙️ Getting Started

Follow these steps to set up a local development environment.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

---

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Latish705/intellicollab.git
   cd intellicollab
   ```

2. **Launch Infrastructure Services**  
   Start the observability stack (Prometheus, Grafana, Loki) and Redis in detached mode.

   ```bash
   docker-compose up -d
   ```

3. **Start the API Gateway**  
   Open a new terminal window:

   ```bash
   cd services/api-gateway
   npm install
   npm run dev
   ```

4. **Start the Auth Service**  
   Open another terminal window:
   ```bash
   cd services/auth-service
   npm install
   npm run dev  # If no dev script, use 'node index.js'
   ```

---

## 🛠️ Accessing Local Services

Once all services are running, access them at:

- **API Gateway** → `http://localhost:8000`
- **Grafana Dashboard** → `http://localhost:3000`
- **Prometheus UI** → `http://localhost:9090`
- **Redis Insights** → `http://localhost:8001`

---

## 🤝 Contributing

Contributions are always **welcome and appreciated!**

Here are some suggested areas for contribution:

- **Testing**: Implement a robust unit and integration testing suite.
- **API Documentation**: Add and integrate Swagger/OpenAPI docs.
- **Error Handling**: Create consistent error types and responses.
- **Environment Configs**: Standardize `.env` handling across all services.
- **TypeScript Types**: Strengthen and enforce strict type definitions.

**Steps to contribute:**

1. Fork the Project
2. Create a Feature Branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
