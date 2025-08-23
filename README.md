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

This guide will walk you through deploying the entire QuickFixAI application (frontend, backend, and database) on a single Linux server (e.g., Ubuntu 22.04) and serving it under a domain.

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

1.  **Install PostgreSQL and pgvector**:

    ```bash
    sudo apt install -y postgresql postgresql-contrib
    # For PostgreSQL 15+ on Ubuntu 22.04+, find the correct version if needed
    sudo apt install -y postgresql-15-pgvector
    ```

2.  **Create Database, User, and Schema**:

    ```bash
    # Log in as the default postgres user
    sudo -u postgres psql

    # In the psql shell, run the following commands:
    CREATE DATABASE quickfixai_db;
    CREATE USER quickfixai_user WITH ENCRYPTED PASSWORD 'your_strong_password_here';

    -- Grant connect privilege to the database
    GRANT CONNECT ON DATABASE quickfixai_db TO quickfixai_user;

    -- Set the default search path for the user to simplify development
    ALTER ROLE quickfixai_user SET search_path = app, public;

    -- Connect to the new database to continue setup
    \c quickfixai_db

    -- Create the 'app' schema and set the user as the owner
    CREATE SCHEMA app AUTHORIZATION quickfixai_user;

    -- Enable the vector extension within the database
    CREATE EXTENSION IF NOT EXISTS vector;

    -- Exit psql
    \q
    ```

### Step 3: Application Deployment & Build

1.  **Clone the Repository**:

    ```bash
    git clone [https://github.com/ipltv/QuickFixAI.git](https://github.com/ipltv/QuickFixAI.git)
    cd QuickFixAI
    ```

2.  **Configure and Build Backend**:

    - Navigate to the `backend` directory: `cd backend`
    - Create and populate the `.env` file: `nano .env` (use the template below)
    - Install dependencies, build the project, and run migrations:

    ```bash
    npm install
    npm run migrate:prod
    npm run build
    npm run seed:prod # To add initial admin account
    ```

3.  **Configure and Build Frontend**:
    - Navigate to the `frontend` directory: `cd ../frontend`
    - Create and populate the `.env` file: `nano .env` (use the template below)
    - Install dependencies and build the static files:
    ```bash
    npm install
    npm run build
    ```

#### **.env Templates**

<details>
    <summary>Click to see backend .env template</summary>

    # --- Database ---
    DATABASE_URL="postgresql://quickfixai_user:your_strong_password_here@localhost:5432/quickfixai_db"

    # --- Authentication (JSON Web Tokens) ---
    # Generate strong random secrets for these
    JWT_SECRET=YOUR_RANDOM_JWT_SECRET
    JWT_SECRET_EXPIRATION=15m
    JWT_REFRESH_SECRET=YOUR_RANDOM_JWT_REFRESH_SECRET
    JWT_REFRESH_SECRET_EXPIRATION=7d

    # --- Application URLs & Ports ---
    FRONTEND_URL="https://your_domain_here.com"
    PORT=3001

    # --- OpenAI API ---
    OPENAI_API_KEY=YOUR_OPENAI_API_KEY
    AI_EMBEDDING_MODEL="text-embedding-3-small"
    AI_SUGGESTIONS_MODEL="gpt-4o-mini"
    RESOLVED_CASE_DISTANCE_THRESHOLD=0.2

    # --- Node Environment ---
    NODE_ENV="production"

    # --- Initial System Admin ---
    INITIAL_ADMIN_EMAIL="admin@your_domain_here.com"
    INITIAL_ADMIN_PASSWORD="YourStrongPassword"

</details>

<details>
    <summary>Click to see frontend .env template</summary>
  
    VITE_API_URL=https://your_domain_here.com/api(https://here.com/api)
    VITE_WS_URL=https://your_domain_here.com

</details>

### Step 4: Configure File Permissions

This is a critical step to allow the Nginx web server (running as user `www-data`) to read your project files, which are located in the `/home/ubuntu` directory.

```bash

# Allow the Nginx user to enter the /home/ubuntu directory
sudo chmod 755 /home/ubuntu

# Set correct permissions for all directories and files in your project
sudo find /home/ubuntu/QuickFixAI -type d -exec chmod 755 {} \;
sudo find /home/ubuntu/QuickFixAI -type f -exec chmod 644 {} \;
```

### Step 5: Start the Backend with PM2

1.  **Navigate to the Backend Directory:**

    ```bash
    cd /home/ubuntu/QuickFixAI/backend
    ```

2.  **Start the Server:**
    The `npm run build` command created a `dist` folder. We will now run the compiled server file.

    ```bash
    pm2 start dist/server.js --name quickfixai-backend

    # Configure PM2 to restart automatically on server reboot

    pm2 startup

    # (Follow the instructions printed by the command above)

    pm2 save
    ```

### **Step 6: Nginx Configuration (Reverse Proxy)**

1.  **Create a New Nginx Configuration File:**

    Replace `your_domain_here.com` with your actual domain.

    ```bash
    sudo nano /etc/nginx/sites-available/your_domain_here.com
    ```

2.  **Paste the Following Configuration:**

    Important: Replace `/home/ubuntu/QuickFixAI/` with the actual absolute path to your project directory.

    ```nginx
    server {
    listen 80;
    server_name your_domain_here.com;

    # Path to your frontend build directory
    root /home/ubuntu/QuickFixAI/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Proxy API and WebSocket requests to the backend server
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
    }
    ```

3.  **Enable the Site:**

    ```bash
        sudo ln -s /etc/nginx/sites-available/your_domain_here.com /etc/nginx/sites-enabled/

        sudo nginx -t # Test the configuration
        sudo systemctl reload nginx # Apply changes without downtime
    ```

### **Step 7: Secure with SSL (Let's Encrypt)**

1. **Install Certbot:**

   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain and Install the Certificate:**

   ```bash
   sudo certbot --nginx -d your_domain_here.com
   ```

   Certbot will automatically detect your Nginx configuration, obtain a certificate, configure Nginx to use it, and set up automatic renewal.

Your application should now be live and secure at `https://your_domain_here.com`.

---
