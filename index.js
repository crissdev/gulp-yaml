// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil   = require('gulp-util');
var yaml    = require('js-yaml');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-yaml';

module.exports = function(options) {

    options = options || {
        pretty: false,
        safe: false
    };

    // Creating a stream through which each file will pass
    // returning the file stream
    return through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            // Do nothing if no contents
        }
        if (file.isBuffer()) {
            var space = options.pretty ? 2 : null,
                contents = file.contents.toString('utf8'),
                ymlDocument;

            if (contents.length === 0) {
                this.emit('error', new PluginError(PLUGIN_NAME, 'File ' + file.path + ' is empty. YAML loader cannot load empty content'));
                return callback();
            }

            try {
                if (options.safe) {
                    ymlDocument = yaml.safeLoad(contents);
                }
                else {
                    ymlDocument = yaml.load(contents);
                }
            }
            catch (error) {
                this.emit('error', new PluginError(PLUGIN_NAME, error.message));
                return callback();
            }

            file.contents = new Buffer(JSON.stringify(ymlDocument, null, space));
            file.path = gutil.replaceExtension(file.path, '.json');
        }

        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, 'Streaming is not supported!');
        }

        this.push(file);
        return callback();
    });
};
