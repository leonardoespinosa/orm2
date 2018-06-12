'use strict'

const r = require('rethinkdb')
const config = require('./config')

module.exports.connect = function (req, res, next) {
  let count = 0;
  (function _connect () {
    r.connect(config.rethinkdb, (error, connection) => {
      if (error && error.name === 'ReqlDriverError' && error.message.indexOf('Could not connect') === 0 && ++count < 31) {
        console.log(error)
        setTimeout(_connect, 1000)
        return next(error)
      }

      req._rdb = connection
      next()
    })
  })()
}

module.exports.close = function (req, res, next) {
  req._rdb.close()
}
