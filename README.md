# Banking System Backend 🏦

A backend banking system built to understand how real-world banking operations work behind the scenes, including user accounts, secure transactions, ledger tracking, balance calculation, and automated email notifications.

## Features

- User registration and login
- Password hashing and validation
- JWT authentication and authorization
- Cookie-based authentication
- System-user authorization
- Account creation and management
- Account status management
- Secure money transactions
- Transaction status tracking
- Idempotency to prevent duplicate transactions
- Debit and credit ledger entries
- Balance calculation using MongoDB aggregation
- MongoDB transactions with commit and rollback
- Automated registration and transaction email notifications
- API testing using Postman

## What I Learned

This project helped me move from basic backend APIs to more advanced backend concepts such as:

- Authentication and authorization middleware
- MongoDB relationships using ObjectId references
- Mongoose schemas, methods and indexes
- Aggregation pipelines
- Database sessions and transactions
- Ledger-based balance calculation
- Idempotency and transaction consistency
- OAuth2 integration with external services
- Debugging and handling backend errors

## Improvement From Previous Projects

Compared to my earlier backend projects, this project involves more complex business logic and multiple backend components working together.

Instead of only creating APIs and performing database operations, I learned how to design a flow involving authentication, authorization, transactions, ledgers, data consistency, and external email services.

## Tech Stack

Node.js • Express.js • MongoDB • Mongoose • JWT • bcrypt • Nodemailer • Google OAuth2 • Postman

## Project Flow

User → Authentication → Account → Transaction → Ledger → Balance → Email Notification

## Project Goal

The goal of this project was to understand how a banking backend works as a complete system and to strengthen my practical knowledge of backend development by connecting authentication, accounts, transactions, ledgers, database operations, and notifications together.
