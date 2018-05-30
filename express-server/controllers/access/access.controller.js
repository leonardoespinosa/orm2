var rethinkdb = require('rethinkdb');
var atob = require('atob');
var co = require('co');
var yields = require('express-yields');

var utils = require('../../lib/utils');
var config = require('../../config');
var db = require('../db.controller');

module.exports.login = function (req, res) {
    var _request = req.body;
    var _userDecode = atob(_request.code);
    _userDecode = JSON.parse(_userDecode);

    validateUserLogin(req, _userDecode).then((result) => {
        if (!result) {
            res.send(JSON.stringify({ status: -4 }));
        } else {
            if (result.data.usr.status == 0) {
                res.send(JSON.stringify({ 'status': 0, 'user': result.data.usr.username, 'tokenActivate': result.data.usr.tokenActivate }));
            } else {
                res.send(JSON.stringify(result));
            }
        }
    });
}

/**
 * Function to validate user login process
 * @param {any} req 
 * @param {string} _userDecode 
 */
async function validateUserLogin(req, _userDecode) {
    try {
        let user = await getUser(req, _userDecode.data.username);

        if (user.status < 0) {
            return JSON.stringify({ error: 'invalid credentials' });
        }

        let _accessToken = utils.signToken({
            userId: _userDecode.data.username,
            date: new Date().toISOString()
        }, config.secret);

        if (user.bloqueo) {
            return JSON.stringify({ status: -3 });
        } else if (user.status == 6) {
            return JSON.stringify({ status: -1 });
        } else if (user.status != 2) {
            return false;
        } else {
            let resultAct = rethinkdb.table('users')
                .filter({ username: _userDecode.data.username })
                .update({ tokenAccess: _accessToken }).run(req._rdbConn);
            //.update({ tokenAccess: _accessToken, multisession: rethinkdb.row['multisession'].default([]).append(_accessToken) }).run(req._rdbConn);
        }

        if (user.password === utils.encrypt(_userDecode.data.password)) {
            delete user.password;
            try {
                if (!('Api-key' in user)) {
                    let apk = rethinkdb.table('users')
                        .filter({ username: _userDecode.data.username })
                        .update({ 'Api-key': _accessToken }).run(req._rdbConn);
                    user["Api-key"] = _accessToken;
                }
                if (!('Private-key' in user)) {
                    let ppk = rethinkdb.table('users').filter({ username: _userDecode.data.username }).update({ 'Private-key': _accessToken }).run(req._rdbConn);
                    user["Private-key"] = _accessToken;
                }
            } catch (e) {
                return new Error(`user ${_userDecode.data.username} not found`);
            }

            var logUser = await createLogUser(req, _userDecode.data.platform, user, _accessToken);
            var dataRSP = {
                from: 'authUser',
                status: 1,
                data: logUser,
                at: new Date().toISOString(),
                token: _accessToken
            }

            if (_userDecode.track == 1) {
                createTrace(req, dataRSP);
            }
            return dataRSP;
        } else {
            return JSON.stringify({ status: -2 });
        }
    } catch (e) {
        return false;
    }
}

/**
 * Function to find user in database
 * @param {any} req 
 * @param {string} username
 */
function getUser(req, username) {
    let users = co.wrap(function* () {
        let _user = yield rethinkdb.table('users')
            .filter({ username: username })
            .innerJoin(rethinkdb.table('proveedores').filter({ 'status': 2 }).filter(rethinkdb.row.hasFields('bloqueo').not())
                , function (csr, sr) {
                    return csr('token').eq(sr('token'))
                })
            .without({ "right": { "email": true, "username": true, "password": true, "tokenAccess": true, "Api-key": true, "Private-key": true, 'user_uuid': true, 'status': true, 'bloqueo': true, 'contact': true } }).zip()
            .pluck('name', 'username', 'password', 'tokenAccess', 'Api-key', 'Private-key', 'level', 'phone', 'token', 'platform', 'nit', 'typePlan', 'id', 'rol',
                'status', 'permissions', 'contact', 'user_uuid', 'bloqueo')
            .run(req._rdbConn);
        _user = _user.next();
        return Promise.resolve(_user);
    });
    return Promise.resolve(users());
}

/**
 * Function to create log when user access to ormigga
 * @param {any} req 
 * @param {string} platform 
 * @param {string} user 
 * @param {string} accessToken 
 */
async function createLogUser(req, platform, user, accessToken) {
    let dataLog = { username: user.username, token: user.token, platform: platform, accessToken: accessToken, level: user.level };
    let stlog = await db.insertData(req, 'logAccessUser', dataLog);
    stlog.usr = user;
    stlog.platform = platform;
    stlog.accessToken = accessToken;
    return stlog;
}

/**
 * Function to create login trace
 * @param {string} req 
 * @param {string} data 
 */
async function createTrace(req, data) {
    let stlogTrack = await db.insertData(req, 'logTrackUser', data);
}

/*
 * Send back a 500 error
 */
function handleError(res) {
    return function (error) {
        res.send(500, { error: error.message });
    }
}