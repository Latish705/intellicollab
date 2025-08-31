# TypeScript Best Practices in IntelliColab

## Overview

TypeScript enhances JavaScript with static typing, making the IntelliColab codebase more maintainable, readable, and less prone to runtime errors. This guide covers TypeScript best practices used throughout the project.

## Type Definitions

### 1. Interfaces vs. Types

IntelliColab uses both interfaces and types, following these guidelines:

- Use **interfaces** for object shapes that may be extended or implemented
- Use **types** for unions, intersections, or when you need to use primitives

```typescript
// From api-gateway/src/types/index.ts

// Interface for object shapes that might be extended
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

// Extended interface
interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}

// Type for union
type UserRole = "admin" | "moderator" | "user";

// Type alias for complex types
type UserWithToken = User & { token: string };
```

### 2. Generics

Generics provide flexible, reusable components:

```typescript
// Generic response wrapper
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: number;
}

// Usage
async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/users/${id}`);
  return await response.json();
}

// Generic repository pattern
class Repository<T> {
  constructor(private collection: string) {}

  async findById(id: string): Promise<T | null> {
    // Implementation
    return null;
  }

  async findAll(): Promise<T[]> {
    // Implementation
    return [];
  }

  async create(item: Omit<T, "id">): Promise<T> {
    // Implementation
    return {} as T;
  }
}

// Usage
const userRepo = new Repository<User>("users");
```

### 3. Utility Types

TypeScript provides utility types for common transformations:

```typescript
// From api-gateway/src/types/index.ts

// Original type
interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

// User without sensitive fields
type UserResponse = Omit<User, "password">;

// Required fields for user creation
type RequiredUserFields = Required<Pick<User, "username" | "email">>;

// Read-only user
type ReadonlyUser = Readonly<User>;

// Partial user for updates
type UserUpdate = Partial<Omit<User, "id" | "createdAt">>;
```

## Project Configuration

### 1. tsconfig.json

IntelliColab uses a strict TypeScript configuration:

```json
// From api-gateway/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

Key options explained:

- `strict`: Enables all strict type checking options
- `noImplicitAny`: Raises error on expressions and declarations with an implied `any` type
- `strictNullChecks`: When true, `null` and `undefined` have their own distinct types
- `noUnusedLocals`: Report errors on unused local variables
- `sourceMap`: Generates corresponding .map files for debugging

### 2. ESLint Configuration

IntelliColab uses ESLint with TypeScript-specific rules:

```json
// From api-gateway/.eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "prefix": ["I"]
      },
      {
        "selector": "typeAlias",
        "format": ["PascalCase"]
      }
    ]
  }
}
```

## Error Handling

### 1. Custom Error Types

IntelliColab defines custom error types for different scenarios:

```typescript
// From api-gateway/src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Not authorized to access this resource") {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(
    message = "Validation failed",
    public errors?: Record<string, string>
  ) {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
```

### 2. Error Handling Middleware

Centralized error handling with TypeScript:

```typescript
// From api-gateway/src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/errors";
import { logger } from "../config/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default status code and message
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Record<string, string> | undefined;

  // Handle known error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    if (err instanceof ValidationError && err.errors) {
      errors = err.errors;
    }
  }

  // Log the error
  logger.error(`${statusCode} - ${message}`, {
    path: req.path,
    method: req.method,
    error: err.stack,
    ...(errors && { validationErrors: errors }),
  });

  // Send response
  res.status(statusCode).json({
    status: "error",
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
```

### 3. Async Error Handling

Type-safe wrapper for async route handlers:

```typescript
// From api-gateway/src/utils/async-handler.ts
import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (fn: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Usage
import { asyncHandler } from "../utils/async-handler";

router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await userService.findById(req.params.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({ data: user });
  })
);
```

## Advanced TypeScript Patterns

### 1. Dependency Injection

Type-safe dependency injection:

```typescript
// From api-gateway/src/services/user-service.ts
import { IUserRepository } from "../repositories/user-repository";
import { ICacheService } from "../services/cache-service";

export interface IUserService {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: CreateUserRequest): Promise<User>;
}

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private cacheService: ICacheService
  ) {}

  async findById(id: string): Promise<User | null> {
    // Check cache first
    const cachedUser = await this.cacheService.get<User>(`user:${id}`);

    if (cachedUser) {
      return cachedUser;
    }

    // Fetch from repository
    const user = await this.userRepository.findById(id);

    if (user) {
      // Cache the result
      await this.cacheService.set(`user:${id}`, user, 60 * 5); // 5 minutes
    }

    return user;
  }

  // Other methods
}

// Dependency setup
import { UserRepository } from "../repositories/user-repository";
import { RedisCache } from "../services/redis-cache";
import { redisClient } from "../config/redis";

const userRepository = new UserRepository();
const cacheService = new RedisCache(redisClient);
export const userService = new UserService(userRepository, cacheService);
```

### 2. Decorators

TypeScript decorators for cross-cutting concerns:

```typescript
// From api-gateway/src/decorators/log-method.ts
export function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    console.log(`Starting ${propertyKey} with args:`, args);

    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;
      console.log(`Finished ${propertyKey} in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`Error in ${propertyKey} after ${duration}ms:`, error);
      throw error;
    }
  };

  return descriptor;
}

// Usage
import { LogMethod } from "../decorators/log-method";

class UserService {
  @LogMethod
  async findById(id: string): Promise<User | null> {
    // Implementation
  }
}
```

### 3. Type Guards

Type guards for runtime type checking:

```typescript
// From api-gateway/src/utils/type-guards.ts
export function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.username === "string" &&
    typeof obj.email === "string" &&
    obj.createdAt instanceof Date
  );
}

// Usage
function processUserData(data: unknown): void {
  if (isUser(data)) {
    // TypeScript knows data is User here
    console.log(data.username);
  } else {
    console.error("Invalid user data");
  }
}
```

## Practical Exercises

1. Define interfaces for all API requests and responses in the API Gateway
2. Implement a generic error handling system with custom error types
3. Add strong typing to the Redis client wrapper
4. Create a dependency injection system for services
5. Implement validation using TypeScript's type system and a validation library

## TypeScript Style Guide

1. **Use PascalCase for types/interfaces, camelCase for variables/functions**
2. **Prefer interfaces over types when possible**
3. **Avoid any; use unknown for values of unknown type**
4. **Use readonly for immutable properties**
5. **Use null for intentional absence of value, undefined for uninitialized variables**
6. **Always specify return types for public API functions**
7. **Use type annotations for complex object literals**

## Further Reading

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Effective TypeScript](https://effectivetypescript.com/) by Dan Vanderkam
- [Clean Code in TypeScript](https://github.com/labs42io/clean-code-typescript)
