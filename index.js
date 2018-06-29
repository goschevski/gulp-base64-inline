var through = require('through2');
var path = require('path');
var fs = require('fs');
var PluginError = require('plugin-error');
var log = require('fancy-log');
var AnsiColors = require('ansi-colors');
var mime = require('mime');

module.exports = function (givenImagesPath) {
    function base64Inline (file, enc, callback) {
        var imagesPath;

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

            var fileBase64 = new Buffer(fileData).toString('base64');
            var fileMime = mime.lookup(imagePath);
            return 'url(data:' + fileMime  + ';base64,' + fileBase64 + ')';
        }

        // check if file.contents is a `Buffer`
        if (file.isBuffer()) {
            var base64 = String(file.contents).replace(/inline\(([^\)]+)\)/g, inline);
            file.contents = new Buffer(base64);

            this.push(file);
        }

        return callback();
    }

    return through.obj(base64Inline);
};