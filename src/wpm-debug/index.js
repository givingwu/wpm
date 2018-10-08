const { debuglog } = require('util');
module.exports = debug/* debuglog */
exports.debug = debug

function debug(info) {
  // TODO: make it support diff color with diff type
  // return function handleDiffType(){
    if (!info) return;
    const [ module, type ] = info.split(':');

    return function printMessage(msg) {
      let args = Array.prototype.slice.call(arguments);
      const defaults = [module]

      if (args.length === 0) {
        args = defaults
      } else {
        args = defaults.concat(args)
      }

      if (console[type]) {
        console[type].apply(null, args)
      } else {
        console.log.apply(null, args)
      }
    }
  // }
}