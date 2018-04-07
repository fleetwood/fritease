const gulp = require('gulp');
const sass = require('gulp-sass');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => gulp.src([
  'node_modules/bootstrap/scss/bootstrap.scss',
  'public/scss/*.scss',
])
  .pipe(sass())
  .pipe(gulp.dest('public/css')));

// Move the javascript files into our /src/js folder
gulp.task('js', () => gulp.src([
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/tether/dist/js/tether.min.js',
])
  .pipe(gulp.dest('public/js')));

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], () => {
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'public/scss/*.scss'], ['sass']);
});

gulp.task('default', ['js', 'serve']);
