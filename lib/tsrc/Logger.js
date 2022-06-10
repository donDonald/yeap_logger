'use strict';

describe('yeap_logger.Logger', ()=>{

    const assert = require('assert');
    let api;
    before(()=>{
        const re = (module)=>{ return require('../' + module); }
        api = re('index');
        api.Logger._getInstance()._cout = (message)=>{
            lastLine = message;
        };
    });

    describe('static methods', ()=>{
        let lastLine;
        before(()=>{
            api.Logger._getInstance()._cout = (message)=>{
                lastLine = message;
            };
        });

        it('Check instantiation', ()=>{
            const i1 = api.Logger._getInstance();
            const i2 = api.Logger._getInstance();
            assert.equal(i1, i2);

            const i3 = new api.Logger();
            assert.notEqual(i1, i3);
        });

        it('lib.Logger.system', ()=>{
            api.Logger.system('AAAAA');
            assert.notEqual(-1, lastLine.indexOf('system'));
            assert.notEqual(-1, lastLine.indexOf('AAAAA'));
        });

        it('lib.Logger.fatal', ()=>{
            api.Logger.fatal('BBBBB');
            assert.notEqual(-1, lastLine.indexOf('fatal'));
            assert.notEqual(-1, lastLine.indexOf('BBBBB'));
        });

        it('lib.Logger.error', ()=>{
            api.Logger.error('CCCCC');
            assert.notEqual(-1, lastLine.indexOf('error'));
            assert.notEqual(-1, lastLine.indexOf('CCCCC'));
        });

        it('lib.Logger.warn', ()=>{
            api.Logger.warn('DDDDD');
            assert.notEqual(-1, lastLine.indexOf('warn'));
            assert.notEqual(-1, lastLine.indexOf('DDDDD'));
        });

        it('lib.Logger.info', ()=>{
            api.Logger.info('EEEEE');
            assert.notEqual(-1, lastLine.indexOf('info'));
            assert.notEqual(-1, lastLine.indexOf('EEEEE'));
        });

        it('lib.Logger.debug', ()=>{
            api.Logger.debug('FFFFF');
            assert.notEqual(-1, lastLine.indexOf('debug'));
            assert.notEqual(-1, lastLine.indexOf('FFFFF'));
        });

        it('context switching', ()=>{
            api.Logger.ctx('CTXA').debug('aaa1');
            assert.notEqual(-1, lastLine.indexOf('CTXA'));
            assert.notEqual(-1, lastLine.indexOf('aaa1'));

            api.Logger.ctx('CTXA').info('aaa2');
            assert.notEqual(-1, lastLine.indexOf('CTXA'));
            assert.notEqual(-1, lastLine.indexOf('aaa2'));

            api.Logger.debug('aaa3');
            assert.equal(-1, lastLine.indexOf('CTXA'));
            assert.notEqual(-1, lastLine.indexOf('aaa3'));

            api.Logger.ctx('CTXB').warn('bbb1');
            assert.notEqual(-1, lastLine.indexOf('CTXB'));
            assert.notEqual(-1, lastLine.indexOf('bbb1'));

            api.Logger.ctx('CTXB').error('bbb2');
            assert.notEqual(-1, lastLine.indexOf('CTXB'));
            assert.notEqual(-1, lastLine.indexOf('bbb2'));

            api.Logger.debug('bbb3');
            assert.equal(-1, lastLine.indexOf('CTXB'));
            assert.notEqual(-1, lastLine.indexOf('bbb3'));
        });

        it('2 conextes at once', ()=>{
            api.Logger.ctx('CTX1').ctx('CTX2').debug('yyy');

            const ctx1Index = lastLine.indexOf('CTX1');
            assert.notEqual(-1, ctx1Index);

            const ctx2Index = lastLine.indexOf('CTX2');
            assert.notEqual(-1, ctx2Index);

            assert(ctx1Index < ctx2Index);
        });

        it('3 conextes at once', ()=>{
            api.Logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').debug('zzz');

            const ctx1Index = lastLine.indexOf('CTX1');
            assert.notEqual(-1, ctx1Index);

            const ctx2Index = lastLine.indexOf('CTX2');
            assert.notEqual(-1, ctx2Index);

            const ctx3Index = lastLine.indexOf('CTX3');
            assert.notEqual(-1, ctx3Index);

            assert(ctx1Index < ctx2Index);
            assert(ctx2Index < ctx3Index);
        });

        it('Dumping object', ()=>{
            const obj = {name:'Julia', phone:'12345', age:37, kids:[{name:'John', age:3}, {name:'Paola', age:13}]};
            api.Logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').debug(obj);
            const expected = "{\n" +
                             "  name: 'Julia',\n" +
                             "  phone: '12345',\n" +
                             '  age: 37,\n' +
                             "  kids: [ { name: 'John', age: 3 }, { name: 'Paola', age: 13 } ]\n" +
                             "}";
            const index = lastLine.indexOf(expected);
            assert.notEqual(-1, index);
        });
    });

    describe('instance methods', ()=>{
        let logger, lastLine;
        before(()=>{
            logger = new api.Logger();
            logger._cout = (message)=>{
                lastLine = message;
            };
        });

        it('logger.system', ()=>{
            logger.system('11111');
            assert.notEqual(-1, lastLine.indexOf('system'));
            assert.notEqual(-1, lastLine.indexOf('11111'));
        });

        it('logger.fatal', ()=>{
            logger.fatal('22222');
            assert.notEqual(-1, lastLine.indexOf('fatal'));
            assert.notEqual(-1, lastLine.indexOf('22222'));
        });

        it('logger.error', ()=>{
            logger.error('33333');
            assert.notEqual(-1, lastLine.indexOf('error'));
            assert.notEqual(-1, lastLine.indexOf('33333'));
        });

        it('logger.warn', ()=>{
            logger.warn('44444');
            assert.notEqual(-1, lastLine.indexOf('warn'));
            assert.notEqual(-1, lastLine.indexOf('44444'));
        });

        it('logger.info', ()=>{
            logger.info('55555');
            assert.notEqual(-1, lastLine.indexOf('info'));
            assert.notEqual(-1, lastLine.indexOf('55555'));
        });

        it('logger.debug', ()=>{
            logger.debug('66666');
            assert.notEqual(-1, lastLine.indexOf('debug'));
            assert.notEqual(-1, lastLine.indexOf('66666'));
        });

        it('context switching', ()=>{
            logger.ctx('CTXA').debug('aaa1');
            assert.notEqual(-1, lastLine.indexOf('CTXA'));
            assert.notEqual(-1, lastLine.indexOf('aaa1'));

            logger.ctx('CTXA').info('aaa2');
            assert.notEqual(-1, lastLine.indexOf('CTXA'));
            assert.notEqual(-1, lastLine.indexOf('aaa2'));

            logger.debug('aaa3');
            assert.equal(-1, lastLine.indexOf('CTXA'));
            assert.notEqual(-1, lastLine.indexOf('aaa3'));

            logger.ctx('CTXB').warn('bbb1');
            assert.notEqual(-1, lastLine.indexOf('CTXB'));
            assert.notEqual(-1, lastLine.indexOf('bbb1'));

            logger.ctx('CTXB').error('bbb2');
            assert.notEqual(-1, lastLine.indexOf('CTXB'));
            assert.notEqual(-1, lastLine.indexOf('bbb2'));

            logger.debug('bbb3');
            assert.equal(-1, lastLine.indexOf('CTXB'));
            assert.notEqual(-1, lastLine.indexOf('bbb3'));
        });

        it('2 conextes at once', ()=>{
            logger.ctx('CTX1').ctx('CTX2').debug('yyy');

            const ctx1Index = lastLine.indexOf('CTX1');
            assert.notEqual(-1, ctx1Index);

            const ctx2Index = lastLine.indexOf('CTX2');
            assert.notEqual(-1, ctx2Index);

            assert(ctx1Index < ctx2Index);
        });

        it('3 conextes at once', ()=>{
            logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').debug('zzz');

            const ctx1Index = lastLine.indexOf('CTX1');
            assert.notEqual(-1, ctx1Index);

            const ctx2Index = lastLine.indexOf('CTX2');
            assert.notEqual(-1, ctx2Index);

            const ctx3Index = lastLine.indexOf('CTX3');
            assert.notEqual(-1, ctx3Index);

            assert(ctx1Index < ctx2Index);
            assert(ctx2Index < ctx3Index);
        });

        it('Dumping object', ()=>{
            const obj = {name:'Julia', phone:'12345', age:37, kids:[{name:'John', age:3}, {name:'Paola', age:13}]};
            logger.ctx('CTX1').ctx('CTX2').ctx('CTX3').debug(obj);
            const expected = "{\n" +
                             "  name: 'Julia',\n" +
                             "  phone: '12345',\n" +
                             '  age: 37,\n' +
                             "  kids: [ { name: 'John', age: 3 }, { name: 'Paola', age: 13 } ]\n" +
                             "}";
            const index = lastLine.indexOf(expected);
            assert.notEqual(-1, index);
        });
    });
});

