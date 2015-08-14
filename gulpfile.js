var gulp   = require("gulp");
var babel  = require("gulp-babel");
var server = require('gulp-server-livereload');
var rimraf = require('gulp-rimraf');
var jshint = require('gulp-jshint');

var path = {
  in: {
    lib: "./lib/**/*.js",
    dist: "./dist/**/*.js",
    examples: "./examples/**/*.js"
  },
  out: {
    dist: "./dist",
    examples: "./examples"
  }
};

gulp.task('babel', function() {
  return gulp.src(path.in.lib)
    .pipe(babel())
    .pipe(gulp.dest(path.out.dist));
});

gulp.task('default', ['server']);

gulp.task('clean', function() {
  return gulp.src(path.out.dist, {
    read: false
  }).pipe(rimraf({
    force: true
  }));
});

gulp.task('lint', function() {
  return gulp.src([path.in.lib, path.in.examples])
    .pipe(jshint({
      linter: require('jshint-jsx').JSXHINT
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('server', ['babel', 'lint'], function() {
  gulp.watch(path.in.lib, ['babel']);

  gulp.watch([path.in.lib, path.in.examples], ['lint']);

  gulp.src(["./examples/**", "./dist/**"])
    .pipe(server({
      livereload: true,
      open: true,
      defaultFile: 'basic-map.html'
    }));
});
