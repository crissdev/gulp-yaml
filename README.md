# gulp-yaml

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
  .pipe(yaml({ pretty: true ))
  .pipe(gulp.dest('./dist/'))
```


## API

### yaml([options])

#### options.pretty

Type: `Boolean`
Default: `false`

Output pretty (indented) resulting JSON.


## LICENSE

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-yaml
[npm-image]: https://badge.fury.io/js/gulp-yaml.png

[travis-url]: http://travis-ci.org/CrissDev/gulp-yaml
[travis-image]: https://secure.travis-ci.org/CrissDev/gulp-yaml.png?branch=master

[depstat-url]: https://david-dm.org/CrissDev/gulp-yaml
[depstat-image]: https://david-dm.org/CrissDev/gulp-yaml.png
