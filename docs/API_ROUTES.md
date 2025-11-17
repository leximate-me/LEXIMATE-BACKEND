# Leximate Backend API - Routes Guide

This document provides an overview of the available API endpoints, base URL configuration, authentication requirements, and example request payloads. Use it as a quick reference while developing and testing with Postman.

## Overview
- Base URL: `http://localhost:8080`
- Most endpoints under `/api` require a Bearer token in the `Authorization` header.
- Path parameters are denoted by `:paramName` (e.g., `:courseId`).

## Base URL and Variables
- Postman variables:
  - `protocol`: `http`
  - `host`: `localhost`
  - `port`: `8080`
  - `baseUrl`: `{{protocol}}://{{host}}:{{port}}`
- Compose requests as: `{{baseUrl}}/api/...`

## Authentication
- Type: Bearer token
- Header: `Authorization: Bearer <token>`
- How to obtain a token:
  1. Register a user: `POST {{baseUrl}}/api/auth/register`
  2. Login: `POST {{baseUrl}}/api/auth/login` → returns access token
  3. Use the token in subsequent requests requiring auth
- Token management:
  - Verify token: `GET {{baseUrl}}/api/auth/verify-token`
  - Logout (invalidate session): `POST {{baseUrl}}/api/auth/logout`

## Modules and Endpoints

### Health & Utilities
- GET `/` — Health check
- GET `/test-logger` — Logger test endpoint

### Auth (/api/auth)
- POST `/api/auth/register` — Register a new user
  - Sample body:
    ```json
    {
      "email": "user@example.com",
      "password": "Passw0rd!",
      "first_name": "John",
      "last_name": "Doe"
    }
    ```
- POST `/api/auth/login` — Authenticate and obtain access token
  - Sample body:
    ```json
    {
      "email": "user@example.com",
      "password": "Passw0rd!"
    }
    ```
- GET `/api/auth/verify-token` — Verify Bearer token (requires Bearer token)
- POST `/api/auth/logout` — Invalidate current session (requires Bearer token)
- GET `/api/auth/profile` — Get current user profile (requires Bearer token)
- DELETE `/api/auth/delete` — Delete user account (requires Bearer token)
- POST `/api/auth/send-email-verification` — Send email verification (requires Bearer token)
- GET `/api/auth/verify-email?token={{emailToken}}` — Verify email with token (requires Bearer token)
- PUT `/api/auth/update-profile` — Update user profile (requires Bearer token)
  - Sample body (form-data):
    ```
    user_name: john_doe
    email: newemail@example.com
    avatar: <file>
    ```

### Course (/api/course)
- POST `/api/course` — Create a course (cookie auth)
  - Sample body:
    ```json
    {
      "name": "Course name",
      "description": "Optional"
    }
    ```
- POST `/api/course/join` — Join a course (cookie auth)
  - Sample body:
    ```json
    {
      "classCode": "ABC123"
    }
    ```
- GET `/api/course/user` — List courses for current user (cookie auth)
- POST `/api/course/:courseId/leave` — Leave a course (cookie auth)
- GET `/api/course/:courseId/user` — Get users in a course (cookie auth)
- PUT `/api/course/:courseId` — Update course (cookie auth)
  - Sample body:
    ```json
    {
      "name": "Updated name"
    }
    ```
- DELETE `/api/course/:courseId` — Delete course (cookie auth)

### Task (under Course)
- POST `/api/course/:courseId/task` — Create a task (cookie auth)
  - Body:
    ```json
    {
      "title": "Homework 1",
      "description": "Solve problems 1-10",
      "dueDate": "2025-12-31T23:59:59.000Z"
    }
    ```
- GET `/api/course/:courseId/task` — List tasks (cookie auth)
- GET `/api/course/:courseId/task/:taskId` — Get task by ID (cookie auth)
- PATCH `/api/course/:courseId/task/:taskId` — Update task (cookie auth)
  - Body:
    ```json
    {
      "title": "Homework 1 - Revised",
      "description": "Solve problems 1-8",
      "dueDate": "2026-01-15T23:59:59.000Z"
    }
    ```
- DELETE `/api/course/:courseId/task/:taskId` — Delete task (cookie auth)

