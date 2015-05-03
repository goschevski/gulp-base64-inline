var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');
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
            this.emit('error', new gutil.PluginError('gulp-inline-base64', 'Stream content is not supported'));
            return callback();
        }

        function inline (image, imagePath) {
            var fileMime = mime.lookup(imagePath);
            var prefix = 'url(' + fileMime  + ';base64,';
            var fileData = fs.readFileSync(path.join(imagesPath, imagePath));
            return prefix + new Buffer(fileData).toString('base64') + ')';
        }

        // check if file.contents is a `Buffer`
        if (file.isBuffer()) {
            var base64 = String(file.contents).replace(/inline\('(.+)'\)/g, inline);
            file.contents = new Buffer(base64);

            this.push(file);
        }

        return callback();
    }

    return through.obj(base64Inline);
};
