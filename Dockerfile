# use the official ubuntu image
FROM ubuntu:latest as base
WORKDIR /usr/src

# COPY package*.json ./


ARG NODE_VERSION=20

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install unzip

RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.25" && \
    ln -s $HOME/.bun/bin/bun /usr/local/bin/bun
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n && \
    bash n $NODE_VERSION && \
    rm n && npm install -g n
RUN npm install -g pm2

# install dependency
RUN bun --version
RUN bun install

# copy env for prisma
COPY ./.env-prod ./.env

# prisma generate and db pull
RUN cd ./prisma && bun prisma db pull && bun prisma generate

COPY . .

RUN bun run build

EXPOSE 6000
CMD [ "pm2-runtime", "bun run start"]