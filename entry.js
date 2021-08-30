const glob = require('glob')
const getEntry = function (globPath) {
  let entries = {}; 
  console.log(glob.sync(globPath),'....')
  glob.sync(globPath).forEach(function (entry) {
      var pathname = entry.split('/').splice(-1).join('/').split('.')[0];
      entries[pathname] = [entry];
  });
  console.log(entries,'entry')
  return entries;
};
const entrys = getEntry('./src/**/*.js')

module.exports = entrys

