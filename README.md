# Payment Service

A NestJS-based payment service application.

## Description

This is a payment service built with [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient and scalable server-side applications.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Project Structure

```
src/
├── app.controller.ts    # Main application controller
├── app.controller.spec.ts # Controller tests
├── app.module.ts        # Root application module
├── app.service.ts       # Main application service
└── main.ts             # Application entry point
```