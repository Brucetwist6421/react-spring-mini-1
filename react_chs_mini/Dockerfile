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
# 커스텀 설정 파일을 Nginx 설정 폴더로 복사.
COPY default.conf /etc/nginx/conf.d/default.conf
# 80포트 개방
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]