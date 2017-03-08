#!/usr/bin/env bash

# apply the value for the version GET param
version="?version="+$(date +%s)
sed -i 's/#!version!#/'$version'/g' index.html
sed -i 's/#!version!#/'$version'/g' dist/bundle.js
