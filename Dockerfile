FROM node

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build 

EXPOSE 4000

CMD ["npm", "run", "start:dev"]