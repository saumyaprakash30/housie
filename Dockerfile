FROM node

COPY . .

RUN npm install

ENTRYPOINT ["npm", "start"]