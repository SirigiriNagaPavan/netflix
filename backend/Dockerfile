# Step 1: Use Node.js official image as a base
FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ../package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "backend/server.js"]
