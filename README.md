# Lattice Online Vending Platform (OVP)

Welcome to the Lattice Online Vending Platform, a comprehensive, microservices-based application for managing all aspects of a modern vending machine business.

## Table of Contents

- [Lattice Online Vending Platform (OVP)](#lattice-online-vending-platform-ovp)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Getting Started (Direct Connection Method)](#getting-started-direct-connection-method)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Backend Setup](#2-backend-setup)
      - [a. Create the Database](#a-create-the-database)
      - [b. Configure Environment Variables](#b-configure-environment-variables)
      - [c. Install Backend Dependencies](#c-install-backend-dependencies)
    - [3. Frontend Setup](#3-frontend-setup)
      - [a. Configure API URLs in Frontend ( if you changed ports from backend services)](#a-configure-api-urls-in-frontend--if-you-changed-ports-from-backend-services)
      - [b. Install Frontend Dependencies](#b-install-frontend-dependencies)
    - [Running the System](#running-the-system)
    - [Usage](#usage)
      - [Default Admin User](#default-admin-user)
      - [Service Endpoints](#service-endpoints)
    - [Project Structure](#project-structure)
    - [(Optional) Advanced Setup with API Gateway (Not completed - therefore temporary disabled)](#optional-advanced-setup-with-api-gateway-not-completed---therefore-temporary-disabled)
    - [Roadmap \& Future Enhancements](#roadmap--future-enhancements)
      - [1. Complete API Gateway Integration](#1-complete-api-gateway-integration)
      - [2. Containerization with Docker](#2-containerization-with-docker)
      - [3. Scalability \& Load Balancing](#3-scalability--load-balancing)
      - [4. Service Health Monitoring](#4-service-health-monitoring)
      - [5. Deployment to a Cloud Provider](#5-deployment-to-a-cloud-provider)
    - [6. Comprehensive Testing Strategy](#6-comprehensive-testing-strategy)
      - [a. Backend Testing (for each Microservice)](#a-backend-testing-for-each-microservice)
      - [b. Frontend Testing](#b-frontend-testing)
      - [c. End-to-End (E2E) Testing](#c-end-to-end-e2e-testing)

## Features

- **Authentication:** Secure user registration and login with JWT.
- **User Management:** (Admin) Full CRUD operations for managing system users and roles.
- **Inventory Management:** (Admin/Inventory Manager) Full CRUD operations for stock items, with low-stock tracking.
- **Billing & Sales:** (Billing Clerk) Point-of-sale interface to record transactions, which automatically updates inventory.

## Architecture

This project follows a microservices architecture. Each core business domain is handled by a separate, independent service. The primary setup involves the frontend communicating directly with each microservice. An optional API Gateway is included for future implementation.

- **Frontend:** A React (Vite) multi-page application.
- **Auth Service:** Manages user registration, login, and token validation.
- **Admin Service:** Manages users, roles, and permissions.
- **Inventory Service:** Manages product stock, SKUs, and pricing.
- **Billing Service:** Manages sales transactions and receipts.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TanStack Query, TailwindCSS, shadcn/ui, Sonner (Toasts)
- **Backend (All Services):** Node.js, Express.js, Drizzle ORM
- **Database:** PostgreSQL (I recommend using a cloud provider like Neon.tech)
- **Development:** `concurrently` to run all services simultaneously.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js:** Version 18.x or higher.
- **npm** (or **yarn**): For managing dependencies.
- **PostgreSQL Database:** A running PostgreSQL instance. You can use a local installation or a cloud service like [Neon](https://neon.tech/).

---

## Getting Started (Direct Connection Method)

This guide will help you run the application with the frontend connecting directly to each microservice.

### 1. Clone the Repository

First, clone the project to your local machine:

```bash
git clone https://github.com/Tony-kan/lattice-online-vending-platform.git
cd lattice-online-vending-platform
```

### 2. Backend Setup
The backend consists of multiple services that share a single database.

#### a. Create the Database
Create a new PostgreSQL database. Note down the full connection string (URL). It will look something like this:
`postgres://USER:PASSWORD@HOST/DATABASE_NAME?sslmode=require`

#### b. Configure Environment Variables
Each backend service needs its own `.env` file for configuration.
*   Navigate to each service directory inside `backend/` (`backend/auth-service`, `backend/admin-service`, etc.).
*   In each of these directories, create a file named `.env.development.local` or `.env.production.local`.
*   Copy the contents from the corresponding `.env.example` file (if provided) or add the variables below.

**Example for `backend/auth-service/.env.development.local`:**
```env
PORT=4000
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_strong_jwt_secret_key"
```
> **IMPORTANT:** Repeat this process for all services, ensuring the `PORT` is unique for each one (`4000`, `4001`, `4002`, `4003`). The `DATABASE_URL` will be the same for all services.

#### c. Install Backend Dependencies
In the **project root directory**, run the following commands to install dependencies for the root project and all microservices.

```bash
# For the root project (to get 'concurrently')
npm install

# For all backend microservices
npm install --prefix backend/auth-service
npm install --prefix backend/admin-service
npm install --prefix backend/inventory-service
npm install --prefix backend/billing-service
```
or 

Go to each directory and run `npm install` manually

### 3. Frontend Setup

#### a. Configure API URLs in Frontend ( if you changed ports from backend services)
Since the API Gateway is not being used, the frontend needs to know the direct URL for each microservice. This is typically handled within the API client files.

*   Navigate to `frontend/src/api/`.
*   Open each API file (`AuthApi.ts`, `AdminApi.ts`, etc.).
*   Ensure the `baseURL` in each `axios.create()` instance points to the correct local service port.

**Example for `frontend/src/api/AdminApi.ts`:**
```ts
const adminApiClient = axios.create({
  baseURL: 'http://localhost:4003/admin', // Points directly to the Admin Service
});
```
**Example for `frontend/src/api/AuthApi.ts`:**
```ts
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/auth', // Points directly to the Auth Service
});
```
> Verify these URLs are correct for all API files.

#### b. Install Frontend Dependencies
In the **project root directory**, run:
```bash
npm install --prefix frontend
```

### Running the System
After completing the setup, you can start all backend services  a single command from the **backend project root directory**.
```bash
npm run dev
```
This command uses `concurrently` to:
- Start the Auth Service on port `4000`.
- Start the Inventory Service on port `4001`.
- Start the Billing Service on port `4002`.
- Start the Admin Service on port `4003`.
 
go to ovp-frontend dir and run the same command 

```bash
npm run dev
```
- Start the Frontend development server on port `5173`.

Your application should now be running and accessible at **http://localhost:5173**.

### Usage
#### Default Admin User
The system does not come with a default user. The first user you create will be an Admin. You can register a user through the application or use `curl` to create one, making sure to hit the direct service URL.
```bash
curl -X POST http://localhost:4000/auth/register \
 -H "Content-Type: application/json" \
 -d '{"email":"admin@example.com","password":"password","role":"ADMIN","name":"Admin User"}'
```
You can then log in with these credentials on the frontend.

#### Service Endpoints
The frontend communicates with these direct service endpoints:
- **Authentication:** `http://localhost:4000/auth/...`
- **Admin:** `http://localhost:4003/admin/...`
- **Inventory:** `http://localhost:4001/inventory/...`
- **Billing:** `http://localhost:4002/billing/...`

### Project Structure
```
lattice-online-vending-platform/

├── backend/
|   |── api-gateway/       # (Optional) The API Gateway service
│   ├── auth-service/      # Authentication microservice
│   ├── admin-service/     # User Management microservice
│   ├── inventory-service/ # Inventory microservice
│   └── billing-service/   # Billing microservice
├── frontend/            # The React frontend application
└── README.md            # This file
```

### (Optional) Advanced Setup with API Gateway (Not completed - therefore temporary disabled)
An API Gateway is included in the `api-gateway` directory. This is the recommended architecture for production as it provides a single, secure entry point for all services. To run the system with the gateway:
1. Follow the backend setup steps as described above.
2. Run `npm install --prefix api-gateway` to install its dependencies.
3. Update the frontend API `baseURL`s in `frontend/src/api/` to point to the gateway's address (e.g., `http://localhost:8080/api/admin`).
4. Modify the root `dev` script in `package.json` to also start the gateway service.
5. The gateway will handle authentication, so you should remove the `authMiddleware` from the individual `admin`, `inventory`, and `billing` services.



### Roadmap & Future Enhancements

This project provides a solid foundation for the Lattice OVP system. The following enhancements are planned to make the platform production-ready, scalable, and resilient.

#### 1. Complete API Gateway Integration
The current primary setup has the frontend communicating directly with each microservice for simplicity. The next major step is to fully integrate the included `api-gateway` service.
- **Goal:** Create a single, secure entry point for all backend traffic.
- **Tasks:**
  - Finalize the gateway's authentication middleware to validate JWTs for all protected routes.
  - Re-route all frontend API calls to point to the gateway's URL (`http://localhost:8080/api/...`).
  - Leverage gateway-level security mechanisms like **rate-limiting** and additional headers via `helmet` to protect all downstream services at once.

#### 2. Containerization with Docker
To ensure a consistent environment for development, testing, and production, the entire application will be containerized.
- **Goal:** Dockerize each microservice and the frontend.
- **Tasks:**
  - Create a `Dockerfile` for each individual service (`auth-service`, `inventory-service`, etc.), the gateway, and the frontend.
  - Create a root `docker-compose.yml` file to define and link all services, including a PostgreSQL database container.
- **Benefit:** A new developer will be able to run the entire system, including the database, with a single command: `docker-compose up`.

#### 3. Scalability & Load Balancing
Once containerized, the system can be configured for high availability and to handle increased load.
- **Goal:** Ensure the system can scale horizontally.
- **Tasks:**
  - Introduce a reverse proxy like **Nginx** or use a cloud-native load balancer (e.g., AWS ELB, Google Cloud Load Balancer).
  - The load balancer will sit in front of the services (or the API Gateway) and distribute incoming traffic across multiple running instances of a container.
  - This allows us to run, for example, three instances of the `inventory-service` to handle heavy traffic without downtime.

#### 4. Service Health Monitoring
To maintain a reliable system in production, we need to know if each microservice is running and healthy.
- **Goal:** Implement health checks for each service.
- **Tasks:**
  - Add a simple `/health` endpoint to each backend service that returns a `200 OK` status if it can connect to the database and is functioning correctly.
  - Configure the load balancer or an external monitoring tool to periodically ping these `/health` endpoints. Unhealthy instances can be automatically terminated and replaced.
- **Future:** Expand this to include centralized logging and distributed tracing for full observability.

#### 5. Deployment to a Cloud Provider
The ultimate goal is to deploy the containerized application to the cloud.
- **Goal:** Make the application publicly accessible and scalable.
- **Tasks:**
  - Choose a container orchestration platform. **Kubernetes (K8s)** is the industry standard for complex microservices, with options like AWS EKS, Google GKE, or DigitalOcean Kubernetes.
  - Simpler alternatives include AWS ECS or deploying containers to a Virtual Private Server (VPS) managed with Docker Compose.
  - Set up a CI/CD pipeline (e.g., using GitHub Actions) to automatically build, test, and deploy new container images when code is merged.


### 6. Comprehensive Testing Strategy
To ensure the reliability and stability of the platform, a multi-layered testing strategy will be implemented for both the frontend and all backend microservices. We will follow the principles of the Testing Pyramid, focusing on a large base of fast unit tests, a healthy number of integration tests, and a small, targeted set of end-to-end tests.

#### a. Backend Testing (for each Microservice)

A dedicated test suite will be created for each service (`auth-service`, `inventory-service`, etc.).

*   **Unit Tests:**
    - **Goal:** To test individual functions, classes, and middleware in complete isolation. These tests are fast and check business logic without external dependencies.
    - **Tasks:**
        - Write tests for utility functions and business logic helpers.
        - Test middleware functions by mocking `req`, `res`, and `next` objects to ensure they call `next()` or send the correct error response.
        - Test controller functions by mocking the database layer (e.g., Drizzle calls) to verify that they correctly handle requests and formulate responses.
    - **Tools:** [**Jest**](https://jestjs.io/) (as an all-in-one test runner, assertion library, and mocking framework).

*   **Integration Tests:**
    - **Goal:** To test each microservice's API endpoints as a whole, ensuring they interact correctly with a real database.
    - **Tasks:**
        - Set up a separate, dedicated test database that is seeded with known data before tests run.
        - Write tests that make actual HTTP requests to the service's endpoints (e.g., `POST /admin/users`).
        - Assert that the HTTP response (status code, body) is correct and that the data in the test database has been changed as expected.
    - **Tools:** [**Jest**](https://jestjs.io/) + [**Supertest**](https://github.com/ladjs/supertest) (for making HTTP requests against the Express app).

#### b. Frontend Testing

The frontend will have its own suite of tests to verify component behavior and user flows.

*   **Unit Tests:**
    - **Goal:** To test individual React components and utility functions in isolation.
    - **Tasks:**
        - Write tests for utility functions like `formatPrice` and `formatTimestamp`.
        - Render individual components (e.g., `Button`, `Card`) and assert that they display correctly based on the props they receive.
        - Test the logic within custom React hooks.
    - **Tools:** [**Vitest**](https://vitest.dev/) (a fast, Vite-native test runner with a Jest-compatible API) + [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/) (for rendering and interacting with components).

*   **Integration Tests:**
    - **Goal:** To test how multiple components work together to create a seamless user experience on a single page, while mocking API calls.
    - **Tasks:**
        - Test complete user flows within a page, such as:
            - Filling out the "Add New User" form and clicking "Save".
            - Adding multiple items to the cart in the `BillingPage` and seeing the total update correctly.
        - All backend API calls will be intercepted and mocked to ensure tests are fast and not dependent on a running backend.
    - **Tools:** [**Vitest**](https://vitest.dev/) + [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/) + [**MSW (Mock Service Worker)**](https://mswjs.io/) (for API mocking).

#### c. End-to-End (E2E) Testing

E2E tests are the final layer, simulating a real user interacting with the entire, fully running system.

*   **Goal:** To verify that critical user journeys work correctly across the full stack (Frontend -> API Gateway -> Microservices -> Database).
*   **Tasks:**
    - Write test scripts for critical paths, such as:
        1. A user registers, logs in, and is redirected to the modules page.
        2. An admin logs in, navigates to the Inventory page, adds a new item, and sees it appear in the table.
        3. A billing clerk logs in, creates a new sale, and verifies that the stock count for the sold item has decreased on the Inventory page.
- **Tools:** [**Cypress**](https://www.cypress.io/) or [**Playwright**](https://playwright.dev/) (to automate a real browser and perform actions as a user would).