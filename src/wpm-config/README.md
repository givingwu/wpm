# Default Config Rules

```js
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
  globalPath: path.join(root, 'node_modules'), // global folder path
};

```
