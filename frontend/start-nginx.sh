#!/bin/sh
envsubst '${API_BASE_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -g 'daemon off;'
