FROM node:22-alpine AS build

WORKDIR /app

COPY . .
RUN npm ci

ARG ANGULAR_BUILD_CONFIG
RUN test -n "$ANGULAR_BUILD_CONFIG" && npm run build -- --configuration=$ANGULAR_BUILD_CONFIG

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["sh", "-c", "sed -i 's/listen       80;/listen 8080;/' /etc/nginx/conf.d/default.conf 2>/dev/null || true && nginx -g 'daemon off;'"]
