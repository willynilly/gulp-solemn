var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var PluginError = gutil.PluginError;
var SolemnJS = require('solemn-js');
var SolemnCSS = require('solemn-css');
var path = require('path');

function getParsers(dictionaryFilePaths, includeDefaultDictionary) {
    var parsers = {
        css: new SolemnCSS(),
        js: new SolemnJS()
    };

    if (!dictionaryFilePaths) {
        return;
    }

    if (_.isString(dictionaryFilePaths)) {
        dictionaryFilePaths = [dictionaryFilePaths];
    }

    if (_.isArray(dictionaryFilePaths) && dictionaryFilePaths.length > 0) {
        var d = parsers[_.keys(parsers)[0]].getDictionary();
        if (!includeDefaultDictionary) {
            d.clearWords();
        }
        var shouldAppendWords = true;
        var shouldAppendCategoriesForWords = true;
        _.forEach(dictionaryFilePaths, function(jsonFilePath) {
            if (jsonFilePath) {
                d.loadWords(jsonFilePath, shouldAppendWords, shouldAppendCategoriesForWords);
            }
        });
        _.forEach(_.keys(parsers), function(parserKey) {
            var parser = parsers[parserKey];
            parser.setDictionary(d);
        });
    }

    return parsers;
}

function getViolationInfo(file, encoding, parsers) {
    var fileName = '';
    var violations = [];
    var violationMessages = [];
    if (file.isNull()) {
        // nothing to do
    } else if (file.isStream()) {
        // file.contents is a Stream - https://nodejs.org/api/stream.html
        this.emit('error', new PluginError('gulp-solemn', 'Streams not supported!'));
    } else if (file.isBuffer()) {
        var fileType = path.extname(file.path).toLowerCase();
        var parser = null;
        if (fileType === '.js') {
            parser = parsers['js'];
        } else if (fileType === '.css') {
            parser = parsers['css'];
        }
        if (parser) {
            // file.contents is a Buffer - https://nodejs.org/api/buffer.html
            fileName = file.path;
            var fileContents = file.contents.toString(encoding);
            violations = parser.detectInText(fileContents, fileName);
            violationMessages = _.map(violations, function(v) {
                return parser.formatViolation(v);
            });
        }
    }
    return {
        fileName: fileName,
        violations: violations,
        violationMessages: violationMessages
    };
}

function printViolationMessages(violationMessages) {
    _.forEach(violationMessages, function(vm) {
        console.log(vm);
    });
}

module.exports = function(origOptions) {
    var allViolations = [];
    var allViolationMessages = [];

    var defaultOptions = {
        fileViolationsCallback: _.noop,
        allViolationsCallback: _.noop,
        printViolationMessages: true
    };

    origOptions = origOptions || {};
    var options = _.assignIn(defaultOptions, origOptions);

    if (!('includeDefaultDictionary' in options)) {
        if ('dictionaries' in options) {
            options.includeDefaultDictionary = false;
            if (!_.isArray(options.dictionaries)) {
                options.dictionaries = [];
            }
        } else {
            options.includeDefaultDictionary = true;
            options.dictionaries = [];
        }
    }

    var parsers = getParsers(options.dictionaries, options.includeDefaultDictionary);

    var flush = function(callback) {
        console.log('flush');
        options.allViolationsCallback(allViolations, allViolationMessages);
        callback();
    };

    var transform = function(file, encoding, callback) {
        var vi = getViolationInfo(file, encoding, parsers);
        if (options.allViolationsCallback !== _.noop) {
            _.forEach(vi.violations, function(v) {
                allViolations.push(v);
            });
            _.forEach(vi.violationMessages, function(v) {
                allViolationMessages.push(v);
            });
        }
        options.fileViolationsCallback(vi.fileName, vi.violations, vi.violationMessages);
        if (options.printViolationMessages) {
            printViolationMessages(vi.violationMessages);
        }
        return callback(null, file);
    };

    var throughOptions = {
        objectMode: true
    };

    return through(throughOptions, transform, flush);
};
