'use strict'

var yaml = require('js-yaml')
var through = require('through2')
var BufferStreams = require('bufferstreams')
var replaceExt = require('replace-ext')
var PluginError = require('plugin-error')

var PLUGIN_NAME = 'gulp-yaml'

module.exports = function (options) {
  options = options || {}
  options.schema = getSchema(options)
  options.ext = options.ext || '.json'

  var providedFilename = options.filename

  return through.obj(function (file, enc, callback) {
    options.filename = providedFilename || file.path

    var stream = this

    file.contents = getFileContents(file, options, stream, callback)

    stream.push(file)
    callback()
  })
}

function getSchema (options) {
  if (options.safe === false) { return yaml.DEFAULT_FULL_SCHEMA }

  if (options.safe === true || options.schema === undefined) { return yaml.DEFAULT_SAFE_SCHEMA }

  if (options.schema instanceof yaml.Schema) { return options.schema }

  var schemaName = typeof options.schema === 'string' ? options.schema.toUpperCase() : options.schema
  if (yaml[schemaName] !== undefined) { return yaml[schemaName] }

  throw getError('Schema ' + schemaName + ' is not valid')
}

function getFileContents (file, options, stream, callback) {
  if (file.isNull()) {
    return file.contents
  }

  if (file.isBuffer()) {
    return getBufferContents(file, options, stream, callback)
  }

  if (file.isStream()) {
    return getStreamContents(file, options, stream)
  }
}

function getBufferContents (file, options, stream, callback) {
  var parsed = convertYaml(file, file.contents, options)

  if (parsed instanceof PluginError) {
    stream.emit('error', parsed)
    return callback()
  }

  return parsed
}

function getStreamContents (file, options, stream) {
  var streamer = new BufferStreams(function (err, buf, callback) {
    if (err) {
      stream.emit('error', getError(err))
      return callback()
    }

    var parsed = convertYaml(file, buf, options)

    if (parsed instanceof PluginError) {
      stream.emit('error', parsed)
      return callback()
    }

    callback(null, parsed)
  })

  return file.contents.pipe(streamer)
}

function convertYaml (file, buf, options) {
  if (buf.length === 0) {
    return getError('File ' + file.path + ' is empty. YAML loader cannot load empty content')
  }

  try {
    file.path = replaceExt(file.path, options.ext)
    return yaml2json(buf, options)
  } catch (error) {
    return getError(error)
  }
}

function yaml2json (buffer, options) {
  var ymlDocument = options.safe ? yaml.safeLoad(buffer, options) : yaml.load(buffer, options)
  var jsonValue = JSON.stringify(ymlDocument, options.replacer, options.space)
  return Buffer.from(jsonValue)
}

function getError (error) {
  return new PluginError(PLUGIN_NAME, error, {showStack: true})
}
