var gulp   = require("gulp");
var babel  = require("gulp-babel");
var server = require('gulp-server-livereload');
var rimraf = require('gulp-rimraf');
var jshint = require('gulp-jshint');

var paths = {
  in: {
    lib: {
      js: "./lib/**/*.js"
    },
    examples: {
      js: "./examples/**/*.js"
    }
  },
  out: {
    dist: {
      all: "./dist/**",
      dir: "./dist"
    },
    examples: {
      all: "./examples/**"
    }
  }
};

gulp.task('babel', function() {
  return gulp.src(paths.in.lib.js)
    .pipe(babel())
    .pipe(gulp.dest(paths.out.dist.dir));
});

gulp.task('default', ['server']);

gulp.task('clean', function() {
  return gulp.src(paths.out.dist.dir, {
    read: false
  }).pipe(rimraf({
    force: true
  }));
});

gulp.task('lint', function() {
  return gulp.src([paths.in.lib.js, paths.in.examples.js])
    .pipe(jshint({
      linter: require('jshint-jsx').JSXHINT
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('server', ['babel', 'lint'], function() {
  gulp.watch(paths.in.lib.js, ['babel']);

  gulp.watch([paths.in.lib.js, paths.in.examples.js], ['lint']);

  gulp.src([paths.out.examples.all, paths.out.dist.all])
    .pipe(server({
      livereload: true,
      defaultFile: 'basic-map.html'
    }));
});
