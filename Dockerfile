FROM oven/bun:latest

COPY . .
RUN bun install

# https://github.com/oven-sh/bun/issues/4848
RUN apt update \
    && apt install -y curl
ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

RUN bun commands.ts

RUN bun run prisma:generate

ENTRYPOINT [ "bun", "run" , "start" ]