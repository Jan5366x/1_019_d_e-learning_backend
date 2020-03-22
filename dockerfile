FROM node:latest

WORKDIR /app/

ADD build/          /app/build/
ADD node_modules/   /app/node_modules/

# Just for testing puroses...
EXPOSE 3000
CMD ["node", "/app/build/app/app.js"]
