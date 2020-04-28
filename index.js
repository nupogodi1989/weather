#!/usr/bin/env node

'use strict'

const process = require('process')
const querystring = require('querystring')
const client = require('https')

const apiKey = process.env.API_KEY

const weatherLocations = process.argv.slice(2)
const weatherString = weatherLocations.join(' ')
const weatherArray = weatherString.split(',')

const weatherClientOptions = location => ({
  hostname: 'api.openweathermap.org',
  path: `/data/2.5/weather?q=${location}&appid=${apiKey}`,
})

const outputWeatherToUser = () => weatherArray.map(
  // value => getWeather(value).then(outputWeather)
  value => console.log(getWeather(value))
)

const getWeather = rawLocation => {
  const trimmedLocation = rawLocation.trim()
  const location = querystring.escape(trimmedLocation)
  const options = weatherClientOptions(location)
  return getWeatherEntryFromApi(options)
}

const getWeatherEntryFromApi = options => {
  client.get(options, handleResponse)
}

const handleResponse = res => new Promise((resolve, reject) => {
  let rawData = ''
  res.on('data', chunk => {
    rawData += chunk
  })
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData)
      console.log(parsedData)
      resolve(parsedData)
    } catch (err) {
      reject(err)
    }
  })
})

const outputWeather = weather => {
  process.stdout.write(weather)
}

outputWeatherToUser(weatherString)
