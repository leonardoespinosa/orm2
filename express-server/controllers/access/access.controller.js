'use strict'

const rethinkdb = require('rethinkdb')
const atob = require('atob')
const co = require('co')
const yields = require('express-yields')
const utils = require('../../lib/utils')
const config = require('../../config')
const db = require('../db.controller')

module.exports.login = async function (req, res, next) {
  let _request = req.body
  let _userDecode = atob(_request.code)
  _userDecode = JSON.parse(_userDecode)

  try {
    let userToFind = await getUser(req, _userDecode.data.username)
    let user = userToFind[0]

    if(!user || user.status < 0){
      res.send(JSON.stringify({ status: -2 }))
      return
    }

    let _accessToken = utils.signToken({
      userId: _userDecode.data.username,
      date: new Date().toISOString()
    }, config.secret)

    if (user.bloqueo) {
      res.send(JSON.stringify({ status: -3 }))
      return
    } else if (user.status === 6) {
      res.send(JSON.stringify({ status: -1 }))
      return
    } else if (user.status !== 2) {
      res.send(JSON.stringify({ status: -4 }))
      return
    } else {
      let resultAct = rethinkdb.table('users')
        .filter({ username: _userDecode.data.username })
        .update({ tokenAccess: _accessToken }).run(req._rdb)
      // .update({ tokenAccess: _accessToken, multisession: rethinkdb.row['multisession'].default([]).append(_accessToken) }).run(req._rdbConn);
    }

    if (user.password === utils.encrypt(_userDecode.data.password)) {
      delete user.password
      try {
        if (!('Api-key' in user)) {
          let apk = rethinkdb.table('users')
            .filter({ username: _userDecode.data.username })
            .update({ 'Api-key': _accessToken }).run(req._rdb)
          user['Api-key'] = _accessToken
        }
        if (!('Private-key' in user)) {
          let ppk = rethinkdb.table('users').filter({ username: _userDecode.data.username }).update({ 'Private-key': _accessToken }).run(req._rdb)
          user['Private-key'] = _accessToken
        }
      } catch (e) {
        return next(new Error(`user ${_userDecode.data.username} not found`))
      }

      var logUser = await createLogUser(req, _userDecode.data.platform, user, _accessToken)
      var dataRSP = {
        from: 'authUser',
        status: 1,
        data: logUser,
        at: new Date().toISOString(),
        token: _accessToken
      }

      if (_userDecode.track === 1) {
        createTrace(req, dataRSP)
      }
      if (dataRSP.data.usr.status === 0) {
        res.send(JSON.stringify({ 'status': 0, 'user': dataRSP.data.usr.username, 'tokenActivate': dataRSP.data.usr.tokenActivate }))
        return
      } else {
        res.send(JSON.stringify(dataRSP))
        return
      }
    } else {
      res.send(JSON.stringify({ status: -2 }))
      return
    }
  } catch (e) {
    return next(e)
  }
}

/**
 * Function to find user in database
 * @param {any} req
 * @param {string} username
 */
function getUser (req, username) {
  let users = co.wrap(function * () {
    let _user = yield rethinkdb.table('users')
      .filter({ username: username })
      .innerJoin(rethinkdb.table('proveedores').filter({ 'status': 2 }).filter(rethinkdb.row.hasFields('bloqueo').not())
        , function (csr, sr) {
          return csr('token').eq(sr('token'))
        })
      .without({ 'right': { 'email': true, 'username': true, 'password': true, 'tokenAccess': true, 'Api-key': true, 'Private-key': true, 'user_uuid': true, 'status': true, 'bloqueo': true, 'contact': true } }).zip()
      .pluck('name', 'username', 'password', 'tokenAccess', 'Api-key', 'Private-key', 'level', 'phone', 'token', 'platform', 'nit', 'typePlan', 'id', 'rol',
        'status', 'permissions', 'contact', 'user_uuid', 'bloqueo').coerceTo('array')
      .run(req._rdb)
    return Promise.resolve(_user)
  })
  return Promise.resolve(users())
}

/**
 * Function to create log when user access to ormigga
 * @param {any} req
 * @param {string} platform
 * @param {string} user
 * @param {string} accessToken
 */
async function createLogUser (req, platform, user, accessToken) {
  let dataLog = { username: user.username, token: user.token, platform: platform, accessToken: accessToken, level: user.level }
  let stlog = await db.insertData(req, 'logAccessUser', dataLog)
  stlog.usr = user
  stlog.platform = platform
  stlog.accessToken = accessToken
  return stlog
}

/**
 * Function to create login trace
 * @param {string} req
 * @param {string} data
 */
async function createTrace (req, data) {
  let stlogTrack = await db.insertData(req, 'logTrackUser', data)
}
