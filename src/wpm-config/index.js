'use strict';

const debug = require('../wpm-debug')('wpm-config');
const path = require('path');
// const fs = require('fs');
const cp = require('child_process');

let root;
if (process.platform === 'win32') {
  root = process.env.USERPROFILE || process.env.APPDATA || process.env.TMP || process.env.TEMP;
} else {
  root = process.env.HOME || process.env.TMPDIR || '/tmp';
}

let prefix = null;
try {
  prefix = cp.execSync('npm config get prefix').toString().trim();
} catch (err) {
  // ignore it
  debug('npm config cli error: %s', err);
}

module.exports = {
  prefix,

  // HOSTS
  npmHost: 'https://npmjs.org',
  npmRegistry: 'https://registry.npmjs.org/',
  cnpmHost: 'https://npm.taobao.org',
  cnpmRegistry: 'https://registry.npm.taobao.org',
  disturl: 'https://npm.taobao.org/mirrors/node', // download dist tarball for node-gyp
  iojsDisturl: 'https://npm.taobao.org/mirrors/iojs',

  // LOCAL HOSTS
  localHost: 'https://127.0.0.1:8888',
  localRegistry: 'https://127.0.0.1:8888/registry',

  // GLOBAL PATH
  globalPath: path.join(root, '.node_modules'), // global folder path
};
