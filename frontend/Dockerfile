# Use the official nginx image as a base
FROM nginx:alpine

# Copy the HTML and static files into the appropriate location in the container
COPY ./index.html /usr/share/nginx/html/
COPY ./front_main/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
