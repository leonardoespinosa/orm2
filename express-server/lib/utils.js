'use strict'

const jwt = require('jsonwebtoken')
const bearer = require('token-extractor')
const crypto = require('crypto')

module.exports = {

  signToken: function (payload, secret, options) {
    return jwt.sign(payload, secret, options)
  },

  verifyToken: function (token, secret, options) {
    return jwt.verify(token, secret, options)
  },

  extractToken: function (req) {
    bearer(req, (err, token) => {
      if (err) return token
      return token
    })
  },

  encrypt: function (password) {
    let shasum = crypto.createHash('sha256')
    shasum.update(password)
    return shasum.digest('hex')
  }
}
