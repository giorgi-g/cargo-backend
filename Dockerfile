FROM node:16.13.0-alpine

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

WORKDIR /usr/src/app

COPY . .

RUN chown -R node:node /usr/src/app

USER node

RUN npm install -g pnpm

ADD --chown=node:node ./package*.json ./

RUN echo "$APP_VERSION"
RUN npm ci
RUN npm run build

RUN printenv

CMD ["npm", "start", "prod"]

