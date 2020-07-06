FROM node:14.5

WORKDIR /app

COPY package*.json ./

RUN npm install -g node-gyp

RUN npm i

COPY . .

#EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start:prod" ]

