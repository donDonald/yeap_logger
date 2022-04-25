'use strict';

describe('yeap_logger.Logger + yeap_logger.LoggerFs, chaining Logger and LoggerFs', function() {

    const assert = require('assert');
    const helpers = require('./helpers');
    const DIR = '/tmp/api.LoggerChaining/';
    const STREAMS = ['system', 'fatal', 'error', 'warn', 'info', 'debug'];

    let api;
    let logger, loggerFs;
    before(()=>{
        const re = function(module) { return require('../' + module); }
        api = re('index');
        api.fs = require('fs');
        if (!api.fs.existsSync(DIR)){
            api.fs.mkdirSync(DIR, { recursive: true });
        }
    });

    after(()=>{
        loggerFs.close();
    });

    it('Create LoggerFs and open', ()=>{
        loggerFs = new api.LoggerFs({path:DIR, streams:STREAMS});
        assert.equal(false, loggerFs.isOpen());
        loggerFs.open();
        assert.equal(true, loggerFs.isOpen());
    });

    it('Create Logger and chain to LoggerFs', ()=>{
        api.Logger.setNext(loggerFs._writeRaw.bind(loggerFs));
    });

    it('Write logs, no context', (done)=>{
        api.Logger.system('AAAAAAAAAAAAAA');
        api.Logger.fatal('BBBBBBBBBBBBBB');
        api.Logger.error('CCCCCCCCCCCCCC');
        api.Logger.warn('DDDDDDDDDDDDDD');
        api.Logger.info('EEEEEEEEEEEEEE');
        api.Logger.debug('FFFFFFFFFFFFFF');
        loggerFs.flush(done);
    });

    it('Check output', (done)=>{
        helpers.loadStreams(loggerFs, 0, STREAMS, (streams)=>{
//          console.log('streams:', streams);
            assert(streams);

            assert.equal(1, streams.system.length);
            assert.notEqual(-1, streams.system[0].indexOf('AAAAAAAAAAAAAA'));

            assert.equal(1, streams.fatal.length);
            assert.notEqual(-1, streams.fatal[0].indexOf('BBBBBBBBBBBBBB'));

            assert.equal(1, streams.error.length);
            assert.notEqual(-1, streams.error[0].indexOf('CCCCCCCCCCCCCC'));

            assert.equal(1, streams.warn.length);
            assert.notEqual(-1, streams.warn[0].indexOf('DDDDDDDDDDDDDD'));

            assert.equal(1, streams.info.length);
            assert.notEqual(-1, streams.info[0].indexOf('EEEEEEEEEEEEEE'));

            assert.equal(1, streams.debug.length);
            assert.notEqual(-1, streams.debug[0].indexOf('FFFFFFFFFFFFFF'));
            done();
        });
    });

    it('Write logs, CTX1 context', (done)=>{
        api.Logger.ctx('CTX1').system('AAAAAAAAAAAAAA');
        api.Logger.ctx('CTX1').fatal('BBBBBBBBBBBBBB');
        api.Logger.ctx('CTX1').error('CCCCCCCCCCCCCC');
        loggerFs.flush(done);
    });

    it('Check output', (done)=>{
        helpers.loadStreams(loggerFs, 0, STREAMS, (streams)=>{
//          console.log('streams:', streams);
            assert(streams);

            assert.equal(2, streams.system.length);
            assert.notEqual(-1, streams.system[0].indexOf('AAAAAAAAAAAAAA'));
            assert.notEqual(-1, streams.system[1].indexOf('[CTX1]  system  AAAAAAAAAAAAAA'));

            assert.equal(2, streams.fatal.length);
            assert.notEqual(-1, streams.fatal[0].indexOf('BBBBBBBBBBBBBB'));
            assert.notEqual(-1, streams.fatal[1].indexOf('[CTX1]  fatal   BBBBBBBBBBBBBB'));

            assert.equal(2, streams.error.length);
            assert.notEqual(-1, streams.error[0].indexOf('CCCCCCCCCCCCCC'));
            assert.notEqual(-1, streams.error[1].indexOf('[CTX1]  error   CCCCCCCCCCCCCC'));

            assert.equal(1, streams.warn.length);
            assert.notEqual(-1, streams.warn[0].indexOf('DDDDDDDDDDDDDD'));

            assert.equal(1, streams.info.length);
            assert.notEqual(-1, streams.info[0].indexOf('EEEEEEEEEEEEEE'));

            assert.equal(1, streams.debug.length);
            assert.notEqual(-1, streams.debug[0].indexOf('FFFFFFFFFFFFFF'));
            done();
        });
    });

    it('Write logs, CTX1 & CTX2 context', (done)=>{
        api.Logger.ctx('CTX1').ctx('CTX2').system('AAAAAAAAAAAAAA');
        api.Logger.ctx('CTX1').ctx('CTX2').fatal('BBBBBBBBBBBBBB');
        api.Logger.ctx('CTX1').ctx('CTX2').error('CCCCCCCCCCCCCC');
        loggerFs.flush(done);
    });

    it('Check output', (done)=>{
        helpers.loadStreams(loggerFs, 0, STREAMS, (streams)=>{
//          console.log('streams:', streams);
            assert(streams);

            assert.equal(3, streams.system.length);
            assert.notEqual(-1, streams.system[0].indexOf('AAAAAAAAAAAAAA'));
            assert.notEqual(-1, streams.system[1].indexOf('[CTX1]  system  AAAAAAAAAAAAAA'));
            assert.notEqual(-1, streams.system[2].indexOf('[CTX1][CTX2]  system  AAAAAAAAAAAAAA'));

            assert.equal(3, streams.fatal.length);
            assert.notEqual(-1, streams.fatal[0].indexOf('BBBBBBBBBBBBBB'));
            assert.notEqual(-1, streams.fatal[1].indexOf('[CTX1]  fatal   BBBBBBBBBBBBBB'));
            assert.notEqual(-1, streams.fatal[2].indexOf('[CTX1][CTX2]  fatal   BBBBBBBBBBBBBB'));

            assert.equal(3, streams.error.length);
            assert.notEqual(-1, streams.error[0].indexOf('CCCCCCCCCCCCCC'));
            assert.notEqual(-1, streams.error[1].indexOf('[CTX1]  error   CCCCCCCCCCCCCC'));
            assert.notEqual(-1, streams.error[2].indexOf('[CTX1][CTX2]  error   CCCCCCCCCCCCCC'));

            assert.equal(1, streams.warn.length);
            assert.notEqual(-1, streams.warn[0].indexOf('DDDDDDDDDDDDDD'));

            assert.equal(1, streams.info.length);
            assert.notEqual(-1, streams.info[0].indexOf('EEEEEEEEEEEEEE'));

            assert.equal(1, streams.debug.length);
            assert.notEqual(-1, streams.debug[0].indexOf('FFFFFFFFFFFFFF'));
            done();
        });
    });
});

