# Step 1: collect django statics
FROM node:12-alpine as builder
WORKDIR /usr/app
COPY . .
RUN npm install
ENV REACT_APP_ENV=production
# Change me!
RUN npm run build

# Step 2: Put statics where they can be served by Nginx
FROM nginx:1.17-alpine
COPY --from=builder /usr/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf