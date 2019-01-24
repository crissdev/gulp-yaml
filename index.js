'use strict'

const yaml = require('js-yaml')
const through = require('through2')
const BufferStreams = require('bufferstreams')
const replaceExt = require('replace-ext')
const PluginError = require('plugin-error')
const assign = require('object-assign')

const PLUGIN_NAME = 'gulp-yaml'

module.exports = function (options) {
  options = assign({}, options)
  options.schema = getSchema(options)
  options.ext = options.ext || '.json'

  const providedFilename = options.filename

  return through.obj(function (file, enc, callback) {
    options.filename = providedFilename || file.path

    const stream = this

    file.contents = getFileContents(file, options, stream)

    stream.push(file)
    callback()
  })
}

function getSchema (options) {
  if (options.safe === false) { return yaml.DEFAULT_FULL_SCHEMA }

  if (options.safe === true || options.schema === undefined) { return yaml.DEFAULT_SAFE_SCHEMA }

  if (options.schema instanceof yaml.Schema) { return options.schema }

  const schemaName = typeof options.schema === 'string' ? options.schema.toUpperCase() : options.schema
  if (yaml[schemaName] !== undefined) { return yaml[schemaName] }

  throw getError('Schema ' + schemaName + ' is not valid')
}

function getFileContents (file, options, stream) {
  if (file.isNull()) {
    return file.contents
  }

  if (file.isBuffer()) {
    return getBufferContents(file, options, stream)
  }

  if (file.isStream()) {
    return getStreamContents(file, options, stream)
  }
}

function getBufferContents (file, options, stream) {
  const parsed = convertYaml(file, file.contents, options)

  if (parsed instanceof PluginError) {
    stream.emit('error', parsed)
    return Buffer.from('')
  }

  return parsed
}

function getStreamContents (file, options, stream) {
  const streamer = new BufferStreams(function (err, buf, callback) {
    if (err) {
      stream.emit('error', getError(err))
      return callback()
    }

    const parsed = convertYaml(file, buf, options)

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
  const ymlDocument = options.safe ? yaml.safeLoad(buffer, options) : yaml.load(buffer, options)
  const jsonValue = JSON.stringify(ymlDocument, options.replacer, options.space)
  return Buffer.from(jsonValue)
}

function getError (error) {
  return new PluginError(PLUGIN_NAME, error, { showStack: true })
}
