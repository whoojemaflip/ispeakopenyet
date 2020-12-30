FROM amazon/aws-lambda-nodejs:12

COPY package.json ./
RUN npm install

COPY app.js ./

CMD [ "app.lambdaHandler" ]
