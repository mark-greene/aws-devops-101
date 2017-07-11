#!/bin/bash

set -e

# annoyances
apt-get update
apt-get purge --yes popularity-contest
apt-get purge --yes byobu

# Time Sync
apt-get install --yes ntp

# Software Support
apt-get install --yes software-properties-common build-essential
apt-get update

apt-get install --yes curl wget libcurl4-openssl-dev libxml2-dev libxslt1-dev libpq-dev
apt-get install --yes libjpeg8 libjpeg8-dev libpng12-0 libpng12-dev zlib1g zlib1g-dev
apt-get install --yes libtool libltdl-dev
apt-get install --yes git

# Postgres Client
apt-get install --yes postgresql-client

# Node
apt-get install --yes nodejs
ln -s "$(which nodejs)" /usr/bin/node

curl -sL https://deb.nodesource.com/setup_5.x | bash -
apt-get install -y nodejs

npm install -g forever
npm install -g forever-service
npm install pg pg-native --save
npm install restify
