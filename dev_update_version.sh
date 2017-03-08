#!/usr/bin/env bash

# apply the value for the version GET param
version="?version="+$(date +%s)
sed -i 's/?__version__/'$version'/g' index.html
sed -i 's/?__version__/'$version'/g' dist/bundle.js
