'use strict';

describe('yeap_logger.Logger + yeap_logger.LoggerFs, chaining Logger and LoggerFs', ()=>{

    const assert = require('assert');
    const helpers = require('./helpers');
    const DIR = '/tmp/api.LoggerChaining/';
    const STREAMS = ['system', 'fatal', 'error', 'warn', 'info', 'debug'];

    let api;
    let logger, loggerFs;
    before(()=>{
        const re = (module)=>{ return require('../' + module); }
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

    it('Dumping object', (done)=>{
        const obj = {name:'Julia', phone:'12345', age:37, kids:[{name:'John', age:3}, {name:'Paola', age:13}]};
        api.Logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').system(obj);
        api.Logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').fatal(obj);
        api.Logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').error(obj);
        api.Logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').warn(obj);
        api.Logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').info(obj);
        api.Logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').debug(obj);
        loggerFs.flush(done);
    });

    it('Dumping object', (done)=>{
        const expected = "  name: 'Julia',\n" +
                         "  phone: '12345',\n" +
                         '  age: 37,\n' +
                         "  kids: [ { name: 'John', age: 3 }, { name: 'Paola', age: 13 } ]";
        const expectedArray = expected.split('\n');
      //console.log('expected:');
      //console.dir(expected);
      //console.log('expectedArray:');
      //console.dir(expectedArray);
        helpers.loadStreams(loggerFs, 0, STREAMS, (streams)=>{
          //console.log('streams:', streams);
            assert(streams);
            const keys = Object.keys(streams);
            keys.forEach((k)=>{
                const s = streams[k];
              //console.log('s:');
              //console.dir(s);
                expectedArray.forEach((line)=>{
                    let found = -1;
                    for(let i=0; i<s.length; ++i) {
                        if(line == s[i]) {
                            found = i;
                            break;
                        }
                    }
                    assert.notEqual(found, -1);
                });
            });
            done();
        });

    });
});

