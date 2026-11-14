Secure Authentication Lab

Project Overview

Secure Authentication Lab is a cybersecurity project demonstrating secure user registration, login, password hashing, session management, and protection against repeated login attempts.

Technologies Used

* Node.js
* Express.js
* JavaScript
* bcrypt
* express-session
* express-rate-limit
* Helmet
* Zod
* dotenv

Features

1. User Registration
2. Password Hashing using bcrypt
3. Server-side Input Validation
4. Secure User Login
5. Session Management
6. HTTP-only Session Cookies
7. SameSite Cookie Protection
8. Session Expiration
9. Login Rate Limiting
10. Secure Logout
11. Generic Authentication Error Messages
12. Security Headers using Helmet

Project Structure

secure-authentication-lab/
├── src/
│   ├── config/
│   │   └── session.js
│   ├── middleware/
│   │   └── rateLimit.js
│   └── routes/
│       └── auth.js
├── tests/
├── server.js
├── package.json
├── .env
├── .gitignore
└── README.md

Installation

Clone the repository:

git clone YOUR_REPOSITORY_URL

Navigate to the project:

cd secure-authentication-lab

Install dependencies:

npm install

Create a .env file:

PORT=3000
SESSION_SECRET=YOUR_PRIVATE_SECRET
NODE_ENV=development

Start the application:

npm start

The server runs at:

http://localhost:3000

API Endpoints

Method	Endpoint	Description
GET	/	Server status
POST	/api/auth/register	Register user
POST	/api/auth/login	Authenticate user
GET	/api/auth/me	Check active session
POST	/api/auth/logout	End user session

Security Testing

The following tests were performed:

* Successful user registration
* Duplicate registration prevention
* Successful login
* Incorrect password rejection
* Session verification
* Logout verification
* Access rejection after logout
* Login rate limiting

Development Limitations

This project currently uses in-memory storage for users and the default Express session MemoryStore.

Consequently:

* User accounts are not persistent across server restarts.
* Sessions are not persistent across server restarts.
* The application is intended for local demonstration and educational purposes.

A persistent database and production-grade session store are required before production deployment.

Author

Cybersecurity Internship Project