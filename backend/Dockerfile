FROM node:21-bookworm-slim
RUN apt-get update -y && apt-get install -y openssl bash

RUN npm install pm2 -g

WORKDIR /srv/backend
RUN chown node:node /srv/backend

USER node
COPY --chown=node:node . .
RUN npm install
RUN npm run build


EXPOSE 8000

CMD ["npx", "pm2-runtime", "./dist/server.js"]