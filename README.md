# gulp-yaml

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm version](https://badge.fury.io/js/gulp-yaml.svg)](http://badge.fury.io/js/gulp-yaml)
[![Build Status](https://travis-ci.org/crissdev/gulp-yaml.svg?branch=master)](https://travis-ci.org/crissdev/gulp-yaml)
[![Build status](https://ci.appveyor.com/api/projects/status/ncljdqu2v5d611p5/branch/master?svg=true&passingText=master%20-%20OK)](https://ci.appveyor.com/project/crissdev/gulp-yaml/branch/master)
[![Dependency Status](https://david-dm.org/crissdev/gulp-yaml.svg)](https://david-dm.org/crissdev/gulp-yaml)

> A [Gulp](https://github.com/gulpjs/gulp) plugin to convert [YAML](http://en.wikipedia.org/wiki/YAML) to [JSON](http://en.wikipedia.org/wiki/JSON) using [js-yaml](https://github.com/nodeca/js-yaml).


## Install

```sh
npm install gulp-yaml --save-dev
```

## Usage

```js
const yaml = require('gulp-yaml');

gulp.src('./src/*.yml')
  .pipe(yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
  .pipe(gulp.dest('./dist/'))

gulp.src('./src/*.yml')
  .pipe(yaml({ space: 2 }))
  .pipe(gulp.dest('./dist/'))

gulp.src('./src/*.yml')
  .pipe(yaml({ safe: true }))
  .pipe(gulp.dest('./dist/'))
```


## API

### yaml([options])


#### options.safe

Type: `Boolean`

Default: `true`

Enable or disable support for regexps, functions and undefined.

**This flag should always be enabled when working with untrusted data.**

When this flag is enabled then [safeLoad](https://github.com/nodeca/js-yaml#safeload-string---options-) method is used, otherwise [load](https://github.com/nodeca/js-yaml#load-string---options-).


#### options.space

Type: `Number` or `String`

Default: `null`

Control spacing in the resulting output. It has the same usage as for [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)


#### options.replacer

Type: `Function` or `Array`

Default: `null`

Further transform the resulting output. It has the same usage as for [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)


#### options.schema

Type: `String`

Default: `DEFAULT_SAFE_SCHEMA` or `DEFAULT_FULL_SCHEMA`

Specifies what schema to use. Valid values are the same that [js-yaml](https://github.com/nodeca/js-yaml) supports, except they are received as strings (lowercase or uppercase). See the example in the Usage section of this README. The default schema is chosen using the `safe` option.


#### options.filename

Type: `String`

Default: the path of the file processed

String to be used as a file path in error/warning messages.

#### options.ext

Type: `String`

Default: `.json`

File extension of the generated file.

#### options.json

Type: `Boolean`

Default: `false`

Compatibility with JSON.parse behaviour.
If true, then duplicate keys in a mapping will override values rather than
throwing an error.

#### options.onWarning

Type: `Function`

Default: `null`

Function to call on warning messages.
Loader will throw on warnings if this function is not provided.

## License

MIT © [Cristian Trifan](https://crissdev.com)

