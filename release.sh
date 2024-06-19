#!/usr/bin/env bash

npm run release -- --ci
jsr publish --allow-slow-types
