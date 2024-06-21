#!/usr/bin/env bash

npm run build
npm run release -- --ci
jsr publish --allow-slow-types
npm publish --access public
