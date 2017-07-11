FROM ubuntu:latest

RUN \
    apt-get update -y && \
    apt-get purge -y popularity-contest byobu && \
    apt-get install -y  ntp \
                        software-properties-common \
                        build-essential \
                        curl wget libcurl4-openssl-dev \
                        git libpq-dev\
                        postgresql-client \
                        nodejs npm

RUN \
    ln -s "$(which nodejs)" /usr/bin/node && \
    curl -sL https://deb.nodesource.com/setup_5.x | bash - && \
    apt-get install -y nodejs && \
    npm install forever -g && \
    npm install pg pg-native --save && \
    npm install restify

EXPOSE 8080

COPY ../example/* /home/ubuntu/example/

ENV DATABASE_URL=$2
ENV DATABASE_PWD=$3

ENTRYPOINT ["forever"]
CMD ["/home/ubuntu/example/server.js", "service"]
