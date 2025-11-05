# Lapis.bot Website

A web application for managing Minecraft location coordinates saved through the Lapis Discord bot. This site provides a user-friendly interface to view, add, edit, and delete saved locations, complementing the Discord bot's command-based interface.

## Phase

Project is currently in Phase 1 of development - setting up the basic features
listed below. 

## Purpose

Lapis.bot was created to solve a common problem for Minecraft players: keeping track of important locations in their worlds. Instead of scrolling through screenshots or manually writing down coordinates, players can use the Discord bot to save locations and then access them through this web interface.

The website serves as a dashboard where authenticated users can:
- View all their saved Minecraft locations
- Add new locations with coordinates (X, Y, Z)
- Edit existing location details
- Upload images associated with locations
- Connect their Discord account to sync locations saved through the bot

## Tech Stack

### Frontend
- **React 19** - Modern React with the latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **AWS Amplify** - Authentication via AWS Cognito
- **Reagraph** - Interactive graph visualization for system architecture
- **React Three Fiber (drei)** - 3D graphics and visualizations

### Backend Infrastructure (AWS)
- **EC2** - Hosts the Discord bot and handles user interactions
- **API Gateway** - RESTful API endpoints for the website and bot
- **Lambda** - Serverless functions for CRUD operations and seed processing
- **DynamoDB** - NoSQL database storing location data and user information
- **S3** - Object storage for location images
- **AWS Secrets Manager** - Secure credential management
- **AWS Cognito** - User authentication and authorization

### Additional Integrations
- **Discord OAuth** - Connect Discord accounts to sync bot-saved locations

## Features

### Authentication
- User sign-up and sign-in via AWS Cognito
- Protected routes for authenticated users
- Session management and sign-out functionality

### Dashboard
- View up to 10 saved locations per user
- Location cards displaying:
  - Name and type (Overworld, Nether, Stronghold, etc.)
  - Coordinates (X, Y, Z)
  - Associated images
- Add new locations via modal form
- Edit location details inline
- Delete locations
- Upload images for locations

### Discord Integration
- OAuth flow to connect Discord accounts
- Sync locations saved through Discord bot commands
- Unified experience across Discord and web interface

### Documentation
- Interactive command reference showcasing all Discord bot commands
- System architecture diagram visualizing AWS infrastructure
- Responsive design for desktop and mobile viewing
