# Use Node.js image to build the frontend
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the frontend (output goes to /app/build)
RUN npm run build

# Use a lightweight web server to serve the built files
FROM nginx:alpine

# Copy the built frontend files to the nginx web root
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
