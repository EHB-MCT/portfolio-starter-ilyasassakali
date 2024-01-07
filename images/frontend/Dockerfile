# Use a lightweight Node.js image as the base
FROM node:latest

# Set the working directory within the container
WORKDIR /usr/app/frontend

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Copy the rest of the application source code
COPY . .

# Execute the build command to prepare the application for production
RUN npm run build

# Expose port 3000 for the React application
EXPOSE 3000

# Define the default command to start the React application
CMD ["npm", "start"]

