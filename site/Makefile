AWS_PROFILE=ispeakopen
BUCKET=s3://alpinelifts.ca

build:
	node run build

deploy:
	aws --profile $(AWS_PROFILE) s3 sync ./dist/ $(BUCKET) --acl public-read

release:
	build deploy
