'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }

const logger = {};
module.exports = logger;

logger.Logger = re('Logger');
logger.LoggerFs = re('LoggerFs');

