FROM node:12.18.3-alpine

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent

COPY . ./

# start app
CMD ["npm", "start"]