'use strict';

var yaml = require('../');
var gutil = require('gulp-util');
var es = require('event-stream');
var fs = require('fs');

require('should');
require('mocha');


describe('gulp-yaml', function() {

    var yamlTestFile;

    beforeEach(function() {
        yamlTestFile = new gutil.File({
            path: './test/file.yml',
            cwd: './test/',
            base: './test/',
            contents: fs.readFileSync('./test/file.yml')
        });
    });

    it('should change extension to .json', function(done) {
        var stream = yaml();
        stream.once('data', function(file) {
            var path = require('path');
            path.extname(file.path).should.equal('.json');
            done();
        });
        stream.write(yamlTestFile);
        stream.end();
    });

    it('should convert to json', function(done) {
        var stream = yaml();

        stream.once('data', function(file) {
            file.contents.toString('utf8').should.equal('{"root":{"key":"value"}}');
            done();
        });

        stream.write(yamlTestFile);
        stream.end();
    });

    it('should convert to pretty json', function(done) {
        var stream = yaml({ space: 2 });

        stream.once('data', function(file) {
            file.contents.toString('utf8').should.equal('{\n  "root": {\n    "key": "value"\n  }\n}');
            done();
        });

        stream.write(yamlTestFile);
        stream.end();
    });

    it('should convert to pretty json with deprecated option pretty', function(done) {
        var stream = yaml({ pretty: true });

        stream.once('data', function(file) {
            file.contents.toString('utf8').should.equal('{\n  "root": {\n    "key": "value"\n  }\n}');
            done();
        });

        stream.write(yamlTestFile);
        stream.end();
    });

    it('should do nothing', function(done) {
        var stream = yaml();

        stream.once('data', function(file) {
            var path = require('path');
            path.extname(file.path).should.equal('.yml');
            done();
        });

        stream.write(new gutil.File({
            path: './test/file.yml',
            cwd: './test/',
            base: './test/',
            contents: null
        }));

        stream.end();
    });

    it('should not accept empty file', function(done) {
        var stream = yaml(),
            file = new gutil.File({
                path: './test/file.yml',
                cwd: './test/',
                base: './test/',
                contents: new Buffer('')
            });

        stream.once('error', function(error) {
            error.message.should.equal('File ' + yamlTestFile.path +
                ' is empty. YAML loader cannot load empty content');
            done();
        });

        stream.write(file);
        stream.end();
    });

    it('should throw if loading untrusted document with safe option enabled', function(done) {
        var stream = yaml({ safe: true }),
            file = new gutil.File({
                path: './test/unsafe.yml',
                cwd: './test/',
                base: './test/',
                contents: new Buffer(fs.readFileSync('./test/unsafe.yml'), 'utf8')
            });

        stream.once('error', function(error) {
            done();
        });

        stream.write(file);
        stream.end();
    });

    it('should work with streams', function(done) {
        var stream = yaml({ space: 2 }),
            file = new gutil.File({
                path: './test/file.yml',
                cwd: './test/',
                base: './test/',
                contents: fs.createReadStream('./test/file.yml', { encoding: 'utf8' })
            });

        stream.on('data', function(file) {
            file.pipe(es.wait(function(err, data) {
                data.toString('utf8').should.equal('{\n  "root": {\n    "key": "value"\n  }\n}');
                done();
            }));
        });

        stream.write(file);
        stream.end();
    });

    it('should not accept empty stream', function(done) {
        var stream = yaml({ space: 2 }),
            file = new gutil.File({
                path: './test/empty.yml',
                cwd: './test/',
                base: './test/',
                contents: fs.createReadStream('./test/empty.yml', { encoding: 'utf8' })
            });

        stream.once('error', function(error) {
            error.message.should.equal('File ' + file.path +
                ' is empty. YAML loader cannot load empty content');
            done();
        });

        stream.write(file);
        stream.end();
    });
});
