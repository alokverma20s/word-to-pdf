# Use Node.js base image
FROM node:18

# Install LibreOffice and qpdf (for PDF conversion and encryption)
RUN apt-get update && \
    apt-get install -y libreoffice qpdf && \
    apt-get clean

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose the server port (e.g., 3000)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
