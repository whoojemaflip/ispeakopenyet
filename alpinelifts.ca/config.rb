require 'json'
require 'open-uri'
require 'pry'

# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

helpers do
  def previous_weeks_days
    (Date.today-6..Date.today).map { |d| d.strftime("%A") }.reverse
  end

  def previous_weeks_dates
    (Date.today-6..Date.today).map { |d| d.iso8601 }.reverse
  end

  def opening_time_for(lift, date)
    js_timestamp = data.opening_times.fetch(date, {})[lift]
    if js_timestamp
      Time.at(js_timestamp / 1000).strftime("%H:%M")
    end
  end
end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end

activate :data_source do |c|
  c.root  = "https://alpinelifts.ca"
  c.files = [
    "opening_times.json"
  ]
end
