FROM node:20-alpine

WORKDIR /app

# Upload directory
RUN mkdir -p /app/uploads && chown node:node /app/uploads

COPY package*.json ./
RUN npm install

COPY . .

# Adjust permissions
RUN chown -R node:node /app
USER node

EXPOSE 8080

CMD ["npm", "start"]
