var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var PluginError = gutil.PluginError;
var SolemnJS = require('solemn-js');
var SolemnCSS = require('solemn-css');

function setupDictionaries(dictionaryFilePaths, parser) {
    if (!dictionaryFilePaths) {
        return;
    }

    if (_.isString(dictionaryFilePaths)) {
        dictionaryFilePaths = [dictionaryFilePaths];
    }

    if (_.isArray(dictionaryFilePaths) && dictionaryFilePaths.length > 0) {
        var d = parser.getDictionary();
        d.clearWords();
        var shouldAppendWords = true;
        var shouldAppendCategoriesForWords = true;
        _.forEach(dictionaryFilePaths, function(jsonFilePath) {
            d.loadWords(jsonFilePath, shouldAppendWords, shouldAppendCategoriesForWords);
        });
        parser.setDictionary(d);
    }
}

function reportViolations(file, fileType, encoding, callback, parser) {

    if (file.isNull()) {
        // nothing to do
        return callback(null, file);
    }

    if (file.isStream()) {
        // file.contents is a Stream - https://nodejs.org/api/stream.html
        this.emit('error', new PluginError('gulp-solemn', 'Streams not supported!'));
    } else if (file.isBuffer()) {
        // file.contents is a Buffer - https://nodejs.org/api/buffer.html
        var fileName = file.path;
        var fileContents = file.contents.toString(encoding);
        var violations = [];
        violations = parser.detectInText(fileContents, fileName);
        parser.reportViolations(fileName, violations);
        return callback(null, file);
    }

    return callback(null, file);
}

function getParser(fileType) {
    if (fileType === 'css') {
        return new SolemnCSS();
    } else if (fileType == 'js') {
        return new SolemnJS();
    }
}

module.exports = function(fileType, dictionaryFilePaths) {
    var parser = getParser(fileType)
    setupDictionaries(dictionaryFilePaths, parser);
    return through.obj(function(file, encoding, callback) {
        reportViolations(file, fileType, encoding, callback, parser);
    });
};
