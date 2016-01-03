var connect = require('connect')
var ecstatic = require('ecstatic')
var path = require('path')
var connect_livereload = require('connect-livereload')
var live_reload = require('tiny-lr')()
var fs = require('fs')
var chokidar = require('chokidar')
var browserify = require('browserify')
var watchify = require('watchify')

// settings that should be converted to defaults
var basedir = path.dirname(require.main.filename)
var build_dir = basedir + '/build'
var public_dir = basedir + '/public'

module.exports = {
  listen: listen
}

function listen () {
  var server = connect()

  mkdir_buildir().then(function () {
    setup_public()
    setup_browserify()
  }).catch(function (err) {
    throw err
  })

  server.use(connect_livereload())
  server.use(ecstatic({ root: build_dir }))

  var lr_port = 35729

  live_reload.listen(lr_port, function () {
    console.log('LiveReload listening on %s', lr_port)
  })

  server.listen(3005, function () {
    console.log('public on:', build_dir)
    console.log('listening on http://localhost:3005')
  })
}

function mkdir_buildir () {
  var p = new Promise(function (resolve, reject) {
    fs.mkdir(build_dir, function (err) {
      if (err && err.code !== 'EEXIST') {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  return p
}

function setup_public () {
  chokidar.watch(public_dir)
    .on('change', function (changed) {
      console.log('Changed: ', changed)
      copy_public_file(changed, function (file) {
        live_reload.changed({ body: { files: ['/' + file] } })
      })
    })
  .on('ready', function () {
    console.log(this.getWatched()[public_dir])
    this.getWatched()[public_dir].forEach(function (file) {
      copy_public_file(path.join(public_dir, file))
    })
  })

  function copy_public_file (file, cb) {
    var file_name = path.relative(public_dir, file)

    fs.createReadStream(file)
      .pipe(fs.createWriteStream(path.join(build_dir, file_name)))
      .on('close', function () {
        console.log('Copied: ', file_name)
        if (cb) cb([file_name])
      })
  }
}

function setup_browserify () {
  var b = browserify({
    entries: [basedir + '/application.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify]
  })

  b.on('update', bundle)
  b.on('log', function (msg) {
    console.log(msg)
    live_reload.changed({ body: { files: ['/bundle.js'] } })
  })
  bundle()

  function bundle () {
    b.bundle().pipe(fs.createWriteStream(build_dir + '/bundle.js'))
  }
}
