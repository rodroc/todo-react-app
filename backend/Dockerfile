FROM node:18.20.8-alpine3.21

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3001
EXPOSE 3306

