const
  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  glob = require('gulp-sass-glob'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  stylish = require('jshint-stylish'),
  imagemin = require('gulp-imagemin'),
  postcss = require('gulp-postcss'),
  rename = require("gulp-rename"),
  autoprefixer = require('autoprefixer');

var thisWatchFiles = './patterns/**/sass/*.scss';
var thisWatchBase = './base/*.scss';
var frontifyApi = require('@frontify/frontify-api');


/*SASS TASK*/
gulp.task('patterns', function () {
  return gulp.src("./patterns/**/sass/*.scss")
  .pipe(glob())
  .pipe(plumber({
    errorHandler: function (error) {
      notify.onError({
        title: "Gulp",
        subtitle: "Falló!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
      })(error);
      this.emit('end');
    }
  }))
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(rename(function (path) {
    var temp = path.dirname.slice(0, -4);
    path.dirname = temp + "css";
  }))
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest('./patterns'))
});

/* SASS LINT TASK */
gulp.task('sass_lint', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');
  return gulp
    .src(thisWatchFiles)
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true }
      ]
    }));
});

gulp.task('default', ['patterns','sass_lint'], function() {
    gulp.watch(thisWatchFiles, ['patterns']); // Reload on SCSS file changes.
    gulp.watch(thisWatchBase, ['patterns']); // Reload on SCSS file changes.
});
