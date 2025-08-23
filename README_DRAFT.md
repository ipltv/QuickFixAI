# QuickFixAI

# QuickFixAI - AI-Powered Support Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

QuickFixAI is an intelligent, multi-client support assistant designed specifically for quick-service restaurants. It empowers staff to resolve technical issues quickly by providing real-time, AI-generated troubleshooting advice based on the unique equipment and knowledge base of each client.

This repository contains the full-stack application, including the Node.js backend and the React frontend.

**GitHub Repo:** [https://github.com/ipltv/QuickFixAI.git](https://github.com/ipltv/QuickFixAI.git)

---

## Key Features

- **Role-Based Access Control (RBAC)**: Pre-defined roles (`staff`, `support`, `client_admin`, `system_admin`) with granular permissions.
- **Multi-Client Architecture**: Complete data isolation between different restaurant clients, each with their own users, equipment, and knowledge base.
- **Dynamic AI Suggestions**: When a ticket is created, the system uses semantic search to find relevant articles and provides an AI-generated solution.
- **Self-Improving Knowledge Base**: Proven solutions from highly-rated support tickets are automatically added to a `resolved_cases` database, allowing for instant and accurate answers to future similar problems.
- **Real-Time Updates**: Utilizes WebSockets to provide instant updates, such as new messages in a ticket's conversation history.
- **Admin Dashboards**: Comprehensive dashboards for both system admins (managing clients, etc.) and client admins (managing users, equipment, categories, and knowledge base articles).

---

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Redux Toolkit, Material UI
- **Database**: PostgreSQL with the `pgvector` extension for semantic search
- **Authentication**: JSON Web Tokens (JWT) with access and refresh tokens
- **AI**: OpenAI API for embeddings (`text-embedding-3-small`) and chat completions (`gpt-4o-mini`)
- **Real-Time**: Socket.IO
- **Deployment**: Nginx, PM2, Docker (optional)

---

## Deployment Guide (Single Linux Server with Nginx)

This guide will walk you through deploying the entire QuickFixAI application (frontend, backend, and database) on a single Linux server (e.g., Ubuntu 22.04) and serving it under the domain `quickfixai.platovich.com`.

### Step 1: Server Preparation

1.  **Update Your Server**:

    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

2.  **Install Node.js, Git, and PM2**:

    ```bash
    # Install Node.js (v22 or later is recommended)
    curl -fsSL [https://deb.nodesource.com/setup_22.x](https://deb.nodesource.com/setup_22.x) | sudo -E bash -
    sudo apt install -y nodejs git

    # Install PM2, a process manager for Node.js
    sudo npm install pm2 -g
    ```

3.  **Install Nginx**:
    ```bash
    sudo apt install -y nginx
    ```

### Step 2: Database Setup (PostgreSQL + pgvector)

1.  **Install PostgreSQL**:

    ```bash
    sudo apt install -y postgresql postgresql-contrib
    ```

2.  **Install pgvector Extension**:

    ```bash
    # For PostgreSQL 15+ on Ubuntu 22.04+
    sudo apt install -y postgresql-15-pgvector
    ```

3.  **Create Database and User**:

    ```bash
    # Log in as the default postgres user
    sudo -u postgres psql

    # In the psql shell, run the following commands:
    CREATE DATABASE quickfixai_db;
    CREATE USER quickfixai_user WITH ENCRYPTED PASSWORD 'your_strong_password_here';
    GRANT ALL PRIVILEGES ON DATABASE quickfixai_db TO quickfixai_user;
    ALTER ROLE quickfixai_user SET search_path = app, public;
    \c quickfixai_db
    CREATE SCHEMA app AUTHORIZATION quickfixai_user;
    CREATE EXTENSION IF NOT EXISTS vector;
    \q
    ```

### Step 3: Application Deployment

1.  **Clone the Repository**:

    ```bash
    git clone [https://github.com/ipltv/QuickFixAI.git](https://github.com/ipltv/QuickFixAI.git)
    cd QuickFixAI
    ```

2.  **Configure Backend Environment**:

    - Navigate to the `backend` directory: `cd backend`
    - Create a `.env` file: `nano .env`
    - Paste the following content, replacing placeholder values with your actual production secrets and database credentials.

    ```env
    # --- Database ---
    DATABASE_URL="postgresql://quickfixai_user:your_strong_password_here@localhost:5432/quickfixai_db"

    # --- Authentication (JSON Web Tokens) ---
    JWT_SECRET=YOUR_RANDOM_JWT_SECRET
    JWT_SECRET_EXPIRATION=15m
    JWT_REFRESH_SECRET=YOUR_RANDOM_JWT_REFRESH_SECRET
    JWT_REFRESH_SECRET_EXPIRATION=7d

    # --- Application URLs & Ports ---
    FRONTEND_URL="[https://quickfixai.platovich.com](https://quickfixai.platovich.com)"
    PORT=3001

    # --- OpenAI API ---
    OPENAI_API_KEY=YOUR_OPENAI_API_KEY
    AI_EMBEDDING_MODEL="text-embedding-3-small"
    AI_SUGGESTIONS_MODEL="gpt-4o-mini"
    RESOLVED_CASE_DISTANCE_THRESHOLD=0.2

    # --- Node Environment ---
    NODE_ENV="production"
    ```

3.  **Install Backend Dependencies, Run Migrations and Build**:

    ```bash
    npm install
    npm run migrate:prod
    npm run build
    npm run seed:run # Optional: to populate initial data
    ```

4.  **Configure Frontend Environment**:

    - Navigate to the `frontend` directory: `cd ../frontend`
    - Create a `.env` file: `nano .env`
    - Paste the following content. This points the frontend to the backend API via the domain.

    ```env
    VITE_API_URL=[https://quickfixai.platovich.com/api](https://quickfixai.platovich.com/api)
    VITE_WS_URL=[https://quickfixai.platovich.com](https://quickfixai.platovich.com)
    ```

5.  **Install Frontend Dependencies and Build**:
    ```bash
    npm install
    npm run build
    ```
    This will create a `dist` directory containing the optimized, static frontend files.

### Step 4: Nginx Configuration (Reverse Proxy)

1.  **Create a New Nginx Configuration File**:

    ```bash
    sudo nano /etc/nginx/sites-available/quickfixai.platovich.com
    ```

2.  **Paste the Following Configuration**: This config tells Nginx how to handle requests.

    - Requests for `/api` or `/socket.io` are proxied to your backend Node.js server.
    - All other requests are served the static files from your frontend's `dist` folder.

    **Important**: Replace `/path/to/your/QuickFixAI/` with the actual absolute path to your project directory.

    ```nginx
    server {
        listen 80;
        server_name quickfixai.platovich.com;

        # Path to your frontend build directory
        root /path/to/your/QuickFixAI/frontend/dist;
        index index.html;

        location / {
            try_files $uri /index.html;
        }

        # Proxy API requests to the backend server
        location /api {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Proxy WebSocket connections
        location /socket.io {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
        }
    }
    ```

3.  **Enable the Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/quickfixai.platovich.com /etc/nginx/sites-enabled/
    sudo nginx -t # Test the configuration for errors
    sudo systemctl restart nginx
    ```

### Step 5: Start the Backend with PM2

1.  **Navigate to the Backend Directory**:

    ```bash
    cd /path/to/your/QuickFixAI/backend
    ```

2.  **Start the Server**:
    ```bash
    pm2 start dist/server.js --name quickfixai-backend
    pm2 startup # To make PM2 restart on server reboot
    pm2 save
    ```

### Step 6: Secure with SSL (Let's Encrypt)

1.  **Install Certbot**:

    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

2.  **Obtain and Install the Certificate**:
    ```bash
    sudo certbot --nginx -d quickfixai.platovich.com
    ```
    Certbot will automatically detect your Nginx configuration, obtain a certificate, and configure Nginx to use it. It will also set up a cron job for automatic renewal.

application should now be live and secure at `https://quickfixai.platovich.com`.
