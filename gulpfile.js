var gulp = require('gulp');
var babel = require("gulp-babel");
var babelify = require('babelify');
var concat = require("gulp-concat");
var uglify = require('gulp-uglifyjs');

gulp.task('build', function() {
    gulp.src("src/scroll-animation.js")
      .pipe(concat("scrollAnimation.min.js"))
      .pipe(babel())
      .pipe(gulp.dest("dist"));
});


gulp.task('watch', function() {
    gulp.watch(['src/**'], ['build']);
});

gulp.task('default', ['watch', 'build']);