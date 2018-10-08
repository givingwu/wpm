function debug() {
  // TODO: make it support diff color with diff type
  return function handleDiffType(type){
    return function printMessage() {
      let args = Array.prototype.slice.call(arguments);

      if (args.length === 0) {
        args = ['debug:', type]
      } else {
        args = ['debug:'].concat(args)
      }

      if (console[type]) {
        console[type].apply(null, args)
      } else {
        console.error.apply(null, args)
      }
    }
  }
}

module.exports = {
  debug
}