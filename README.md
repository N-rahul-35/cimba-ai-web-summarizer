﻿# WebSummarizer

A comprehensive web content summarization platform built with a microservices architecture using FastAPI, Spring Boot, and Scala.

## Project Overview

WebSummarizer is a powerful application that extracts, processes, and summarizes content from websites. The project utilizes a modern tech stack with multiple services working together:

- **FastAPI Service**: Handles the core summarization functionality and API endpoints
- **Spring Boot Service**: Manages business logic and integration components
- **Scala Module**: Provides specialized data processing capabilities
- **PostgreSQL Database**: Stores website content, summaries, and user data
- **Modern Frontend**: Delivers an intuitive user interface for interacting with the system

## Features

- **URL Analysis**: Process any website URL to generate a summary
- **Content Extraction**: Intelligent removal of ads, navigation elements, and other clutter
- **Customizable Summaries**: Adjust length and focus areas of generated summaries
- **User History**: Save and revisit previously summarized websites
- **API Access**: Full programmatic access to the summarization engine
- **Multi-format Output**: Get summaries in plain text, HTML, or structured JSON

## Technology Stack

- **Backend**:
  - Python (FastAPI) for the core summarization service
  - Java (Spring Boot) for business logic and integration
  - Scala for specialized data processing
- **Database**: PostgreSQL
- **Deployment**: Docker containerization
- **Testing**: Unit and integration testing frameworks

## Installation & Setup

### Prerequisites

- Docker and Docker Compose
- JDK 11 or newer
- Python 3.8 or newer
- Node.js 14 or newer (for frontend development)
- PostgreSQL client (optional, for direct DB access)

### Docker Deployment

```bash
# Clone the repository
git clone https://github.com/yourusername/websummarizer.git

# Navigate to project directory
cd websummarizer

# Start all services
docker-compose up
```

The application will be available at http://localhost:3000

### Manual Development Setup

1. Set up the database:

```bash
# Create PostgreSQL database
createdb websummarizer
```

2. Start the FastAPI service:

```bash
cd python-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. Start the Spring Boot service:

```bash
cd backend
./gradlew bootRun
```

4. Start the frontend:

```bash
cd frontend
npm install
npm start
```

## API Reference

### FastAPI Endpoints

- `GET /api/summarize?url={website_url}` - Generate a summary for the specified URL
- `POST /api/summarize` - Generate a summary with customized parameters
- `GET /api/summaries` - Retrieve previously generated summaries

### Spring Boot Endpoints

- `GET /api/users/{user_id}/history` - Get summary history for a specific user
- `POST /api/analyze` - Perform deep content analysis on a website

## Configuration

The project uses environment variables for configuration. Create a `.env` file in the root directory:

```
# Database settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=websummarizer
DB_USER=postgres
DB_PASSWORD=your_password

# API settings
FASTAPI_PORT=8000
SPRING_PORT=8080
```
## demo video link
https://drive.google.com/file/d/1_UjlLZY0rL7ilUg9GK2e2Sj2PX15ncP4/view?usp=sharing
