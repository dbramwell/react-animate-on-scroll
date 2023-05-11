FROM node:18

WORKDIR /app
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get install -y google-chrome-stable
COPY package.json .
RUN npm install
RUN mkdir demo
COPY demo/package.json demo
RUN cd demo && npm install && npm install ..