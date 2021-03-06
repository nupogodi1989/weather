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

const outputWeatherToUser = () => weatherArray.map(value => getWeather(value).then(outputWeather))

const getWeather = rawLocation => {
  const trimmedLocation = rawLocation.trim()
  const location = querystring.escape(trimmedLocation)
  const options = weatherClientOptions(location)
  return getWeatherEntryFromApi(options)
}

const getWeatherEntryFromApi = options => new Promise((resolve, reject) => {
  client.get(options, async response => {
    const weatherEntry = await handleResponse(response)
      .catch(reject)
    resolve(weatherEntry)
  })
})

const handleResponse = res => new Promise((resolve, reject) => {
  let rawData = ''
  res.on('data', chunk => {
    rawData += chunk
  })
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData)
      resolve(parsedData)
    } catch (err) {
      reject(err)
    }
  })
})

const outputWeather = location => {
  if (location.weather) {
    const unixTimestamp = new Date(location.dt * 1000)
    const formattedDate = `${unixTimestamp.getFullYear()}-${unixTimestamp.getMonth() + 1}-${unixTimestamp.getDate()} ${unixTimestamp.getHours()}:${unixTimestamp.getMinutes()}`
    this.weather = `${location.name}: ${formattedDate} ${location.weather[0].description}\n`
    process.stdout.write(this.weather)
  }
}

outputWeatherToUser()
