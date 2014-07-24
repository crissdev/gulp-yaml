# gulp-yaml

[![NPM version](https://badge.fury.io/js/gulp-yaml.png)](http://badge.fury.io/js/gulp-yaml)
[![Build Status](https://travis-ci.org/CrissDev/gulp-yaml.png?branch=master)](https://travis-ci.org/CrissDev/gulp-yaml)
[![Dependency Status](https://david-dm.org/CrissDev/gulp-yaml.png)](https://david-dm.org/CrissDev/gulp-yaml)

> A [Gulp](https://github.com/gulpjs/gulp) plugin to convert [YAML](http://en.wikipedia.org/wiki/YAML) to [JSON](http://en.wikipedia.org/wiki/JSON)


```javascript
var yaml = require('gulp-yaml');
```

## Usage

```javascript
var yaml = require('gulp-yaml');

gulp.src('./src/*.yml')
  .pipe(yaml())
  .pipe(gulp.dest('./dist/'))

gulp.src('./src/*.yml')
  .pipe(yaml({ pretty: true }))
  .pipe(gulp.dest('./dist/'))
  
gulp.src('./src/*.yml')
  .pipe(yaml({ safe: true }))
  .pipe(gulp.dest('./dist/'))
```


## API

### yaml([options])

#### options.pretty

Type: `Boolean`

Default: `false`

Output pretty (indented) resulting JSON.

#### options.safe

Type: `Boolean`

Default: `false`

Enable support for regexps, functions and undefined. 

**This flag should be enabled when working with untrusted data.**


## LICENSE

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
