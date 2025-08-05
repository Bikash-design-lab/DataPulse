# Backend for Data Monitoring Dashboard

A Node.js-based backend API for the Data Monitoring Dashboard, providing endpoints for user authentication and log data management. Built with Express.js and MongoDB, it supports secure user registration, login, and retrieval of paginated log data with filtering capabilities.

Backend deploys to Render.com, with environment variables for configuration.
URL:https://datapulse-pwoa.onrender.com

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Running the Server](#running-the-server)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**:
  - Supports user sign-up (`/user/signup`) and sign-in (`/user/signin`) with JSON Web Tokens (JWT) for secure authentication.
  - Role-based access (Admin or Employee).
- **Log Data Management**:
  - Provides an endpoint (`/logged/data`) for retrieving paginated log data with support for filtering by search terms, status, interface name, and integration key.
- **Middleware**:
  - Uses CORS to allow requests from the frontend (configured via `CLIENT_BASE_URL`).
  - Uses Morgan for HTTP request logging.
- **Database**:
  - Integrates with MongoDB via Mongoose for data storage and management.
- **Development**:
  - Uses Nodemon for automatic server restarts during development.

## Technologies Used
- **Runtime**: Node.js
- **Framework**: Express.js (`^5.1.0`)
- **Database**: MongoDB with Mongoose (`^8.17.0`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken@^9.0.2`)
- **Middleware**:
  - CORS (`^2.8.5`) for cross-origin requests
  - Morgan (`^1.10.1`) for request logging
- **Development Tools**:
  - Nodemon (`^3.1.10`) for auto-restarting the server
  - Dotenv (`^17.2.1`) for environment variable management
- **Other**: Configured to run on a specified port (default: 3000)

- Create a `.env` file in the root directory of the project.
    - Add the following variables:
    ```
    MONGODB_URI = mongodb://localhost:27017/DatabaseName
    PORT = 3000
    SECURED_KEY = your-secured-key
    CLIENT_BASE_URL=http://localhost:5173/api
    ```


## Setup and Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <backend-folder>