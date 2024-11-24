# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of your frontend code to the container
COPY . .

# Expose port 3000 for frontend
EXPOSE 3000

# Start the frontend app (use nodemon for development)
CMD ["npm", "start"]
