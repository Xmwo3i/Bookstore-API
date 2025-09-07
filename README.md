# Bookstore API

A RESTful API to manage **books, authors, and users** in a bookstore system.  
Built with **Node.js**, **Express**, and **JSON-based data persistence**. Fully documented with **Swagger** and tested using **Jest** and **Supertest**.

---

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Endpoints Overview](#endpoints-overview)
- [License](#license)

---

## Features
- Full **CRUD** operations for books, authors, and users.
- Input validation and sanitization using `express-validator`.
- Centralized error handling for clean responses.
- Security headers implemented via `helmet`.
- **Swagger** API documentation for easy integration.
- **Unit and integration tests** with Jest & Supertest.

---

## Technologies
- Node.js & Express.js
- JSON for lightweight data storage
- Swagger for API documentation
- Jest & Supertest for testing
- Helmet for basic security

---

## Installation
1. Clone the repository:

git clone https://github.com/your-username/Bookstore-API.git

2. Navigate to the project folder:

cd Bookstore-API

3. Install dependencies:

npm install

---

## Usage
1. Start the server:
npm start

2. Server runs on:
http://localhost:4000

3. Access Swagger API documentation at:
http://localhost:4000/api-docs

---

## API Documentation
All endpoints are fully documented with Swagger.

Example endpoints:

- GET /books – Retrieve all books
- POST /books – Add a new book
- PUT /books/:id – Update a book
- DELETE /books/:id – Delete a book

Similar endpoints exist for authors and users.

---

## Testing
Run tests using Jest and Supertest:

npm test

Tests cover:
- GET, POST, PUT, DELETE routes
- Input validation
- Error handling

---

## Folder Structure
Bookstore-API/
├─ index.js            # Main application
├─ routes/             # Routes for books, authors, users
├─ controllers/        # Logic for handling routes
├─ middleware/         # Error handling & security
├─ swagger/            # Swagger config
├─ tests/              # Unit & integration tests
├─ data.json           # Sample data storage
├─ package.json
└─ README.md
---

## Endpoints Overview
Books
- GET /books – List all books
- POST /books – Create a new book
- GET /books/:id – Get a book by ID
- PUT /books/:id – Update a book by ID
- DELETE /books/:id – Delete a book by ID

Authors
- GET /authors
- POST /authors
- GET /authors/:id
- PUT /authors/:id
- DELETE /authors/:id

Users
- GET /users
- POST /users
- GET /users/:id
- PUT /users/:id
- DELETE /users/:id

Full documentation is available via Swagger at /api-docs.

---

## License 
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
