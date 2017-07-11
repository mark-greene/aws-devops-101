#!/bin/bash

set -e

export DATABASE_URL=$2
export DATABASE_PWD=$3
export DATABASE_USR="example_dev_user"
export SERVICE_URL=$4
export SERVICE_PORT=8080

# forever start server.js $1
forever-service install example-server --script server.js -o " $1" \
    -e "DATABASE_URL=$2 DATABASE_PWD=$3 DATABASE_USR=example_dev_user \
        SERVICE_URL=$4 SERVICE_PORT=8080" \
    --start
