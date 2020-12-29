REPO=155331608885.dkr.ecr.us-east-1.amazonaws.com
CONTAINER=update_lift_status
AWS_PROFILE=ispeakopen

build:
	docker build -t ${CONTAINER} .

tag:
	docker tag $(CONTAINER):latest $(REPO)/$(CONTAINER):latest

login:
	aws ecr get-login-password --profile $(AWS_PROFILE) --region us-east-1 | docker login --username AWS --password-stdin $(REPO)

push:
	docker push $(REPO)/$(CONTAINER):latest

release: build tag login push
