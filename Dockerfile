FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's caching mechanism
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application files
COPY . .

# Expose the port your app is running on
EXPOSE 3001

# Start the server using nodemon
CMD ["nodemon", "server.js"]
