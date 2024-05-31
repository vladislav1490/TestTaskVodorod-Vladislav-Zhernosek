FROM node:21

WORKDIR /app

COPY . .

RUN npm install

RUN npm install --global gulp-cli gulp-sass

RUN gulp sass-compile

EXPOSE 3000

CMD ["node", "app.js"]
