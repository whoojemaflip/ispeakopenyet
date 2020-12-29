https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/

docker build -t lift_api .
docker run -p 9000:8080 lift_api:latest
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'

# dont have time to debug IAM perms, so ran this in web console
aws ecr create-repository --repository-name lift_api --image-scanning-configuration scanOnPush=true --profile ispeakopen --region us-east-1

docker tag lift_api:latest 155331608885.dkr.ecr.us-east-1.amazonaws.com/lift_api:latest

aws ecr get-login-password --profile ispeakopen --region us-east-1 | docker login --username AWS --password-stdin 155331608885.dkr.ecr.us-east-1.amazonaws.com

docker push 155331608885.dkr.ecr.us-east-1.amazonaws.com/lift_api:latest

# Actual URL (takes ~12s to exec)
https://cms6ky5e1l.execute-api.us-east-1.amazonaws.com/default/lift_api
