#!/usr/bin/env bash

# make a temporary folder with the files as they will be organized in production
rm -rf deploy/* ; mkdir -p deploy/noob-fighters
cp -a assets data dist index.html deploy/noob-fighters

# create the archive for deployment
tar zcfv deploy/noob-fighters.tar.gz -C deploy noob-fighters
