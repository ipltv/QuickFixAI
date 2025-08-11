# Dockerfile for the backend service of QuickFixAI
# Use the official Node.js 22 LTS image
FROM node:22-alpine


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application 
# RUN npm run build

# Expose the port on which your app runs (e.g., 3001)
EXPOSE 3001
# Set environment variable for production
ENV NODE_ENV=development
ENV FRONTEND_URL=http://localhost:80

# Command to run the application
CMD ["npm", "start"]