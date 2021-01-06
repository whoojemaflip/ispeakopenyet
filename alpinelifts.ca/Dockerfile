FROM amazon/aws-lambda-ruby:2.7
RUN yum install -y gcc gcc-c++ make shadow-utils
RUN yum install -y awscli

ENV PATH="/usr/sbin:${PATH}"
ENV GEM_HOME="/usr/local/bundle"
ENV PATH=$GEM_HOME/bin:$GEM_HOME/gems/bin:$PATH

RUN useradd -ms /bin/bash rubyapp

RUN mkdir -p /usr/local/bundle
RUN chown -R rubyapp /usr/local/bundle
RUN chown -R rubyapp /var

USER rubyapp
COPY Gemfile ./
RUN bundle install
COPY . ./

ENV data=/tmp/data
ENV TZ=America/Vancouver

CMD [ "lambda.Handler.process" ]
