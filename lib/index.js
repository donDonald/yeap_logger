'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }

const api = {};
module.exports = api;

api.Logger = re('Logger');
api.LoggerFs = re('LoggerFs');

