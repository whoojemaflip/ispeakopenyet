# alpinelifts.ca

Site builder. Runs in docker container, on lambda. Generally triggered by the update_data function as a downstream on_success destination, but can be kicked manually.

# Site Functionality

No dependencies, very small site.

Refreshes the table contents every minute once loaded.

# Run the site locally

Install middleman and dependencies
`bundle install`

Download a copy of the lift opening times data
`curl https://alpinelifts.ca/opening_times.json -o ./data/opening_times.json`

Run a middleman build
`bundle exec middleman build`

See the results in a browser
`bundle exec middleman serve`
# Test docker build locally

```
docker run -p 9000:8080 -e AWS_ACCESS_KEY_ID={key} -e AWS_SECRET_ACCESS_KEY={secret access key} update_lift_status:latest

curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```
