FROM node:12.16-alpine As development

WORKDIR /backend

COPY package*.json ./

RUN npm install -g @nestjs/cli
RUN npm install --only=development

COPY . .
RUN ls
RUN npm run build

FROM node:12.16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /backend

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /dist ./dist

CMD ["node", "dist/main"]