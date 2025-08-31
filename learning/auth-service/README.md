# Auth Service in IntelliColab

## Overview

The Auth Service is responsible for user authentication and authorization in the IntelliColab platform. It manages user credentials, issues JWT tokens, and provides endpoints for registration, login, and token validation.

## Key Responsibilities

### 1. User Registration

The Auth Service provides an endpoint for user registration, which:

- Validates user input
- Hashes passwords securely
- Stores user credentials
- Returns a JWT token for immediate authentication

```javascript
// From auth-service/index.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// In-memory user store (would be a database in production)
const users = {};

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    if (Object.values(users).some((user) => user.email === email)) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    users[userId] = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Generate token
    const token = jwt.sign(
      { id: userId, username, email },
      process.env.JWT_SECRET || "development-secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

### 2. User Authentication (Login)

The Auth Service authenticates users and issues JWT tokens:

```javascript
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = Object.values(users).find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || "development-secret",
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

### 3. Token Validation

The Auth Service provides an endpoint for validating JWT tokens:

```javascript
app.post("/validate", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-secret"
    );

    res.json({ valid: true, user: payload });
  } catch (err) {
    res.json({ valid: false, error: err.message });
  }
});
```

### 4. Password Reset

The Auth Service handles password reset requests:

```javascript
// This would typically involve sending an email with a reset link
app.post("/reset-password/request", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = Object.values(users).find((u) => u.email === email);

  if (!user) {
    // Don't reveal whether the email exists or not
    return res.json({
      message: "If your email exists, you will receive a reset link",
    });
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { id: user.id, purpose: "password-reset" },
    process.env.JWT_SECRET || "development-secret",
    { expiresIn: "1h" }
  );

  // In a real application, send an email with the reset link
  console.log(`Reset token for ${email}: ${resetToken}`);

  res.json({ message: "If your email exists, you will receive a reset link" });
});
```

## Security Best Practices

### 1. Password Storage

Passwords are never stored in plain text. Instead, they are hashed using bcrypt, which:

- Automatically includes a salt to protect against rainbow table attacks
- Is slow by design to resist brute force attacks
- Has a configurable work factor to adjust security as computing power increases

### 2. JWT Security

When working with JWTs, follow these best practices:

- Use a strong, unique secret key
- Include an expiration time in tokens
- Store the secret securely (environment variables, secrets manager)
- Validate all incoming tokens
- Include only necessary claims in the payload

### 3. Rate Limiting

Implement rate limiting on authentication endpoints to prevent brute force attacks:

```javascript
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: "Too many login attempts, please try again later",
});

app.post("/login", loginLimiter, async (req, res) => {
  // Login logic
});
```

### 4. HTTPS

Always use HTTPS in production to encrypt data in transit, especially authentication credentials.

## Database Integration

In a production environment, user data would be stored in a database rather than in memory:

```javascript
// Example with MongoDB
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, username, email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## Practical Exercises

1. Implement two-factor authentication for the login process
2. Add social authentication (OAuth) with providers like Google or GitHub
3. Create an admin endpoint for managing user accounts
4. Implement role-based access control (RBAC)

## Further Reading

- [JWT.io](https://jwt.io/) - Introduction to JSON Web Tokens
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [The Twelve-Factor App: Config](https://12factor.net/config) - Best practices for configuration
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
