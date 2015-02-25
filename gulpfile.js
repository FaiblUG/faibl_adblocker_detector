var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var srcPath = 'src';
var distPath = 'dist';


gulp.task('scripts', function() {
  return gulp.src([
      srcPath+'/**/*.js'
    ])
      .pipe(gulp.dest(distPath))
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += "-min";
      }))
      .pipe(gulp.dest(distPath));
});

gulp.task('clean', function() {
  return del([distPath]);
});

gulp.task('default', ['clean'], function() {
  gulp.start('scripts');
});

gulp.task('watch', ['default'], function() {
  gulp.watch([srcPath+'/**/*.js'], ['scripts']);
});
