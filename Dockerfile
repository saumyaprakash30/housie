FROM ubuntu

RUN apt update
RUN apt install -y npm
RUN apt install -y nodejs


COPY . .

RUN npm install

ENTRYPOINT ["npm", "start"]