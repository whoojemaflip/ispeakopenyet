FROM amazon/aws-lambda-nodejs:12
ENV TZ=America/Vancouver

COPY package.json ./
RUN npm install

COPY app.js ./

CMD [ "app.lambdaHandler" ]
