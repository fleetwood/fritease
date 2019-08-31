const gulp = require('gulp');
const sass = require('gulp-sass');
const exec = require('child_process').exec;

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => gulp.src([
  'node_modules/bootstrap/scss/bootstrap.scss',
  'public/scss/*.scss',
])
  .pipe(sass())
  .pipe(gulp.dest('public/css')));

// Move the javascript files into our /src/js folder
gulp.task('js', () => gulp.src([
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
  'node_modules/bootstratp/js/dist/alert.min.js',
  'node_modules/bootstratp/js/dist/button.min.js',
  'node_modules/bootstratp/js/dist/carousel.min.js',
  'node_modules/bootstratp/js/dist/collapse.min.js',
  'node_modules/bootstratp/js/dist/dropdown.min.js',
  'node_modules/bootstratp/js/dist/index.min.js',
  'node_modules/bootstratp/js/dist/modal.min.js',
  'node_modules/bootstratp/js/dist/popover.min.js',
  'node_modules/bootstratp/js/dist/scrollspy.min.js',
  'node_modules/bootstratp/js/dist/tab.min.js',
  'node_modules/bootstratp/js/dist/tooltip.min.js',
  'node_modules/bootstratp/js/dist/util.min.js'
])
  .pipe(gulp.dest('public/js')));

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], () => {
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'public/scss/*.scss'], ['sass']);
  exec('node ./bin/www');
  console.log('Starting server....');
});

gulp.task('default', ['js', 'serve']);
