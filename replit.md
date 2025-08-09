# Overview

This is a smart doorbell management application built with React on the frontend and Express.js on the backend. The application provides real-time monitoring and control of doorbell devices, featuring live video streaming, person detection with recognition, activity tracking, and remote door control. Users can view live camera feeds, receive notifications for doorbell rings and motion detection, unlock doors remotely, and communicate through two-way audio. The system supports multiple devices per user and includes comprehensive settings management for customizing device behavior.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses a modern React stack with TypeScript and Vite for development. The UI is built with shadcn/ui components and Radix UI primitives, styled with Tailwind CSS for a mobile-first responsive design. State management is handled through TanStack Query for server state and React hooks for local state. Navigation is implemented using Wouter for client-side routing. The application features a bottom navigation pattern optimized for mobile devices with dedicated pages for dashboard, history, settings, and profile.

## Backend Architecture
The server runs on Express.js with TypeScript, providing a RESTful API and WebSocket server for real-time updates. The application uses a layered architecture with dedicated modules for routing, storage abstraction, and database operations. WebSocket connections enable live notifications and real-time activity updates. The server includes middleware for request logging and error handling, with development-specific features like Vite integration for hot module replacement.

## Data Storage
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes tables for users, devices, activities, recognized persons, device settings, and session management. Drizzle provides migrations and schema validation, while the connection is managed through Neon's serverless PostgreSQL driver. The storage layer implements a repository pattern with a clean interface for data operations.

## Authentication and Session Management
Session management is handled through PostgreSQL-backed sessions using connect-pg-simple middleware. The current implementation includes a mock user system for development purposes, with the architecture prepared for integration with proper authentication providers. User sessions are stored in the database with automatic cleanup of expired sessions.

## Real-time Communication
WebSocket functionality provides bidirectional communication between clients and server. The server maintains active WebSocket connections and broadcasts activity updates, notifications, and device status changes to connected clients. The client automatically reconnects and handles connection state management. This enables features like live activity feeds, instant notifications, and real-time device status updates.

# External Dependencies

## Database Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL database hosting with connection pooling and automatic scaling
- **Drizzle ORM**: Type-safe database toolkit providing migrations, queries, and schema validation

## UI Component Libraries
- **shadcn/ui**: Pre-built component library built on Radix UI primitives with Tailwind CSS styling
- **Radix UI**: Low-level UI primitive components for accessibility and customization
- **Lucide Icons**: Icon library for consistent iconography throughout the application

## Development Tools
- **Vite**: Build tool and development server with hot module replacement and optimized bundling
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling

## Communication Protocols
- **WebSocket (ws)**: Real-time bidirectional communication for live updates and notifications
- **HTTP/REST**: Standard API communication for CRUD operations and device control

The application is designed to be deployed as a full-stack web application with the Express server serving both the API and static frontend assets. The modular architecture allows for easy extension with additional features like push notifications, advanced AI recognition, or integration with smart home platforms.