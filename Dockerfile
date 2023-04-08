FROM node:16.20
WORKDIR /app/bot

RUN apt-get -y update\
    && apt-get -y upgrade\
    && apt-get install -y ffmpeg

COPY package.json package-lock.json ./
RUN npm ci
COPY ./ ./
RUN npm run build
RUN rm -rf ./src

ENV CLIENT_TOKEN = ""
ENV JOIN_AUTOMATICALLY = ""
ENV MAX_RECORD_TIME_MINUTES = ""

CMD [ "node", "./dist/index.js"]