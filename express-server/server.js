'use strict'

const debug = require('debug')('ormigga:api')
const http = require('http')
const express = require('express')
const chalk = require('chalk')
const asyncify = require('express-asyncify')
const yields = require('express-yields')
const path = require('path')
const bodyParser = require('body-parser')

const config = require('./config')
const connect = require('./connect')
const api = require('./api')
const port = config.server.port

// define our app using express
const app = asyncify(express())
const server = http.createServer(app)

// allow-cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  // allow preflight
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Middleware that will create a connection to the database
app.use(connect.connect)

app.use('/api', api)

// Middleware to close a connection to the database
app.use(connect.close)

// Express Error Handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Page Not Found!</h2>')
})

/**
 * Function to handle fatal error
 * @param {any} err
 */
function handleFatalError (err) {
  console.error(`${chalk.red('[Fatal Error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

if (!module.parent) {
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  server.listen(port, () => {
    console.log(`${chalk.green('[ormigga-api]')} server listening on port ${port}`)
  })
}

module.exports = app
