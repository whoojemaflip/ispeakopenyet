# Architecture
  - Netlify function to scrape and create data
  - serve static site from netlify
  - Site is HTML, JS and a JSON file which holds all the data.
  - Data file, let's call it app.json, which holds all the lift data

``` App.json
{
  last_updated_at: timestamp,
  data: [
    {
      day: "2020/11/27",
      lifts: {
        "7th Heaven Express" => opening time,
      }
      ...
    }
  ]
}
```

Cron function:
  Run every x minutes (start with 5, see how it goes)

  launch the next function

1st function: api_proxy
  Scrape the lift status page for the TerrainStatusFeed json (aka API proxy)
  We'll share this URL with friends later.

  launch the next function

2nd function:
  Load the latest terrain_status_feed.json
  Reduce the TerrainStatusFeed data to the relevant scope which looks someting like:

  {
    timestamp: x,
    lifts: {
      "7th Heaven Express" => Status,
      ...
    }
  }


  launch the next function with the filename as a parameter

3rd function:
  Apply any changes to the
