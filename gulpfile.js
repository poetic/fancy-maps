var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var concatCss = require('gulp-concat-css');
var del = require('del');
var gulp   = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var server = require('gulp-server-livereload');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var paths = {
  in: {
    examples: {
      js: './examples/**/*.js'
    },
    lib: {
      js: './lib/**/*.js'
    }
  },
  out: {
    dist: {
      all: './dist/**',
      dir: './dist'
    },
    examples: {
      all: './examples/**'
    }
  },
  vendor: './vendor/**'
};

gulp.task('babel', ['clean'], function() {
  var b = browserify({
    entries: [
      './lib/components/leaflet-components.js',
      './vendor/leaflet.spin.js'
    ],
    debug: true
  }).transform(babelify);

  return b.bundle()
    .pipe(source('leaflet-components.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.out.dist.dir))
    .on('error', gutil.log);
});

gulp.task('clean', function() {
  return del(paths.out.dist.dir);
});

gulp.task('css', function() {
  return gulp.src([
    './node_modules/leaflet.markercluster/dist/MarkerCluster.css',
    './node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
    './node_modules/leaflet/dist/leaflet.css'
  ]).pipe(concatCss('vendor.css'))
    .pipe(gulp.dest(paths.out.dist.dir));
});

gulp.task('default', ['server']);

gulp.task('lint', function() {
  return gulp.src([paths.in.lib.js, paths.in.examples.js])
    .pipe(jshint({
      linter: require('jshint-jsx').JSXHINT
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('server', ['babel', 'css', 'lint'], function() {
  gulp.watch(paths.in.lib.js, ['babel']);

  gulp.watch([paths.in.lib.js, paths.in.examples.js], ['lint']);

  gulp.src([paths.out.examples.all, paths.out.dist.all, paths.vendor])
    .pipe(server({
      livereload: true,
      defaultFile: 'basic-map.html'
    }));
});
