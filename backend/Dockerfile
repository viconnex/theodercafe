FROM gcr.io/google-appengine/nodejs as development

WORKDIR /var/www

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM gcr.io/google-appengine/nodejs as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /var/www

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /var/www/dist ./dist

CMD sh -c "npm run start:prod"
