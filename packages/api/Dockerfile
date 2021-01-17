FROM node:12

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3333

ENV MONGODB_URI=mongodb://aircnc_mongo:27017

CMD yarn dev
