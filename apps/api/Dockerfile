FROM node:22-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
COPY src ./src
COPY test ./test
RUN npm install
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]