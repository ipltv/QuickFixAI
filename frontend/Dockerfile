# Dockerfile for the frontend service of QuickFixAI
# Use the official Node.js 22 LTS image for the build stage
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .

# Run the application build
# RUN npm run build

# Set environment variable for production
ENV NODE_ENV=development
ENV VITE_BACKEND_URL=http://backend:3001

# Use a lightweight Nginx web server to serve static files
FROM nginx:alpine

# Copy the built files to the Nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80, which Nginx will listen on
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]