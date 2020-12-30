REPO=155331608885.dkr.ecr.us-east-1.amazonaws.com
# also the name of the lambda function
CONTAINER=update_lift_status
AWS_PROFILE=ispeakopen
REGION=us-east-1

build:
	docker build -t ${CONTAINER} .

tag:
	docker tag $(CONTAINER):latest $(REPO)/$(CONTAINER):latest

login:
	aws ecr get-login-password --profile $(AWS_PROFILE) --region $(REGION) | docker login --username AWS --password-stdin $(REPO)

push:
	docker push $(REPO)/$(CONTAINER):latest

update_function:
	aws lambda update-function-code --profile $(AWS_PROFILE) --function-name $(CONTAINER) --region $(REGION) --image-uri $(REPO)/$(CONTAINER):latest

release: build tag login push update_function
