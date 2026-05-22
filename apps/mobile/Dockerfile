FROM node:22-alpine
WORKDIR /app
COPY package.json tsconfig.json app.json nativewind-env.d.ts App.tsx ./
RUN npm install
CMD ["npm", "run", "start", "--", "--tunnel"]