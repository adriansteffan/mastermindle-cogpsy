FROM node:21-bookworm-slim

RUN apt-get update -y && apt-get install -y openssl bash
RUN npm install pm2 -g

WORKDIR /srv/backend

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

COPY --chown=node:node . .

RUN npm install
RUN npm run build

EXPOSE 8000

ENTRYPOINT ["bash", "entrypoint.sh"]