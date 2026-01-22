//Dockerfile

# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage (Nginx)
FROM nginx:alpine
# React의 build 폴더 내용을 Nginx 웹 폴더로 복사
COPY --from=build /app/build /usr/share/nginx/html
# 80포트 개방
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]