# AlpineLifts.ca

Monorepo containing lambda functions and static site.

## Architecture

I use node.js inside docker containers to package Lambda functions for data manip. Data stored
as json files in S3. The UI is served from S3 as a static site.
### lift_api

A simple scraper that returns the current terrain and lift status for Whistler Blackcomb.
Only required because I don't think the actual API endpoint is public, but the data is
embedded in the HTML source of the [Mountain Conditions](https://www.whistlerblackcomb.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx) page.

### update_lift_status

Fetches the latest terrain status from the `lift_api`, the current opening_times json from S3,
mashes them up to create a new opening_times json which it then writes back to S3.

### Site

Viewable at https://alpinelifts.ca
