#!/usr/bin/env bash

# make a temporary folder with the files as they will be organized in production
rm -rf deploy/* ; mkdir -p deploy/noob-fighters
cp -a assets data dist index.html deploy/noob-fighters

# apply the value for the version GET param
version="?version="+$(date +%s)
sed -i 's/#!version!#/'$version'/g' deploy/noob-fighters/index.html
sed -i 's/#!version!#/'$version'/g' deploy/noob-fighters/dist/bundle.js

# create the archive for deployment
tar zcfv deploy/noob-fighters.tar.gz -C deploy noob-fighters
