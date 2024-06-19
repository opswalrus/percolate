#!/usr/bin/env bash

npm run release -- --ci
jsr publish --allow-slow-types
bunx @morlay/bunpublish
# npm publish --access public
