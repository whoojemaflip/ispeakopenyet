require 'open3'

class Handler
  def self.process(event:, context:)
    output = []
    errors = []

    [
      "cp -R ./data /tmp/",
      "aws s3 cp s3://alpinelifts.ca/opening_times.json /tmp/data/",
      "bundle exec middleman build --verbose",
      "aws s3 sync /tmp/build/ s3://alpinelifts.ca --acl public-read"
    ].each do |cmd|
      stdout, stderr, status = Open3.capture3(cmd)
      output << stdout
      errors << stderr
      break unless status.exitstatus == 0
    end

    {
      statusCode: 200,
      body: {
        output: output.join("\n"),
        errors: errors.join("\n")
      }
    }
  end
end
