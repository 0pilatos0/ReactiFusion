FROM oven/bun:latest

COPY ./ ./

RUN bun install

RUN bunx prisma generate

RUN bun commands.ts

ENTRYPOINT [ "bun", "run" , "index.ts" ]