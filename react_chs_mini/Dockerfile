# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage (Nginx)
FROM nginx:alpine
# Vite는 결과물을 dist 폴더에 생성하므로 경로를 변경합니다.
COPY --from=build /app/dist /usr/share/nginx/html
# 80포트 개방
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]