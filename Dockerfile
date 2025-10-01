FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json package-lock.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "src/index.js" ]