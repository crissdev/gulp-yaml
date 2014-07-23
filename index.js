// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil   = require('gulp-util');
var yaml    = require('js-yaml');
var rext    = require('replace-ext');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-yaml';

module.exports = function(options) {

    options = options || {
        pretty: false
    };

    // Creating a stream through which each file will pass
    // returning the file stream
    return through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            // Do nothing if no contents
        }
        if (file.isBuffer()) {
            var space = options.pretty ? 2 : null;
            file.contents = new Buffer(JSON.stringify(yaml.load(file.contents), null, space));
            file.path = rext(file.path, '.json')
        }

        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, 'Streaming is not supported!');
        }

        this.push(file);
        return callback();
    });
};
