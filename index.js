'use strict';

var through = require('through2'),
    gutil   = require('gulp-util'),
    yaml    = require('js-yaml'),
    extend  = require('extend'),
    BufferStreams = require('bufferstreams'),
    PluginError = gutil.PluginError,
    PLUGIN_NAME = 'gulp-yaml';


function yaml2json(buffer, options) {
    var contents = buffer.toString('utf8'),
        ymlDocument = options.safe ? yaml.safeLoad(contents) : yaml.load(contents);
    return new Buffer(JSON.stringify(ymlDocument, options.replacer, options.space));
}

module.exports = function(options) {
    options = extend({ safe: false, replacer: null, space: null }, options);

    if (options.pretty) {
        gutil.log(gutil.colors.gray(PLUGIN_NAME +
            ': pretty option has been deprecated. Use the new space option instead.'));
        options.space = 2;
    }

    return through.obj(function(file, enc, callback) {
        var self = this;

        if (file.isBuffer()) {
            if (file.contents.length === 0) {
                this.emit('error', new PluginError(PLUGIN_NAME, 'File ' + file.path +
                    ' is empty. YAML loader cannot load empty content'));
                return callback();
            }
            try {
                file.contents = yaml2json(file.contents, options);
                file.path = gutil.replaceExtension(file.path, '.json');
            }
            catch (error) {
                this.emit('error', new PluginError(PLUGIN_NAME, error.message));
                return callback();
            }
        }
        else if (file.isStream()) {
            file.contents = file.contents.pipe(new BufferStreams(function(err, buf, cb) {
                if (err) {
                    self.emit('error', new PluginError(PLUGIN_NAME, err.message));
                }
                else {
                    if (buf.length === 0) {
                        var error = new PluginError(PLUGIN_NAME, 'File ' + file.path +
                                ' is empty. YAML loader cannot load empty content');
                        self.emit('error', error);
                        cb(error);
                    }
                    else {
                        try {
                            file.path = gutil.replaceExtension(file.path, '.json');
                            cb(null, yaml2json(buf, options));
                        }
                        catch (error) {
                            self.emit('error', new PluginError(PLUGIN_NAME, error.message));
                            cb(error);
                        }
                    }
                }
            }));
        }
        this.push(file);
        return callback();
    });
};
