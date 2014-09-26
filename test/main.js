'use strict';

var yaml = require('../'),
    gutil = require('gulp-util'),
    File = gutil.File,
    es = require('event-stream'),
    fs = require('fs'),
    path = require('path');

require('should');
require('mocha');


describe('gulp-yaml', function() {

    // Test files
    var emptyFile,
        unsafeFile,
        validFile,
        invalidFile,
        nullFile;


    describe('in buffer mode', function() {

        beforeEach(function() {
            emptyFile = new File({
                path: 'test/empty.yml',
                cwd: 'test',
                contents: new Buffer('')
            });
            unsafeFile = new File({
                path: 'test/unsafe.yml',
                cwd: 'test',
                contents: fs.createReadStream('test/unsafe.yml')
            });
            validFile = new File({
                path: 'test/valid.yml',
                cwd: 'test',
                contents: fs.readFileSync('test/valid.yml')
            });
            invalidFile = new File({
                path: 'test/invalid.yml',
                cwd: 'test',
                contents: fs.readFileSync('test/invalid.yml')
            });
            nullFile = new File({
                cwd: 'test',
                contents: null
            });
        });

        it('should convert to json', function(done) {
            var stream = yaml();

            stream.once('data', function(file) {
                file.contents.toString('utf8').should.equal('{"root":{"key":"value"}}');
                path.extname(file.path).should.equal('.json');
                done();
            });

            stream.write(validFile);
            stream.end();
        });

        it('should convert to pretty json', function(done) {
            var stream = yaml({space: 2});

            stream.once('data', function(file) {
                file.contents.toString('utf8').should.equal('{\n  "root": {\n    "key": "value"\n  }\n}');
                path.extname(file.path).should.equal('.json');
                done();
            });

            stream.write(validFile);
            stream.end();
        });

        it('should convert to pretty json with deprecated option pretty', function(done) {
            var stream = yaml({pretty: true});

            stream.once('data', function(file) {
                file.contents.toString('utf8').should.equal('{\n  "root": {\n    "key": "value"\n  }\n}');
                path.extname(file.path).should.equal('.json');
                done();
            });

            stream.write(validFile);
            stream.end();
        });

        it('should do nothing when contents is null', function(done) {
            var stream = yaml();

            stream.once('data', function(file) {
                file.isNull().should.equal(true);
                path.extname(file.path).should.equal('');
                done();
            });

            stream.write(nullFile);
            stream.end();
        });

        it('should throw if empty file', function(done) {
            var stream = yaml();

            stream.once('error', function(error) {
                error.message.should.equal('File ' + emptyFile.path +
                ' is empty. YAML loader cannot load empty content');
                done();
            });

            stream.write(emptyFile);
            stream.end();
        });

        it('should throw if not well formatted', function(done) {
            var stream = yaml();

            stream.once('error', function(error) {
                done();
            });

            stream.write(invalidFile);
            stream.end();
        });

        it('should throw if loading untrusted document with safe option enabled', function(done) {
            var stream = yaml({safe: true});

            stream.once('error', function(/*error*/) {
                done();
            });

            stream.write(unsafeFile);
            stream.end();
        });
    });

    describe('in stream mode', function() {

        beforeEach(function() {
            emptyFile = new gutil.File({
                path: 'test/empty.yml',
                cwd: 'test',
                contents: fs.createReadStream('test/empty.yml')
            });
            unsafeFile = new File({
                path: 'test/unsafe.yml',
                cwd: 'test',
                contents: fs.createReadStream('test/unsafe.yml')
            });
            validFile = new File({
                path: 'test/valid.yml',
                cwd: 'test',
                contents: fs.createReadStream('test/valid.yml')
            });
            invalidFile = new File({
                path: 'test/invalid.yml',
                cwd: 'test',
                contents: fs.createReadStream('test/invalid.yml')
            });
        });

        it('should convert to json', function(done) {
            var stream = yaml();

            stream.once('data', function(file) {
                file.contents.pipe(es.wait(function(err, data) {
                    data.toString('utf8').should.equal('{"root":{"key":"value"}}');
                    path.extname(file.path).should.equal('.json');
                    done();
                }));
            });

            stream.write(validFile);
            stream.end();
        });

        it('should convert to pretty json', function(done) {
            var stream = yaml({space: 2});

            stream.once('data', function(file) {
                file.contents.pipe(es.wait(function(err, data) {
                    data.toString('utf8').should.equal('{\n  "root": {\n    "key": "value"\n  }\n}');
                    path.extname(file.path).should.equal('.json');
                    done();
                }));
            });

            stream.write(validFile);
            stream.end();
        });

        it('should convert to pretty json with deprecated option pretty', function(done) {
            var stream = yaml({pretty: true});

            stream.once('data', function(file) {
                file.contents.pipe(es.wait(function(err, data) {
                    data.toString('utf8').should.equal('{\n  "root": {\n    "key": "value"\n  }\n}');
                    path.extname(file.path).should.equal('.json');
                    done();
                }));
            });

            stream.write(validFile);
            stream.end();
        });

        it('should do nothing when contents is null', function(done) {
            var stream = yaml();

            stream.once('data', function(file) {
                file.isNull().should.equal(true);
                path.extname(file.path).should.equal('');
                done();
            });

            stream.write(nullFile);
            stream.end();
        });

        it('should throw if empty file', function(done) {
            var stream = yaml();

            stream.once('error', function(error) {
                error.message.should.equal('File ' + emptyFile.path +
                ' is empty. YAML loader cannot load empty content');
                done();
            });

            stream.write(emptyFile);
            stream.end();
        });

        it('should throw if not well formatted', function(done) {
            var stream = yaml();

            stream.once('error', function(error) {
                done();
            });

            stream.write(invalidFile);
            stream.end();
        });

        it('should throw if loading untrusted document with safe option enabled', function(done) {
            var stream = yaml({safe: true});

            stream.once('error', function(/*error*/) {
                done();
            });

            stream.write(unsafeFile);
            stream.end();
        });
    });

});
