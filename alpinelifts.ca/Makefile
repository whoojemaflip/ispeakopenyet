REPO=155331608885.dkr.ecr.us-east-1.amazonaws.com
# also the name of the lambda function
CONTAINER=alpinelifts_site
AWS_PROFILE=ispeakopen
BUCKET=s3://alpinelifts.ca
REGION=us-east-1

.PHONY: build

# Build and deploy container to Lambda

build:
	docker build -t ${CONTAINER} .

tag:
	docker tag $(CONTAINER):latest $(REPO)/$(CONTAINER):latest

login:
	aws ecr get-login-password --profile $(AWS_PROFILE) --region $(REGION) | docker login --username AWS --password-stdin $(REPO)

create_repo:
	aws ecr create-repository --repository-name ${CONTAINER} --image-scanning-configuration scanOnPush=true --profile $(AWS_PROFILE) --region $(REGION)

push:
	docker push $(REPO)/$(CONTAINER):latest

update_function:
	aws lambda update-function-code --profile $(AWS_PROFILE) --function-name $(CONTAINER) --region $(REGION) --image-uri $(REPO)/$(CONTAINER):latest

release: build tag login push update_function

# Build & Deploy static site to S3

build_site:
	bundle exec middleman build

deploy_site:
	aws --profile $(AWS_PROFILE) s3 sync ./build/ $(BUCKET) --acl public-read

deploy: build_site deploy_site
