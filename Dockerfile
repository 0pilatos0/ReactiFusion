FROM oven/bun:latest

COPY ./ ./

RUN bun install
RUN bun commands.ts
ENTRYPOINT [ "bun", "run" , "index.ts" ]