'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }

//const api = {};
//module.exports = api;
//api.fs = require('fs');

//api.lib = {};
//api.lib.yeap_logger = {};
//api.lib.yeap_logger.Logger = re('Logger')(api);
//api.lib.yeap_logger.LoggerFs = re('LoggerFs')(api);
//api.lib.log = api.lib.yeap_logger.Logger;

module.exports = {};

const api = {};
api.fs = require('fs');

module.exports.Logger = re('Logger')(api);
module.exports.LoggerFs = re('LoggerFs')(api);
