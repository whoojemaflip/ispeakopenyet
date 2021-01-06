require 'json'
require 'open-uri'

set :build_dir, '/tmp/build'
set :data_dir, ENV['data'] if ENV['data']
set :skip_build_clean, true

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

  def last_updated_at
    js_timestamp = data.opening_times['lastUpdated']
    if js_timestamp
      Time.at(js_timestamp / 1000).strftime("%Y-%m-%d %H:%M:%S")
    else
      'err'
    end
  end
end
