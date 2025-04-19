
# Use the Node.js LTS image as the base
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the development port
EXPOSE 3000

# Command to start the app in development mode
CMD ["npm", "run", "start:migrate:dev"]
