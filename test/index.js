const path = require('path')
const log = require('../src/wpm-debug')('wpm-test:log');
const startWithSelfRequire = require('../src/wpm-require');
const package = startWithSelfRequire(__dirname)
const fake = require('fake-module')
log(fake);
