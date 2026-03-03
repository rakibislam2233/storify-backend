# Storify Backend - Complete API Documentation

## 📖 Table of Contents

- [Authentication](#-authentication)
- [User Management](#-user-management)
- [Packages](#-packages)
- [Subscription History](#-subscription-history)
- [Folders](#-folders)
- [Files](#-files)

---

## 🔐 Authentication

### Base URL

```
http://localhost:8082/api/v1/auth
```

### Endpoints

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "+1234567890"
}
```

**Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "role": "USER",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

#### POST /auth/login

Authenticate user and return tokens.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "isEmailVerified": true
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

#### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token"
  }
}
```

#### POST /auth/logout

Logout user and invalidate tokens.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful"
}
```

---

## 👤 User Management

### Base URL

```
http://localhost:8082/api/v1/users
```

### Endpoints

#### GET /users/profile/me

Get current user's profile.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile fetched successfully",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "profileImage": "image_url",
    "role": "USER",
    "status": "ACTIVE",
    "isEmailVerified": true,
    "activePackage": {
      "id": "package_uuid",
      "name": "Gold",
      "maxFolders": 100,
      "maxFileSize": 10485760
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /users/profile/me

Update current user's profile.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```
fullName: "John Updated"
phoneNumber: "+1234567890"
profileImage: <file>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "fullName": "John Updated",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "profileImage": "new_image_url",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /users (Admin Only)

Get all users with pagination and filtering.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**

```
page: 1
limit: 10
searchTerm: "john"
role: "USER"
status: "ACTIVE"
sortBy: "createdAt"
sortOrder: "desc"
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "data": [
    {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 💎 Packages

### Base URL

```
http://localhost:8082/api/v1/packages
```

### Endpoints

#### POST /packages (Admin Only)

Create a new subscription package.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "name": "Platinum",
  "maxFolders": 500,
  "maxNestingLevel": 10,
  "allowedFileTypes": ["IMAGE", "PDF", "DOCUMENT"],
  "maxFileSize": 52428800,
  "totalFileLimit": 1000,
  "filesPerFolder": 100,
  "price": 29.99
}
```

**Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Package created successfully",
  "data": {
    "id": "uuid",
    "name": "Platinum",
    "maxFolders": 500,
    "maxNestingLevel": 10,
    "allowedFileTypes": ["IMAGE", "PDF", "DOCUMENT"],
    "maxFileSize": 52428800,
    "totalFileLimit": 1000,
    "filesPerFolder": 100,
    "price": 29.99,
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /packages

Get all available packages.

**Query Parameters:**

```
page: 1
limit: 10
searchTerm: "premium"
sortBy: "price"
sortOrder: "asc"
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Packages fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  },
  "data": [
    {
      "id": "uuid",
      "name": "Free",
      "maxFolders": 5,
      "maxFileSize": 1048576,
      "totalFileLimit": 10,
      "filesPerFolder": 5,
      "price": 0,
      "isDeleted": false
    }
  ]
}
```

#### GET /packages/:id

Get specific package by ID.

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Package fetched successfully",
  "data": {
    "id": "uuid",
    "name": "Gold",
    "maxFolders": 100,
    "maxNestingLevel": 5,
    "allowedFileTypes": ["IMAGE", "PDF", "DOCUMENT", "VIDEO"],
    "maxFileSize": 10485760,
    "totalFileLimit": 500,
    "filesPerFolder": 50,
    "price": 9.99,
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /packages/:id (Admin Only)

Update package details.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "name": "Gold Plus",
  "price": 12.99,
  "maxFileSize": 20971520
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Package updated successfully",
  "data": {
    "id": "uuid",
    "name": "Gold Plus",
    "price": 12.99,
    "maxFileSize": 20971520,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /packages/:id (Admin Only)

Soft delete a package.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Package deleted successfully",
  "data": {
    "id": "uuid",
    "name": "Gold Plus",
    "isDeleted": true,
    "deletedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📜 Subscription History

### Base URL

```
http://localhost:8082/api/v1/subscription-history
```

### Endpoints

#### POST /subscription-history/purchase

Purchase a new subscription package.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "packageId": "package_uuid"
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Package purchased successfully",
  "data": {
    "id": "user_uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "activePackageId": "package_uuid",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /subscription-history

Get all subscription histories (Admin Only).

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**

```
page: 1
limit: 10
searchTerm: "gold"
userId: "user_uuid"
startDate: "2024-01-01"
endDate: "2024-12-31"
sortBy: "createdAt"
sortOrder: "desc"
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subscription histories fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "data": [
    {
      "id": "history_uuid",
      "userId": "user_uuid",
      "packageName": "Gold",
      "price": 9.99,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": null,
      "user": {
        "id": "user_uuid",
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /subscription-history/user/:userId

Get subscription histories for specific user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User subscription histories fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "data": [
    {
      "id": "history_uuid",
      "userId": "user_uuid",
      "packageName": "Gold",
      "price": 9.99,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /subscription-history/active/:userId

Get user's current active subscription.

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Active subscription fetched successfully",
  "data": {
    "id": "history_uuid",
    "userId": "user_uuid",
    "packageName": "Gold",
    "price": 9.99,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": null,
    "user": {
      "id": "user_uuid",
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### GET /subscription-history/check-active/:userId

Check if user has active subscription.

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Active subscription status checked successfully",
  "data": {
    "hasActiveSubscription": true
  }
}
```

#### GET /subscription-history/:id

Get specific subscription history by ID.

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subscription history fetched successfully",
  "data": {
    "id": "history_uuid",
    "userId": "user_uuid",
    "packageName": "Gold",
    "price": 9.99,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": null,
    "user": {
      "id": "user_uuid",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /subscription-history/:id (Admin Only)

Update subscription history.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "packageName": "Gold Plus",
  "price": 12.99,
  "endDate": "2024-12-31T23:59:59.999Z"
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subscription history updated successfully",
  "data": {
    "id": "history_uuid",
    "packageName": "Gold Plus",
    "price": 12.99,
    "endDate": "2024-12-31T23:59:59.999Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /subscription-history/:id (Admin Only)

Delete subscription history.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subscription history deleted successfully",
  "data": {
    "id": "history_uuid",
    "packageName": "Gold Plus",
    "deletedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📁 Folders

### Base URL

```
http://localhost:8082/api/v1/folders
```

### Endpoints

#### POST /folders

Create a new folder.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "name": "Documents",
  "parentId": "parent_folder_uuid" // Optional
}
```

**Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Folder created successfully",
  "data": {
    "id": "folder_uuid",
    "name": "Documents",
    "level": 1,
    "userId": "user_uuid",
    "parentId": null,
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /folders

Get user's folders with pagination.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

```
page: 1
limit: 10
searchTerm: "doc"
parentId: "parent_folder_uuid"
sortBy: "name"
sortOrder: "asc"
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Folders fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": [
    {
      "id": "folder_uuid",
      "name": "Documents",
      "level": 1,
      "parentId": null,
      "fileCount": 5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /folders/:id

Get specific folder by ID.

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Folder fetched successfully",
  "data": {
    "id": "folder_uuid",
    "name": "Documents",
    "level": 1,
    "userId": "user_uuid",
    "parentId": null,
    "children": [
      {
        "id": "child_folder_uuid",
        "name": "Work",
        "level": 2,
        "fileCount": 3
      }
    ],
    "files": [
      {
        "id": "file_uuid",
        "name": "report.pdf",
        "size": 1024000,
        "type": "PDF"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /folders/:id

Update folder details.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "name": "Work Documents"
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Folder updated successfully",
  "data": {
    "id": "folder_uuid",
    "name": "Work Documents",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /folders/:id

Delete folder (soft delete).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Folder deleted successfully",
  "data": {
    "id": "folder_uuid",
    "name": "Work Documents",
    "isDeleted": true,
    "deletedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📄 Files

### Base URL

```
http://localhost:8082/api/v1/files
```

### Endpoints

#### POST /files

Upload a file to a folder.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```
file: <file>
folderId: "folder_uuid"
```

**Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "File uploaded successfully",
  "data": {
    "id": "file_uuid",
    "originalName": "document.pdf",
    "name": "document_1640995200000.pdf",
    "type": "PDF",
    "size": 1024000,
    "url": "https://cloudinary.com/...",
    "folderId": "folder_uuid",
    "userId": "user_uuid",
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /files

Get user's files with pagination.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

```
page: 1
limit: 10
searchTerm: "document"
folderId: "folder_uuid"
fileType: "PDF"
sortBy: "createdAt"
sortOrder: "desc"
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Files fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "data": [
    {
      "id": "file_uuid",
      "name": "document.pdf",
      "type": "PDF",
      "size": 1024000,
      "url": "https://cloudinary.com/...",
      "folder": {
        "id": "folder_uuid",
        "name": "Documents"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /files/:id

Get specific file by ID.

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "File fetched successfully",
  "data": {
    "id": "file_uuid",
    "originalName": "document.pdf",
    "name": "document_1640995200000.pdf",
    "type": "PDF",
    "size": 1024000,
    "url": "https://cloudinary.com/...",
    "folderId": "folder_uuid",
    "userId": "user_uuid",
    "folder": {
      "id": "folder_uuid",
      "name": "Documents"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /files/:id/download

Download file by ID.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```
File download stream
```

#### PATCH /files/:id

Update file details.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "name": "updated_document.pdf"
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "File updated successfully",
  "data": {
    "id": "file_uuid",
    "name": "updated_document.pdf",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /files/:id

Delete file (soft delete).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "File deleted successfully",
  "data": {
    "id": "file_uuid",
    "name": "updated_document.pdf",
    "isDeleted": true,
    "deletedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🔒 Error Responses

### Standard Error Format

All endpoints return errors in the following format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errorDetails": {
    "field": "Validation error message"
  }
}
```

### Common HTTP Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **409** - Conflict
- **422** - Validation Error
- **500** - Internal Server Error

### Authentication Errors

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Access token is required"
}
```

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

### Validation Errors

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errorDetails": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

### Subscription Limit Errors

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Folder limit exceeded for your subscription plan",
  "errorDetails": {
    "current": 5,
    "limit": 5,
    "plan": "Free"
  }
}
```

---

## � Dashboard & Analytics

### Base URL

```
http://localhost:8082/api/v1/dashboard
```

### Endpoints

#### GET /dashboard/admin/stats (Admin Only)

Get comprehensive admin dashboard statistics.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Admin dashboard stats retrieved successfully",
  "data": {
    "totalUsers": 1250,
    "activeUsers": 890,
    "totalPackages": 4,
    "totalRevenue": 15420.5,
    "storageUsage": {
      "totalFiles": 15420,
      "totalSize": 524288000
    }
  }
}
```

#### GET /dashboard/user/stats/:userId

Get user-specific dashboard statistics.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User dashboard stats retrieved successfully",
  "data": {
    "currentPlan": {
      "name": "Gold Plus",
      "maxFolders": 50,
      "maxFileSize": 20971520,
      "totalFileLimit": 1073741824,
      "filesPerFolder": 100,
      "allowedFileTypes": ["IMAGE", "VIDEO", "PDF"],
      "price": 12.99
    },
    "usage": {
      "foldersUsed": 25,
      "filesUsed": 150,
      "storageUsed": 524288000,
      "storagePercentage": 48.82
    },
    "recentFiles": [
      {
        "id": "uuid",
        "name": "document.pdf",
        "type": "application/pdf",
        "size": 1048576,
        "uploadedAt": "2024-01-01T10:30:00.000Z"
      }
    ]
  }
}
```

#### GET /dashboard/admin/charts (Admin Only)

Get admin chart data for analytics dashboard.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Admin chart data retrieved successfully",
  "data": {
    "monthlyRegistrations": [
      {
        "month": "2024-01-01T00:00:00.000Z",
        "count": 120
      }
    ],
    "monthlySubscriptions": [
      {
        "month": "2024-01-01T00:00:00.000Z",
        "count": 85,
        "revenue": 1275.0
      }
    ],
    "planDistribution": [
      {
        "packageName": "Free",
        "count": 500,
        "percentage": 40
      }
    ],
    "userActivity": {
      "active": 890,
      "inactive": 360
    },
    "storageByPlan": [
      {
        "planName": "Gold Plus",
        "totalSize": 1073741824,
        "fileCount": 2500
      }
    ]
  }
}
```

#### GET /dashboard/user/charts/:userId

Get user-specific chart data.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User chart data retrieved successfully",
  "data": {
    "monthlyFileUploads": [
      {
        "month": "2024-01-01T00:00:00.000Z",
        "count": 25,
        "totalSize": 52428800
      }
    ],
    "fileTypeDistribution": [
      {
        "type": "image/jpeg",
        "count": 50,
        "size": 104857600
      }
    ],
    "storageOverTime": [
      {
        "month": "2024-01-01T00:00:00.000Z",
        "fileCount": 150,
        "cumulativeSize": 524288000
      }
    ],
    "folderDepthDistribution": [
      {
        "level": 1,
        "count": 20
      }
    ]
  }
}
```

#### GET /dashboard/analytics (Admin Only)

Get comprehensive analytics data.

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**

- `days` (optional, default: 30) - Number of days for analytics data

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Analytics data retrieved successfully",
  "data": {
    "userRegistrations": [
      {
        "date": "2024-01-01",
        "count": 15
      }
    ],
    "subscriptionPurchases": [
      {
        "date": "2024-01-01",
        "count": 8,
        "revenue": 95.92
      }
    ],
    "planDistribution": [
      {
        "planName": "Free",
        "count": 500,
        "percentage": 40
      }
    ],
    "storageTrends": [
      {
        "date": "2024-01-01",
        "totalSize": 1073741824,
        "fileCount": 1500
      }
    ]
  }
}
```

---

## �📝 Notes

### Authentication

- All protected endpoints require `Authorization: Bearer <access_token>` header
- Access tokens expire after 15 minutes
- Use refresh token to get new access token
- Admin-only endpoints require user with `ADMIN` role

### File Uploads

- Maximum file size depends on user's subscription plan
- Supported file types: IMAGE, VIDEO, AUDIO, PDF, DOCUMENT, OTHER
- Files are stored on Cloudinary
- File names are automatically prefixed with timestamp to avoid conflicts

### Pagination

- All list endpoints support pagination
- Default page: 1, limit: 10
- Maximum limit: 100
- Response includes `meta` object with pagination info

### Rate Limiting

- API endpoints are rate-limited to prevent abuse
- Standard limits: 100 requests per minute per user
- Upload endpoints: 10 requests per minute per user

### Caching

- Frequently accessed data is cached using Redis
- Cache is automatically invalidated when data changes
- Cached data includes: user profiles, packages, subscription history

---

## 🚀 Quick Testing

You can test the API using the provided Postman collection or by using curl commands:

```bash
# Register a new user
curl -X POST http://localhost:8082/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Login
curl -X POST http://localhost:8082/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Get user profile (replace with actual token)
curl -X GET http://localhost:8082/api/v1/users/profile/me \
  -H "Authorization: Bearer <access_token>"
```

---

_Last updated: January 2024_
