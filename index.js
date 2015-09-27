'use strict';

var through         = require('through2');
var gutil           = require('gulp-util');
var yaml            = require('js-yaml');
var BufferStreams   = require('bufferstreams');
var PluginError     = gutil.PluginError;
var PLUGIN_NAME     = 'gulp-yaml';


function yaml2json(buffer, options) {
    var contents = buffer.toString('utf8'),
        ymlDocument = options.safe ? yaml.safeLoad(contents) : yaml.load(contents);
    return new Buffer(JSON.stringify(ymlDocument, options.replacer, options.space));
}

function mergeOptions(options, userOptions) {
    if (userOptions) {
        Object.keys(options).forEach(function(key) {
            if (typeof userOptions[key] !== 'undefined') {
                options[key] = userOptions[key];
            }
        });
    }
    return options;
}

module.exports = function(options) {
    options = mergeOptions({ safe: false, replacer: null, space: null }, options);

    return through.obj(function(file, enc, callback) {
        if (file.isBuffer()) {
            if (file.contents.length === 0) {
                callback(new PluginError(PLUGIN_NAME, 'File ' + file.path +
                    ' is empty. YAML loader cannot load empty content'));
                return;
            }
            try {
                file.contents = yaml2json(file.contents, options);
                file.path = gutil.replaceExtension(file.path, '.json');
            }
            catch (error) {
                callback(new PluginError(PLUGIN_NAME, error, { showStack: true }));
                return;
            }
        }
        else if (file.isStream()) {
            var streamer = new BufferStreams(function(err, buf, cb) {
                if (err) {
                    callback(new PluginError(PLUGIN_NAME, err, { showStack: true }));
                }
                else {
                    if (buf.length === 0) {
                        cb(new PluginError(PLUGIN_NAME, 'File ' + file.path +
                            ' is empty. YAML loader cannot load empty content'));
                    }
                    else {
                        try {
                            var parsed = yaml2json(buf, options);
                            file.path = gutil.replaceExtension(file.path, '.json');
                            cb(null, parsed);
                        }
                        catch (error) {
                            cb(new PluginError(PLUGIN_NAME, error, { showStack: true }));
                        }
                    }
                }
            });
            streamer.on('error', callback);
            file.contents = file.contents.pipe(streamer);
        }
        callback(null, file);
    });
};
