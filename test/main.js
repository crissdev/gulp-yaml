var should = require('should');
var yaml = require('../');
var gutil = require('gulp-util');
var fs = require('fs');
require('mocha');

describe('gulp-yaml', function() {

    var yamlTestFile;

    beforeEach(function() {
        yamlTestFile = new gutil.File({
            path: './test/file.yml',
            cwd: './test/',
            base: './test/',
            contents: new Buffer(fs.readFileSync('./test/file.yml'))
        })
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
            file.contents.toString().should.equal('{"root":{"key":"value"}}');
            done();
        });

        stream.write(yamlTestFile);
        stream.end();
    });


    it('should convert to pretty json', function(done) {
        var stream = yaml({ pretty: true });

        stream.once('data', function(file) {
            file.contents.toString().should.equal('{\n  "root": {\n    "key": "value"\n  }\n}');
            done();
        });

        stream.write(yamlTestFile);
        stream.end();
    });


    it('should not nothing', function(done) {
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

});


