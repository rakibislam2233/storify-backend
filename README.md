# Storify Backend - SaaS File Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

**A Scalable SaaS Platform for Managed File & Folder Storage with Tiered Subscriptions**

</div>

## 📖 Project Overview

Storify is a production-grade SaaS File Management System where storage limits are dynamically enforced based on user subscription tiers (Free, Silver, Gold, Diamond). The backend ensures that every user action—folder creation, file upload, or nesting—strictly complies with the package constraints defined by the Admin.

## 📁 Project Structure

Based on our enterprise-grade architecture, the project is organized as follows:

````text
Storify-Backend/
├── 📁 prisma/
│   └── 📁 schema/            # Modular Prisma schema definitions
├── 📁 src/
│   ├── 📁 config/            # Environment & Third-party configs (Cloudinary, DB)
│   ├── 📁 errors/            # Custom Error Handling (ApiError, Global Error)
│   ├── 📁 middleware/        # Auth, Validation & Role-based access
│   ├── 📁 modules/           # Business Logic (User, Package, File, Folder)
│   ├── 📁 routes/v1/         # API Route versioning
│   ├── 📁 shared/            # Reusable constants & types
│   ├── 📁 utils/             # Helper functions (Cloudinary, File Processing)
│   ├── 📄 app.ts             # Express Application setup
│   └── 📄 server.ts          # Server entry point
├── 📄 .env                   # Environment variables
├── 📄 prisma.config.ts       # Prisma configuration
└── 📄 README.md              # Project documentation

## 🗃️ Database Schema

Below is the Entity-Relationship Diagram showing the complete database structure:

<div align="center">

![ER Diagram](doc/er-diagram.png)

</div>


### 🎯 Key Features
- ** 🔐 Advanced Authentication: JWT-based auth with refresh tokens, role-based access control (Admin, User)
- **💎 Subscription Constraints: Dynamic plan-level restrictions for folders, nesting depth, and file counts
- **🛡️ Admin Package Management: Full CRUD operations for subscription tiers (Free, Silver, Gold, Diamond) with real-time limit updates
- **📁 Recursive Folder System: Advanced folder management with multi-level nesting, renaming, and secure deletion
- **☁️ Secure File Storage: Seamless Cloudinary integration for robust file uploads and metadata management via Prisma
- **🚫 Real-time Enforcement: Strict server-side validation for file types, max sizes, and storage limits before cloud processing
- **📂 File Operations: Complete file lifecycle management including viewing, downloading, and renaming within folders
- **📜 Subscription History: Detailed tracking of user plan transitions and active dates
- **💾 Smart Caching: Redis-based caching for frequent package and profile data retrieval
- **📊 Admin Analytics: Overview of user storage usage, active subscriptions, and system-wide file statistics
- **🔒 Enterprise Security: Comprehensive protection including CORS, Rate Limiting, and input validation with Zod
- **📝 Structured Logging: Advanced logging with Winston and daily rotation for system monitoring


## 🛠️ Technology Stack

### Core Technologies

- **Runtime**: Node.js v16+
- **Language**: TypeScript 5.9+
- **Framework**: Express.js 5.x

### Database & ORM

- **Database**: PostgreSQL
- **ORM**: Prisma 7.x

### Authentication & Security

- **Authentication**: JWT with refresh tokens
- **Password Hashing**: bcrypt
- **Security**: Helmet, CORS, CSRF, XSS Protection, Rate Limiting

### Caching & Real-time

- **Caching**: Redis
- **Real-time**: Socket.IO

### File Storage & Communication

- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Push Notifications**: Firebase Admin

### Development & Quality

- **Validation**: Zod schemas
- **Logging**: Winston
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rakibislam2233/storify-backend.git
cd storify-backend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file:

```env
# Application
NODE_ENV=development
PORT=8082

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/storify"

# Authentication
JWT_ACCESS_SECRET=your_super_secret_access_token_key
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:8082`

## 📚 API Documentation

### Base URL

```
http://localhost:8082/api/v1
```

### Core Endpoints

#### 🔐 Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

#### � User Management

- `GET /users/profile/me` - Get user profile
- `PATCH /users/profile/me` - Update user profile

### 📖 Complete API Reference

- **[API Documentation](./postman/API_Documentation.md)** - Complete API reference
- **[Postman Collection](./postman/Storify_API_Collection.json)** - Ready-to-use Postman collection

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio

# Testing
npm test                 # Run test suite
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## � Security Features

### Authentication & Authorization

- **JWT Tokens**: Access and refresh token system
- **Role-Based Access**: Granular permissions (Admin, Company, User)
- **Password Security**: bcrypt hashing with salt rounds
- **Email Verification**: Account verification system

### API Security

- **CORS Protection**: Configurable cross-origin resource sharing
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Protection**: Cross-site scripting prevention
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Rate Limiting**: Configurable rate limits per endpoint
- **Input Validation**: Comprehensive Zod schema validation
- **Helmet**: Security header configuration

## � Performance Optimizations

### Caching Strategy

- **Redis Integration**: Session storage and data caching
- **Query Caching**: Frequently accessed data caching
- **Cache Invalidation**: Smart cache invalidation on data changes

### Database Optimization

- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized Prisma queries
- **Indexing**: Strategic database indexes
- **Soft Deletes**: Performance-friendly data deletion

## 📊 Monitoring & Logging

### Logging System

- **Winston**: Structured logging framework
- **Log Levels**: Debug, Info, Warn, Error
- **Daily Rotation**: Automatic log file rotation
- **Structured Format**: JSON-based log format
- **Performance Metrics**: Request/response time logging

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper commit messages
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Push to your fork and open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- **Express.js Team** - For the excellent web framework
- **Prisma Team** - For the amazing ORM
- **TypeScript Team** - For the type-safe JavaScript
- **Open Source Community** - For all the amazing packages

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/rakibislam2233/storify-backend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rakibislam2233/storify-backend/discussions)
- **Email**: rakibislam2233@gmail.com

---

<div align="center">

**Built with ❤️ by [Rakib Islam](https://github.com/rakibislam2233)**

[![GitHub followers](https://img.shields.io/github/followers/rakibislam2233?style=social)](https://github.com/rakibislam2233)
[![GitHub stars](https://img.shields.io/github/stars/rakibislam2233/storify-backend?style=social)](https://github.com/rakibislam2233/storify-backend)

</div>
