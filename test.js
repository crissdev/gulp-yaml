'use strict'

const assert = require('assert')
const Readable = require('stream').Readable
const File = require('vinyl')
const PluginError = require('plugin-error')
const es = require('event-stream')
const yaml = require('./')

describe('gulp-yaml', function () {
  describe('in buffer mode', function () {
    const _createFile = function (contents, filename) {
      if (Array.isArray(contents)) {
        contents = contents.join('\n')
      }

      contents = Buffer.from(contents)

      return new File({
        cwd: './',
        base: './test/',
        path: './test/' + (filename || 'mock.yml'),
        contents: contents
      })
    }

    const _fileContents = function (file) {
      return file.contents ? file.contents.toString() : null
    }

    it('should convert to json', function (done) {
      const stream = yaml()

      stream.once('data', function (file) {
        assert.equal(_fileContents(file), '{"root":{"key":"value"}}')
        assert.equal(file.extname, '.json')
        done()
      })

      stream.write(_createFile(['root:', '  key: value']))
      stream.end()
    })

    it('should throw if empty file', function (done) {
      const stream = yaml()

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile(''))
      stream.end()
    })

    it('should throw if not well formatted', function (done) {
      const stream = yaml()

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile([
        '$',
        'missing:',
        '  something?'
      ]))
      stream.end()
    })

    it('should throw if loading untrusted document with safe option enabled', function (done) {
      const stream = yaml({safe: true})

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile('"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"'))
      stream.end()
    })

    it('should use safe loading by default', function (done) {
      const stream = yaml({safe: true})

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile('"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"'))
      stream.end()
    })

    it('should use the specified schema and reject input', function (done) {
      const stream = yaml({schema: 'FAILSAFE_SCHEMA'})

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile('---\nkey: !!null'))
      stream.end()
    })

    it('should use the specified schema and accept input', function (done) {
      const stream = yaml({schema: 'JSON_SCHEMA', safe: false})

      stream.once('data', function (file) {
        assert.equal(_fileContents(file), '{"key":null}')
        done()
      })

      stream.write(_createFile('---\nkey: !!null'))
      stream.end()
    })
  })

  describe('in stream mode', function () {
    const _createFile = function (filename, callback) {
      if (arguments.length === 1) {
        callback = arguments[0]
        filename = null
      }
      const stream = new Readable()
      stream._read = function () {
        callback.apply(this, arguments)
        this.push(null)
      }
      return new File({
        cwd: './',
        base: './test/',
        path: './test/' + (filename || 'mock.yml'),
        contents: stream
      })
    }

    it('should convert to json', function (done) {
      const stream = yaml()

      stream.once('data', function (file) {
        file.contents.pipe(es.wait(function (_, data) {
          assert.equal(data.toString(), '{"root":{"key":"value"}}')
          assert.equal(file.extname, '.json')
          done()
        }))
      })

      stream.write(_createFile(function () {
        this.push('root:\n')
        this.push('  key: value\n')
      }))
      stream.end()
    })

    it('should throw if empty file', function (done) {
      const stream = yaml()

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile(function () { }))
      stream.end()
    })

    it('should throw if not well formatted', function (done) {
      const stream = yaml()

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile(function () {
        this.push('$\n')
        this.push('missing:\n')
        this.push('  something?\n')
      }))
      stream.end()
    })

    it('should throw if loading untrusted document with safe option enabled', function (done) {
      const stream = yaml({safe: true})

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile(function () {
        this.push('"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"')
      }))
      stream.end()
    })

    it('should use safe loading by default', function (done) {
      const stream = yaml()

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile(function () {
        this.push('"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"')
      }))
      stream.end()
    })

    it('should use the specified schema and reject input', function (done) {
      const stream = yaml({schema: 'FAILSAFE_SCHEMA'})

      stream.once('error', function (err) {
        assert.ok(err instanceof PluginError)
        done()
      })

      stream.write(_createFile(function () {
        this.push('---\nkey: !!null')
      }))
      stream.end()
    })

    it('should use the specified schema and accept input', function (done) {
      const stream = yaml({schema: 'JSON_SCHEMA', safe: false})

      stream.once('data', function (file) {
        file.contents.pipe(es.wait(function (_, data) {
          assert.equal(data.toString(), '{"key":null}')
          assert.equal(file.extname, '.json')
          done()
        }))
      })

      stream.write(_createFile(function () {
        this.push('---\nkey: !!null')
      }))
      stream.end()
    })
  })
})
