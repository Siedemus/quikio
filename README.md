# Quikio

## Overview

Quikio is a full-stack application designed to provide real-time communication.

## Tech Stack

### Backend

- **Bun**: JavaScript runtime.
- **TypeScript**: Superset of JavaScript for type safety.
- **Drizzle ORM**: Object-Relational Mapping for database interactions.
- **Bcrypt**: Library for hashing passwords.
- **JSON Web Token (JWT)**: For authentication.
- **WebSocket (ws)**: For real-time communication.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript for type safety.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Router**: For routing.
- **React Spinners**: For loading spinners.
- **Sonner**: For notifications.

## Error Codes

### Backend Error Codes

- **PARSING_ERROR (99)**: Something went wrong during message parsing.
- **VALIDATION_ERROR (100)**: Validation failed: Username or password does not meet the required criteria.
- **DATABASE_ERROR (101)**: A database error occurred while processing the request.
- **PASSWORD_MISMATCH_ERROR (102)**: Password does not match the expected value.
- **WRONG_MESSAGE_EVENT_ERROR (103)**: An unexpected message event was received.
- **EXPIRED_TOKEN (104)**: Your token is probably expired.
- **ALREADY_SUBSCRIBING (105)**: You are already subscribing to this room.
- **ROOM_DOESNT_EXIST (106)**: Room doesn't exist.
- **ALREADY_NOT_SUBSCRIBING (107)**: You are already not subscribing to this room.
- **EXPIRED_OR_MISSMATCHING (108)**: Your token is probably expired or provided data is not matching token data.

### Frontend Error Codes

- **UNEXPECTED_ERROR_TRYING_AGAIN (201)**: An unexpected error occurred. We are trying to reconnect to the server.
- **NOT_HANDLED_ERROR (202)**: An unhandled event was encountered.
- **CANT_CONNECT_TO_SERVER (203)**: Unable to establish a connection with the server. Please check your internet connection and try again later.
- **WEBSOCKET_REF_NULL (204)**: WebSocket reference is null. Please ensure the WebSocket is properly initialized and try again.

## Getting Started

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/quikio.git
   ```

2. Install dependencies for both backend and frontend:
   ```sh
   cd backend
   bun install
   cd ../frontend
   bun install
   ```

### Running the Application

1. Start the backend server:

   ```sh
   cd backend
   bun run dev
   ```

2. Start the frontend development server:
   ```sh
   cd frontend
   bun run dev
   ```
