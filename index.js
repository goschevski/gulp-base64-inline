var through = require('through2');
var path = require('path');
var fs = require('fs');
var PluginError = require('plugin-error');
var log = require('fancy-log');
var AnsiColors = require('ansi-colors');
var mime = require('mime');

module.exports = function (givenImagesPath, options) {
    function base64Inline (file, opts, callback) {
        var imagesPath;
        var opts = options;
        
        if (!givenImagesPath) {
            imagesPath = path.dirname(file.path);
        } else {
            imagesPath = path.join(path.dirname(file.path), givenImagesPath);
            if (path.resolve(givenImagesPath) === path.normalize(givenImagesPath)) {
                imagesPath = givenImagesPath;
            }
        }
        
        // Do nothing if no contents
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            // accepting streams is optional
            this.emit('error', new PluginError('gulp-inline-base64', 'Stream content is not supported'));
            return callback();
        }

        function inline (inlineExpr, quotedPath) {
            var imagePath = quotedPath.replace(/['"]/g, '');
            try {
                var fileData = fs.readFileSync(path.join(imagesPath, imagePath));
            }
            catch (e) {
                log(AnsiColors.yellow('base64-inline'), 'Referenced file not found: ' + path.join(imagesPath, imagePath));
                log(AnsiColors.yellow('base64-inline'), 'Leaving it as is.');
                return inlineExpr;
            }

            var fileBase64 = Buffer.from(fileData).toString('base64');
            
            var prefix = "url(";
            var suffix = ")";
            var includeMime = true; 

            // has options
            if (opts){
                if (opts.prefix !== undefined)
                    prefix = opts.prefix;
                if (opts.suffix !== undefined)
                    suffix = opts.suffix;
                if (opts.includeMime !== undefined)
                    includeMime = opts.includeMime;   
            }

            //add Mime
            if (includeMime){
                var fileMime = mime.lookup(imagePath);
                prefix+= 'data:' + fileMime  + ';base64,';
                
            }
            return prefix + fileBase64 + suffix;
        }

        // check if file.contents is a `Buffer`
        if (file.isBuffer()) {
            var base64 = String(file.contents).replace(/inline\(([^\)]+)\)/g, inline);
            file.contents = Buffer.from(base64);

            this.push(file);
        }

        return callback();
    }

    return through.obj(base64Inline);
};