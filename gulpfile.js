var gulp = require('gulp');
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task('build', function() {
    return gulp.src("src/scroll-animation.js")
      .pipe(concat("scrollAnimation.min.js"))
      .pipe(babel())
      .pipe(gulp.dest("dist"));
});


gulp.task('watch', function() {
    gulp.watch(['src/**'], gulp.series('build'));
});

gulp.task('default', gulp.series('build', 'watch'));