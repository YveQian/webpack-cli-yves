const reg = /(console.log\()(.*)(\))/;
const gmodule = function (sourceCode) { 
  return sourceCode.replace(reg, '');
}
module.exports = gmodule;