FROM node:22-alpine AS builder

WORKDIR /workspace

COPY packages ./packages

RUN npm install tsc -g

WORKDIR /workspace/packages/constants
RUN npm install && npm run build

WORKDIR /workspace/packages/logger
RUN npm install && npm run build
