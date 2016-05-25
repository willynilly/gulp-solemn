var gulp = require('gulp');
var gulpSolemn = require('gulp-solemn');
var end = require('stream-end');
var _ = require('lodash');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.gulpsolemn = {
    setUp: function(done) {
        // setup here if necessary
        this.totalViolations = [];
        this.totalViolationMessages = [];
        this.srcFiles = gulp.src(['test/fixtures/*.js', 'test/fixtures/*.css']);
        var that = this;
        this.fileViolationsCallback = function(fileName, violations, violationMessages) {
            _.forEach(violations, function(v) {
                that.totalViolations.push(v)
            });
            _.forEach(violationMessages, function(v) {
                that.totalViolationMessages.push(v)
            });
        };
        done();
    },

    with_dictionaries: function(test) {
        test.expect(2);
        var that = this;
        var options = {
            fileViolationsCallback: that.fileViolationsCallback,
            dictionaries: ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json']
        };
        var onEnd = function() {
            test.equal(that.totalViolations.length, 4);
            test.equal(that.totalViolations.length, that.totalViolations.length);
            test.done();
        };
        var solemnDefault = gulpSolemn(options);
        that.srcFiles
            .pipe(solemnDefault)
            .pipe(end(onEnd));
    },

    without_dictionaries: function(test) {
        test.expect(2);
        var that = this;
        var options = {
            fileViolationsCallback: that.fileViolationsCallback
        };
        var onEnd = function() {
            test.equal(that.totalViolations.length, 8);
            test.equal(that.totalViolations.length, that.totalViolations.length);
            test.done();
        };
        var solemnDefault = gulpSolemn(options);
        that.srcFiles
            .pipe(solemnDefault)
            .pipe(end(onEnd));
    },

    include_default_dictionary: function(test) {
        test.expect(2);
        var that = this;
        var options = {
            fileViolationsCallback: that.fileViolationsCallback,
            dictionaries: ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json'],
            includeDefaultDictionary: true
        };
        var onEnd = function() {
            test.equal(that.totalViolations.length, 10);
            test.equal(that.totalViolations.length, that.totalViolations.length);
            test.done();
        };
        var solemnDefault = gulpSolemn(options);
        that.srcFiles
            .pipe(solemnDefault)
            .pipe(end(onEnd));
    },

    with_fileviolationscallback_and_allviolationscallback: function(test) {
        test.expect(4);
        var that = this;
        var allViolationsCallback = function(allViolations, allViolationMessages) {
            console.log('allcallbacked');
            test.equal(that.totalViolations.length, 8);
            test.equal(that.totalViolations.length, that.totalViolations.length);
            test.equal(allViolations.length, that.totalViolations.length);
            test.equal(allViolationMessages.length, that.totalViolationMessages.length);
            test.done();
        };
        var options = {
            fileViolationsCallback: that.fileViolationsCallback,
            allViolationsCallback: allViolationsCallback
        };
        var solemn = gulpSolemn(options);
        that.srcFiles
            .pipe(solemn)
    },

    print_violation_messages: function(test) {
        test.expect(1);
        var messageCount = 0;
        var that = this;
        var options = {
            printViolationMessages: true,
            reporter: function(msg) {
                console.log(msg);
                messageCount += 1;
            },
        };
        var solemn = gulpSolemn(options);
        that.srcFiles
            .pipe(solemn)
            .pipe(end(function() {
                test.equal(messageCount, 8);
                test.done();
            }))
    }


};
