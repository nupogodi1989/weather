#!/usr/bin/env node

'use strict'

const process = require('process')
const querystring = require('querystring')

const apiKey = process.env.API_KEY

const weatherLocations = process.argv.slice(2)
const weatherString = weatherLocations.join(' ')
const weatherArray = weatherString.split(',')

const weatherClientOptions = location => ({
  hostname: 'api.openweathermap.org',
  path: `/data/2.5/weather?q=${location}&appid=${apiKey}`,
})

const outputWeatherToUser = rawLocation => {
  const trimmedLocation = rawLocation.trim()
  const location = querystring.escape(trimmedLocation)
  const options = weatherClientOptions(location)
  console.log(options)
  return options
}

const outputWeather = weather => {
  process.stdout.write(weather)
}

outputWeather(weatherString)
outputWeatherToUser(weatherString)
