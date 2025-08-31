# intellicollab Frontend

A modern, responsive Next.js frontend for the intellicollab AI-powered team collaboration platform.

![intellicollab Homepage](https://github.com/user-attachments/assets/3803cf91-5f8b-4d33-853b-2051e7213da7)

## ✨ Features

- **🎨 Modern UI/UX**: Clean, responsive design built with Tailwind CSS and Radix UI components
- **🔐 Authentication**: Complete user registration and login flow with JWT token management
- **💬 Real-time Chat**: Interactive chat interface with room management (WebSocket integration ready)
- **📱 Responsive Design**: Mobile-first approach ensuring great experience across all devices
- **🚀 SEO Optimized**: Comprehensive SEO setup with meta tags, structured data, and robots.txt
- **⚡ Performance**: Built with Next.js 15 for optimal performance and user experience
- **🛡️ Security**: Security headers, CSRF protection, and secure authentication flow
- **♿ Accessibility**: ARIA-compliant components and keyboard navigation support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React for consistent iconography
- **HTTP Client**: Axios for API communication
- **Authentication**: JWT with automatic token management
- **State Management**: React Context for global state

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📸 Screenshots

### Homepage

![Homepage](https://github.com/user-attachments/assets/3803cf91-5f8b-4d33-853b-2051e7213da7)

### Registration Page

![Registration](https://github.com/user-attachments/assets/c0771045-a36f-4ee7-ab27-040fe7b2ed54)

### Login Page

![Login](https://github.com/user-attachments/assets/bf120bfb-950b-4a4a-a3c5-f5d8912b7780)

### Dashboard

![Dashboard](https://github.com/user-attachments/assets/c2022c5c-5d23-44e8-a81c-72195c26df47)

## 🔗 API Integration

The frontend integrates with the intellicollab microservices through the API Gateway:

- **User Service**: `/api/v1/user/*` - User registration and management
- **Auth Service**: `/api/v1/auth/*` - Authentication and token validation
- **Chat Service**: `/api/v1/chat/*` - Chat rooms and messaging
- **AI Service**: `/api/v1/ai/*` - AI-powered features (planned)

## 🔐 Authentication Flow

1. **Registration**: New users create accounts with email validation
2. **Login**: Existing users authenticate with email/password
3. **Token Management**: JWT tokens stored securely in localStorage
4. **Auto-redirect**: Authenticated users redirected to dashboard
5. **Token Validation**: Automatic token validation on app load
6. **Logout**: Secure token cleanup and redirect

## 🔍 SEO Optimization

Comprehensive SEO setup for search engine visibility:

- **Meta Tags**: Title, description, keywords, and Open Graph
- **Structured Data**: JSON-LD schema for rich snippets
- **Robots.txt**: Search engine crawling instructions
- **Performance**: Optimized images and code splitting

## 🛡️ Security

- **HTTPS Enforcement**: Secure connections in production
- **Security Headers**: XSS protection, content type validation
- **CSRF Protection**: Cross-site request forgery prevention
- **Input Validation**: Client-side and server-side validation
- **Token Security**: Secure JWT token handling

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
