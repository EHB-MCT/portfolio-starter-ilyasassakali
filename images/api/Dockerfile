# Use a lightweight Node.js image as the base
FROM node:latest

# Set the working directory within the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json .

# Install dependencies
RUN npm install --quiet

# Copy the entire application source code
COPY ./ ./

# Define the default command to start the application
CMD ["npm", "start"]
