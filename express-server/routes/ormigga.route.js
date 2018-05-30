var express = require('express');
var router = express.Router();

var accessController = require('../controllers/access/access.controller');


router.post('/login', accessController.login);

module.exports = router;