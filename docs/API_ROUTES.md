# Leximate Backend API - Routes Guide

This document provides an overview of the available API endpoints, base URL configuration, authentication requirements, and example request payloads. Use it as a quick reference while developing and testing with Postman.

## Overview
- Base URL: `http://localhost:3000`
- Most endpoints under `/api` require a Bearer token in the `Authorization` header.
- Path parameters are denoted by `:paramName` (e.g., `:courseId`).

## Base URL and Variables
- Postman variable suggestion: set an environment or collection variable `baseUrl = http://localhost:3000`.
- Compose requests as: `{{baseUrl}}/api/...`

## Authentication
- Type: Bearer token
- Header: `Authorization: Bearer <token>`
- How to obtain a token:
  1. Register a user: `POST {{baseUrl}}/api/auth/register`
  2. Login: `POST {{baseUrl}}/api/auth/login` → returns access token
  3. Use the token in subsequent requests requiring auth
- Token management:
  - Refresh: `POST {{baseUrl}}/api/auth/refresh`
  - Logout (invalidate session): `POST {{baseUrl}}/api/auth/logout`

## Modules and Endpoints

### Health & Utilities
- GET `/` — Health check
- GET `/test-logger` — Logger test endpoint

### Auth
- POST `/api/auth/register` — Register a new user
  - Sample body:
    ```json
    {
      "email": "user@example.com",
      "password": "Passw0rd!",
      "name": "John Doe"
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
- GET `/api/auth/me` — Get current user profile (requires Bearer token)
- POST `/api/auth/refresh` — Refresh access token
- POST `/api/auth/logout` — Invalidate current session

### Course
- GET `/api/course` — List courses
- POST `/api/course` — Create a course (requires Bearer token)
  - Sample body:
    ```json
    {
      "title": "Algebra 101",
      "description": "Introductory algebra course"
    }
    ```
- GET `/api/course/:courseId` — Get course by ID
- PATCH `/api/course/:courseId` — Update course (requires Bearer token)
  - Sample body:
    ```json
    {
      "title": "Algebra 101 - Updated",
      "description": "Updated description"
    }
    ```
- DELETE `/api/course/:courseId` — Delete course (requires Bearer token)

### Task (under Course)
- GET `/api/course/:courseId/task` — List tasks for a course
- POST `/api/course/:courseId/task` — Create a task in a course (requires Bearer token)
  - Sample body:
    ```json
    {
      "title": "Homework 1",
      "description": "Solve problems 1-10",
      "dueDate": "2025-12-31T23:59:59.000Z"
    }
    ```
- GET `/api/course/:courseId/task/:taskId` — Get task by ID
- PATCH `/api/course/:courseId/task/:taskId` — Update task (requires Bearer token)
  - Sample body:
    ```json
    {
      "title": "Homework 1 - Revised",
      "description": "Solve problems 1-8",
      "dueDate": "2026-01-15T23:59:59.000Z"
    }
    ```
- DELETE `/api/course/:courseId/task/:taskId` — Delete task (requires Bearer token)

### Post (under Course)
- GET `/api/course/:courseId/post` — List posts for a course
- POST `/api/course/:courseId/post` — Create a post in a course (requires Bearer token)
  - Sample body:
    ```json
    {
      "title": "Welcome to the course",
      "content": "Introduce yourself here"
    }
    ```
- GET `/api/course/:courseId/post/:postId` — Get post by ID
- PATCH `/api/course/:courseId/post/:postId` — Update post (requires Bearer token)
  - Sample body:
    ```json
    {
      "title": "Welcome - Updated",
      "content": "Update your introductions"
    }
    ```
- DELETE `/api/course/:courseId/post/:postId` — Delete post (requires Bearer token)

### Comment (under Post)
- GET `/api/course/:courseId/post/:postId/comment` — List comments for a post
- POST `/api/course/:courseId/post/:postId/comment` — Create a comment (requires Bearer token)
  - Sample body:
    ```json
    {
      "content": "Great post!"
    }
    ```
- GET `/api/course/:courseId/post/:postId/comment/:commentId` — Get comment by ID
- PATCH `/api/course/:courseId/post/:postId/comment/:commentId` — Update comment (requires Bearer token)
  - Sample body:
    ```json
    {
      "content": "Edited comment"
    }
    ```
- DELETE `/api/course/:courseId/post/:postId/comment/:commentId` — Delete comment (requires Bearer token)

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
