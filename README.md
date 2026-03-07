# DakarCitoyen - Project Documentation

## Architecture Overview
This project is a microservices-based application built with Spring Boot, Spring Cloud, and MongoDB.

- **Config Server**: Centralized configuration management (Port 8888).
- **Eureka Server**: Service discovery.
- **API Gateway**: Central entry point and routing (Port 8090).
- **User Service**: Handles authentication and user management (Port 8081).
- **Demande Service**: Handles citizen requests (demandes) and их processing (Port 8082).

## Roles
1. **CITOYEN**: A citizen who can create and track requests.
2. **AGENT**: An agent who processes and updates requests.
3. **ADMIN**: An administrator who supervises all requests and manages users.

## API Documentation

### Authentication (User Service)
- `POST /auth/register`: Register a new user.
- `POST /auth/authenticate`: Login and receive a JWT token.

### Demandes (Demande Service)
- `POST /demandes`: Create a new request (Citoyen).
- `GET /demandes/my/{userId}`: Track own requests (Citoyen).
- `GET /demandes`: List all requests (Agent/Admin).
- `PUT /demandes/{id}/status`: Update request status (Agent). Params: `status` (PENDING, IN_REVIEW, APPROVED, REJECTED), `agentId`.
- `POST /demandes/{id}/comments`: Add a comment to a request (Agent).
- `POST /demandes/{id}/documents`: Upload/attach a document URL to a request (Citoyen).

## Test Use Cases

### 1. Citoyen Workflow
1. **Register**: `POST /auth/register` with role `CITOYEN`.
2. **Login**: `POST /auth/authenticate`.
3. **Create Request**: `POST /demandes` with description.
4. **Upload Document**: `POST /demandes/{id}/documents` with document URL.
5. **Track Status**: `GET /demandes/my/{userId}`.

### 2. Agent Workflow
1. **Login**: `POST /auth/authenticate` with role `AGENT`.
2. **Consult Requests**: `GET /demandes`.
3. **Add Comment**: `POST /demandes/{id}/comments`.
4. **Update Status**: `PUT /demandes/{id}/status?status=APPROVED&agentId=agent123`.

## Test Credentials & Roles

The system is pre-configured with the following test users (Password for all: `password123`):

| Role | Email | Purpose |
| :--- | :--- | :--- |
| **Admin** | `admin@dakar.sn` | Manage users and oversee all requests. |
| **Agent** | `agent@dakar.sn` | Process and comment on citizen requests. |
| **Citoyen** | `citoyen@dakar.sn` | Create and track personal requests. |

## Feature Implementation Details
- **JWT Security**: Replaced Keycloak with a custom Spring Security + JWT implementation.
- **Microservices**: Organized into `api-gateway`, `user-service`, and `demande-service`.
- **Dakar Focus**: UI simplified for Sénégal, defaulting country selection to "Sénégal".
