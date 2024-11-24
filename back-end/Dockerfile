# Use the official Node.js image from the Docker Hub
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# If you're using nodemon, install it globally (for development)
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose the port your application will run on
EXPOSE 3001

# Start the app using Nodemon for development, or use "node" for production
CMD ["npm", "start"]
