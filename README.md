#[gulp](https://github.com/gulpjs/gulp)-yaml

[![NPM version](https://badge.fury.io/js/gulp-yaml.png)](http://badge.fury.io/js/gulp-yaml)
[![Build Status](https://travis-ci.org/crissdev/gulp-yaml.png?branch=master)](https://travis-ci.org/crissdev/gulp-yaml)
[![Dependency Status](https://david-dm.org/crissdev/gulp-yaml.png)](https://david-dm.org/crissdev/gulp-yaml)

> A [Gulp](https://github.com/gulpjs/gulp) plugin to convert [YAML](http://en.wikipedia.org/wiki/YAML) to [JSON](http://en.wikipedia.org/wiki/JSON)


## Install

```sh
npm install --save-dev gulp-yaml
```

## Usage

```js
var yaml = require('gulp-yaml');

gulp.src('./src/*.yml')
  .pipe(yaml())
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

Default: `false`

Enable or disable support for regexps, functions and undefined.

**This flag should be enabled when working with untrusted data.**


#### options.space

Type: `Number` or `String`

Default: `null`

Control spacing in the resulting output. It has the same usage as for [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)


#### options.replace

Type: `Function` or `Array`

Default: `null`

Further transform the resulting output. It has the same usage as for [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)


#### options.pretty

Type: `Boolean`

Default: `false`

Output pretty (indented) resulting JSON - using 2 spaces. _options.space_ is ignored if this flag is set to true.

**This option has been deprecated. Use _space_ option instead**


## License

MIT © [Cristian Trifan](http://crissdev.com)
