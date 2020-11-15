# https://qiita.com/jakushin/items/dd92075f28fba6b083ca
FROM node:10

WORKDIR /usr/src/app

ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm install

COPY . .

# prodビルト、サーバ起動
RUN npm run build
CMD npm start