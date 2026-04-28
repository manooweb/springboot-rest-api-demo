FROM node:22-alpine AS build

WORKDIR /app

COPY . .
RUN npm ci

RUN npm run build -- --configuration=production

FROM nginx:1.27-alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 8080
