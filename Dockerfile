# Giai đoạn build
FROM node:20-alpine AS build
WORKDIR /app

# Copy file package để cài đặt thư viện trước
COPY package*.json ./

# SỬA DÒNG NÀY: Thêm --legacy-peer-deps để bỏ qua xung đột phiên bản React 19
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Giai đoạn chạy với Nginx
FROM nginx:alpine
# Copy file build từ giai đoạn trước vào Nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
