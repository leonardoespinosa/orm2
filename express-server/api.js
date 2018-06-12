'use strict'

const debug = require('debug')('ormigga:api:routes')
const express = require('express')
const asyncify = require('express-asyncify')

const api = asyncify(express.Router())

const accessController = require('./controllers/access/access.controller')

api.get('/', (req, res, next) => {
  debug('Ormigga Api Working')
  res.end('Ormigga Api working')
})

api.post('/login', accessController.login)

module.exports = api
