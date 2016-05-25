# gulp-solemn
A gulp plugin to detect inappropriate language in your code.

## Overview
The plugin prints violation messages to the console when it encounters inappropriate language in your JS or CSS files.  Each word is associated to one or more violation categories.  For example, you might associate the word "beefcake" with the violation category "sexist".  You can add your own custom dictionaries to specify words that cause violations.

## Dictionary Format
Each custom dictionary is a JSON file with the following format:

```js
{
  "word1": ["category1", "category3"],
  "word2": ["category2"],
  "word3": ["category1"]
  "word4": ["category2", "category3", "category4"]
}
```

Every word must have at least one violation category.  If multiple dictionaries are specified, words and their categories are merged.

## Usage
```js

var gulp = require('gulp');
var solemn = require('gulp-solemn');

// simple example
var simpleSolemnOptions = {
  printViolationMessages: true, // whether to print the violations to the console
  includeDefaultDictionary: true, // whether to include the default dictionary as well
};

gulp.src(['**/*.css', '**/*.js'])
    .pipe(solemn(simpleSolemnOptions))


// custom reporter example
var simpleSolemnOptions = {
  printViolationMessages: true,
  reporter: function(violationMessage) {
    console.log(violationMessage);
  }
};

gulp.src(['**/*.css', '**/*.js'])
    .pipe(solemn(simpleSolemnOptions))

// load a custom custom dictionary and
// do something with each file's set of violation objects
var perFileSolemnOptions = {
    fileViolationsCallback: function(fileName, violations, violationMessages) {
      // the violations and corresponding violation messages for a particular file
      console.log(fileName);
      violations.forEach(function(violation) {
        console.log(violation.file);
        console.log(violation.issues);
      });
    },
    dictionaries: ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json'],
    includeDefaultDictionary: false,
    printViolationMessages: false,
};

gulp.src(['**/*.css', '**/*.js'])
    .pipe(solemn(perFileSolemnOptions))

// load a custom custom dictionary and
// do something with each file's set of violation objects
var allFilesSolemnOptions = {
    allViolationsCallback: function(violations, violationMessages) {
      // the violations and corresponding violation messages for all files after they have been processed
      violations.forEach(function(violation) {
        console.log(violation.file);
        console.log(violation.type);
        console.log(violation.issues);
        console.log(violation.line);
        console.log(violation.column);
        console.log(violation.text);
      });

      // already formatted violation messages
      // same as what is printed when printViolationMessages === true
      violationMessages.forEach(function(vm) {
        console.log(vm);
      })
    },
    dictionaries: ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json'],
    includeDefaultDictionary: false,
    printViolationMessages: false,
};

gulp.src(['**/*.css', '**/*.js'])
    .pipe(solemn(perFileSolemnOptions))

```

## Test
To test the module, run the follow from the command line:
```js

npm test

```
