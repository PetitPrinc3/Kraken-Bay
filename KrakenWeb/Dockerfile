FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm ci

EXPOSE 3306

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]