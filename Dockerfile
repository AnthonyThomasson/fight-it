FROM node:19.6.1-bullseye as server
COPY server build
WORKDIR /build
RUN yarn && yarn build

FROM node:19.6.1-bullseye as client
COPY app build
WORKDIR /build
RUN yarn && yarn build

FROM node:19.6.1-bullseye
COPY --from=server build/  app/
COPY --from=client build/dist  app/dist/public

WORKDIR /app
CMD ["yarn", "start"]