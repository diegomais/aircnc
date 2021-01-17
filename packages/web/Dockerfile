FROM node:12

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

ENV REACT_APP_API_URL=http://localhost:3333

CMD yarn start
