const path = require('path');
const fs = require ('fs');
const url = require ('url');
class devServerDevelop {
    apply(compiler){
        compiler.hooks.emit.tapAsync('emit', (compilation, callback) => {
            const releaseDir = '/dist';
            const assets = compilation.assets;
            let file, data;
            Object.keys(assets).forEach(key => {
                file = path.resolve(__dirname, releaseDir, key);
                data = assets[key].source();
                fs.writeFileSync(file, data);
            });
            callback();
        });
    }
}

module.exports = devServerDevelop