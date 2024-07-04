#!/usr/bin/env bash

npm run build
npm run release -- --ci # increment version numbers
jsr publish --allow-slow-types
npm publish --access public
npm publish --access public
