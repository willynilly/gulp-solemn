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
var gulpSolemn = require('gulp-solemn');

var gulpSolemnCss = gulpSolemn('css');
var gulpSolemnJs = gulpSolemn('js');

var gulpSolemnCssWithDictionary = gulpSolemn('css', ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json']);
var gulpSolemnJsWithDictionary = gulpSolemn('js', ['test/fixtures/dictionary1.json', 'test/fixtures/dictionary2.json']);

gulp.src('test/fixtures/*.js')
    .pipe(gulpSolemnJs)

gulp.src('test/fixtures/*.css')
    .pipe(gulpSolemnCss)

gulp.src('test/fixtures/*.js')
    .pipe(gulpSolemnJsWithDictionary)

gulp.src('test/fixtures/*.css')
    .pipe(gulpSolemnCssWithDictionary)

```

## Test
To test the module, run the follow from the command line:
```js

npm test

```
