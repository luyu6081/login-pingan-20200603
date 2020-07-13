FROM openresty/openresty:alpine
COPY dist /usr/local/openresty/nginx/html/
