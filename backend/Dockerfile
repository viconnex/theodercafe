FROM gcr.io/google-appengine/nodejs

WORKDIR /var/www

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN npm run build

CMD sh -c "npm run start:prod"
