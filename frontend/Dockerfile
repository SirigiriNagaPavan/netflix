FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Run build command to create production build
RUN npm run build

# Stage 2: Serve the production build using Nginx
FROM nginx:alpine

# Copy the build files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx will listen on
EXPOSE 80

# Start Nginx server
CMD ["nginx","-g","daemon off;"]