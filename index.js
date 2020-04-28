#!/usr/bin/env node

'use strict'

const process = require('process')

const weatherLocations = process.argv.slice(2)
try {
  process.stdout.write(weatherLocations.toString())
} catch (err) {
  process.stderr.write(err.message)
}
