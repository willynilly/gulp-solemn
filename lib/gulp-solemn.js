var through = require('through2');
var solemncss = require('solemn-css');
var solemnjs = require('solemn-js');
var gutil = require('gulp-util');
var _ = require('lodash');
var PluginError = gutil.PluginError;

function setupDictionaries(dictionaryFilePaths) {
    if (!dictionaryFilePaths) {
        return;
    }

    if (_.isString(dictionaryFilePaths)) {
        dictionaryFilePaths = [dictionaryFilePaths];
    }

    if (_.isArray(dictionaryFilePaths) && dictionaryFilePaths.length > 0) {
        var d = solemncss.getDictionary();
        var shouldAppendWords = true;
        var shouldAppendCategoriesForWords = true;
        _.forEach(dictionaryFilePaths, function(jsonFilePath) {
            d.loadWords(jsonFilePath, shouldAppendWords, shouldAppendCategoriesForWords);
        });
        solemncss.setDictionary(d);
        solemnjs.setDictionary(d);
    }
}

function reportViolations(file, fileType, encoding, callback) {
    if (file.isNull()) {
        // nothing to do
        return callback(null, file);
    }

    if (file.isStream()) {
        // file.contents is a Stream - https://nodejs.org/api/stream.html
        this.emit('error', new PluginError('gulp-solemn', 'Streams not supported!'));
    } else if (file.isBuffer()) {
        // file.contents is a Buffer - https://nodejs.org/api/buffer.html

        var fileName = file.name;
        var fileContents = file.contents.toString(encoding);
        var violations = [];
        if (fileType === 'css') {
            violations = solemncss.detectInText(fileContents, fileName);
            solemncss.reportViolations(fileName, violations);
        } else if (fileType == 'js') {
            violations = solemnjs.detectInText(fileContents, file.name);
            solemnjs.reportViolations(fileName, violations);
        }
        return callback(null, file);
    }

    return callback(null, file);
}

module.exports = function(fileType, dictionaryFilePaths) {
    setupDictionaries(dictionaryFilePaths);
    return through.obj(function(file, encoding, callback) {
        reportViolations(file, fileType, encoding, callback);
    });
};
