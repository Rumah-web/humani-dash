# use the official ubuntu image
FROM ubuntu:latest as base
WORKDIR /usr/src

COPY package*.json ./

ARG NODE_VERSION=20
ENV AUTH_SECRET=BLuHexCSSyrYsZOAlk9xrcmpqPtLiLvBRb8eN9EcOE4=
ENV DATABASE_URL="postgres://postgres:2bhor33251ylEq6nJPnwCUEsTNyYrtacyDsBJTAylpc92SWgjJQbQsdE86DI7mMW@45.118.135.134:5533/hcs?schema=public&pool_timeout=0&connect_timeout=300"
ENV PATH_UPLOAD="public/upload"
ENV DIR_UPLOAD="upload"
ENV API_ASSETS="media/api/assets/"
ENV API_ASSETS_HOST="https://dash.humanicode.com/"
ENV AUTH_TRUST_HOST=true
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install unzip && \
    apt-get install -y --no-install-recommends libvips42

RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.25" && \
    ln -s $HOME/.bun/bin/bun /usr/local/bin/bun
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n && \
    bash n $NODE_VERSION && \
    rm n && npm install -g n

RUN npm install -g pm2

# install dependency

RUN bun --version
RUN bun install

COPY . .

# prisma generate and db pull
RUN cd ./prisma && bun prisma db pull && bun prisma generate

RUN bun add sharp
RUN bun run build

EXPOSE 6000
CMD [ "pm2-runtime", "bun run start"]