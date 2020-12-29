# Develop

Run the tests:

```
yarn install
npm run test
```

To run the full lambda handler function:

`npm run update`

# Test

```
make build
docker run -p 9000:8080 -e AWS_ACCESS_KEY_ID={access key} -e AWS_SECRET_ACCESS_KEY={secret access key} update_lift_status:latest
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

# Deploy

The first time, you'll need to create a repo in ECR

```
aws ecr create-repository --repository-name update_lift_status --image-scanning-configuration scanOnPush=true --profile ispeakopen --region us-east-1
```

Build and deploy the docker container `make release`

Then you'll have to manually visit the function in [AWS Lambda](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/update_lift_status?tab=image) and "Deploy new image".