### Post (under Course)
- POST `/api/course/:courseId/post` — Create post (cookie auth)
  - Body:
    ```json
    {
      "title": "Welcome to the course",
      "content": "Introduce yourself here"
    }
    ```
- GET `/api/course/:courseId/post` — List posts (cookie auth)
- GET `/api/course/:courseId/post/:postId` — Get post by ID (cookie auth)
- PATCH `/api/course/:courseId/post/:postId` — Update post (cookie auth)
  - Body:
    ```json
    {
      "title": "Welcome - Updated",
      "content": "Update your introductions"
    }
    ```
- DELETE `/api/course/:courseId/post/:postId` — Delete post (cookie auth)

### Comment (under Post)
- POST `/api/course/:courseId/post/:postId/comment` — Create comment (cookie auth)
  - Body:
    ```json
    {
      "content": "Great post!"
    }
    ```
- GET `/api/course/:courseId/post/:postId/comment` — List comments (cookie auth)
- GET `/api/course/:courseId/post/:postId/comment/:commentId` — Get comment by ID (cookie auth)
- PATCH `/api/course/:courseId/post/:postId/comment/:commentId` — Update comment (cookie auth)
  - Body:
    ```json
    {
      "content": "Edited comment"
    }
    ```
- DELETE `/api/course/:courseId/post/:postId/comment/:commentId` — Delete comment (cookie auth)

### Tool (/tool)
- GET `/tool/extract-text-from-local-url?localUrl=C:/path/to/file.pdf` — Extract text from local file
- POST `/tool/chat-bot-response` — Get chatbot response
  - Sample body:
    ```json
    {
      "message": "Hola"
    }
    ```
- GET `/tool/markdown-url?url=https://example.com` — Convert URL content to markdown

## Quickstart (Register → Login → Use Token → CRUD)
1. Register
   - Request: `POST {{baseUrl}}/api/auth/register`
   - Body:
     ```json
     {
       "email": "user@example.com",
       "password": "Passw0rd!",
       "name": "John Doe"
     }
     ```
2. Login
   - Request: `POST {{baseUrl}}/api/auth/login`
   - Body:
     ```json
     {
       "email": "user@example.com",
       "password": "Passw0rd!"
     }
     ```
   - Response includes an access token: store it and set header `Authorization: Bearer <token>`
3. Verify identity (optional)
   - Request: `GET {{baseUrl}}/api/auth/me` with Bearer token
4. Create a course
   - Request: `POST {{baseUrl}}/api/course`
   - Headers: `Authorization: Bearer <token>`
   - Body:
     ```json
     {
       "title": "Algebra 101",
       "description": "Introductory algebra course"
     }
     ```
5. Update the course
   - Request: `PATCH {{baseUrl}}/api/course/:courseId`
   - Headers: `Authorization: Bearer <token>`
   - Body:
     ```json
     {
       "title": "Algebra 101 - Updated",
       "description": "Updated description"
     }
     ```
6. Create a task in the course
   - Request: `POST {{baseUrl}}/api/course/:courseId/task`
   - Headers: `Authorization: Bearer <token>`
   - Body:
     ```json
     {
       "title": "Homework 1",
       "description": "Solve problems 1-10",
       "dueDate": "2025-12-31T23:59:59.000Z"
     }
     ```
7. Create a post in the course
   - Request: `POST {{baseUrl}}/api/course/:courseId/post`
   - Headers: `Authorization: Bearer <token>`
   - Body:
     ```json
     {
       "title": "Welcome to the course",
       "content": "Introduce yourself here"
     }
     ```
8. Comment on the post
   - Request: `POST {{baseUrl}}/api/course/:courseId/post/:postId/comment`
   - Headers: `Authorization: Bearer <token>`
   - Body:
     ```json
     {
       "content": "Great post!"
     }
     ```
9. Cleanup (delete resources as needed)
   - `DELETE {{baseUrl}}/api/course/:courseId/task/:taskId`
   - `DELETE {{baseUrl}}/api/course/:courseId/post/:postId`
   - `DELETE {{baseUrl}}/api/course/:courseId`

## Notes
- Use ISO 8601 date strings for `dueDate` fields.
- Ensure you include the Bearer token for protected routes to avoid 401/403 responses.
