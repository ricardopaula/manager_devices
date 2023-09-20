FROM node:19-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3030

CMD ["npm", "run", "dev"]
