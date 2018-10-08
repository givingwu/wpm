const fs = require('fs');
const path = require('path');
const assert = require('assert');
const semver = require('semver');

const config = require('../wpm-config');
const log = require('../wpm-debug')('wpm-require:log');

const Module = module.constructor;
const globalNodeModulesPath = config.globalPath || Module.globalPaths[0];
const currentNodeModulesPath = module.paths[0]; // for local_modules
const DEFAULT_VERSION = '1.0.0';

exports=module.exports = wpmRequire;
exports.tryPackageJSON = tryPackageJSON;
exports.withVersionPath = withVersionPath;
// do same thing with: wpmRequire.tryPackageJSON = tryPackageJSON

log('globalNodeModulesPath: ', globalNodeModulesPath)
log('currentNodeModulesPath: ', currentNodeModulesPath)

function tryPackageJSON(requestPath) {
  log('tryPackageJSON requestPath: ', requestPath)
  const jsonPath = path.resolve(requestPath, 'package.json');
  log('tryPackageJSON jsonPath: ', jsonPath)

  try {
    if (fs.existsSync(jsonPath)) {
      return JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf-8' }));
    } else {
      throw new ReferenceError('FILE NOT FOUND')
    }
  } catch (e) {
    e.path = jsonPath;
    e.message = 'Error parsing ' + jsonPath + ': ' + e.message;
    throw e;
  }
}


function withVersionPath(currentPath, version = '1.0.0', request) {
  return path.resolve(currentPath, version, request);
}


function wpmRequire(currentPath) {
  log('currentPath: ', currentPath)
  assert(path.isAbsolute(currentPath), 'Error currentPath is not a absolute path:  ' + currentPath)

  const paths = [currentPath, currentNodeModulesPath, globalNodeModulesPath];
  const package = tryPackageJSON(currentPath) || {};
  assert(package.dependencies, 'Error There is no any node package.dependencies: ' + package.dependencies)

  /**
   * Rewrite `Module._resolveFilename(request, parent, isMain)
   *
   * match rules:
   *  if local: load local
   *  if local_global: load local_global
   *  if local_registry: download then load local_registry
   *  if global_registry: download then load global_registry
   *  if None, throw error
   *
   * @param {String} request request file path
   * @param {Module} parent require parent module
   * @param {Boolean} isMain
   * @param {Object} options
   */
  const originResolveFilename = Module._resolveFilename;
  const originResolveLookupPaths = Module._resolveLookupPaths;

  /**
  |--------------------------------------------------
  | Module._resolveFilename(request, parent, isMain, options)
  |--------------------------------------------------
  */
 /**
   * @desc Rewrite the `request` path
   * @param {String} request request file path
   * @param {Module} parent require parent module
   * @param {Boolean} isMain
   * @param {Object} options
   */
  /* Module._resolveFilename = (
    _super =>
    (request, parent, isMain, options) => {
      if (!options) {
        for (const currentPath of paths) {
          const version = package.dependencies[request]
          const newRequest = path.resolve(currentPath, version, request);
          if (newRequest) {
            return _super(newRequest, parent, isMain, options);
          }
        }
      }

      return _super(request, parent, isMain, options);
    }
  )(Module._resolveFilename); */

  Module._resolveFilename = function(request, parent, isMain, options) {
    let lookupPaths = paths.slice(0)

    if (options) {
      originResolveFilename.apply(module, arguments)
    } else {
      lookupPaths = Module._resolveLookupPaths(request, parent, true);
    }

    log(lookupPaths)

    // if (/^(@?[A-z])+.$/.test(request))
    log(package.dependencies[request]);
    var filename = Module._findPath(request, lookupPaths, isMain);

    log(filename);

    if (!filename) {
      // eslint-disable-next-line no-restricted-syntax
      var err = new Error(`Cannot find module '${request}'`);
      err.code = 'MODULE_NOT_FOUND';
      throw err;
    }

    return filename;
  }

  /**
  |--------------------------------------------------
  | Module._resolveLookupPaths(request, parent, newReturn)
  |--------------------------------------------------
  */
  /**
   * 解析 module 查找路径
   * @method
   * @param {String} request
   * @param {Module} parent
   * @param {Boolean} newReturn
   */
  Module._resolveLookupPaths = function(request, parent, newReturn) {
    let version = semver.valid(semver.coerce(package.dependencies[request])) || DEFAULT_VERSION
    log(arguments)

    return newReturn
      ? [currentNodeModulesPath, withVersionPath(globalNodeModulesPath, request, version)]
      : originResolveLookupPaths.call(module, request, parent, newReturn)
  }

  return package;
}