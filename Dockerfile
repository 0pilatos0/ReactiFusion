FROM oven/bun:latest

COPY . .

ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

RUN apt update \
    && apt install -y curl

RUN bun install

RUN bun commands.ts

RUN bun run prisma:generate

ENTRYPOINT [ "bun", "run" , "start" ]