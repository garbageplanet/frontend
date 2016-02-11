/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
var gulp = require('gulp'),
    inject = require('gulp-inject'),
    deleteLines = require('gulp-delete-lines'),
    stripDebug = require('gulp-strip-debug'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del');

// Remove the local src scripts and styles from the head of the html
gulp.task('trimHTML', function () {
  return gulp.src('./html/index.html')
   .pipe(deleteLines({
      'filters': [/<script\s+type=["']text\/javascript["']\s+src=/i]
    }))
   .pipe(deleteLines({
      'filters': [/<link\s+rel=["']stylesheet["']\s+type=/i]
    }))
  .pipe(gulp.dest('./temp/'));
});

// Minify the styleshseets and concat them in order
gulp.task('styles', ['trimHTML'], function() {
  return gulp.src([
                    './html/css/font-awesome-4.5.0.css',
                    './html/css/google-work-sans.css',
                    './html/css/trashbag.css',
                    './html/css/bootstrap-3.3.6.css',
                    './html/css/bootstrap-datetimepicker-4.17.37.css',
                    './html/css/bootstrap-select-1.9.4.css',
                    './html/css/bootstrap-tagsinput-0.4.3.css',
                    './html/css/leaflet-0.7.7.css',
                    './html/css/leaflet.draw.css',
                    './html/css/L.Control.Sidebar-0.19a.css',
                    './html/css/main.css',
                    './html/css/map.css',
                    './html/css/markers.css'
                  ])
      .pipe(concat('styles.min.css'))
      .pipe(minifyCSS({discardComments: {removeAll: true}}))
      .pipe(gulp.dest('./dist/'));
});

// Minify head scripts and concat them in order
gulp.task('scripts:leaflet', ['trimHTML'], function() {
  return gulp.src([
                    './html/js/libs/Leaflet-0.7.7.js',
                    './html/js/libs/L.hash.js',
                    './html/js/libs/L.zoomCSS.js',
                    './html/js/libs/L.Control.Sidebar-0.19a.js',
                    './html/js/libs/L.Overpass.Layer.js',
                    './html/js/libs/L.Draw.js'
                  ])
    .pipe(stripDebug())
    .pipe(concat('leaflet.min.js'))
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(gulp.dest('dist/'));
});

// Minify head scripts and concat them in order
gulp.task('scripts:jquery', ['trimHTML'], function() {
  return gulp.src([
                    './html/js/libs/jquery-2.2.0.js',
                    './html/js/libs/Moment-2.10.6.js',
                    './html/js/libs/bootstrap-tagsinput-0.4.3.js',
                    './html/js/libs/bootstrap-datetimepicker-4.17.37.js',
                    './html/js/libs/bootstrap-3.3.6.js',
                    './html/js/libs/bootstrap-select-1.9.4.js',
                    './html/js/libs/bootstrap-validator-0.9.0.js',
                    './html/js/libs/jquery.ui.widget.js','./html/js/libs/jquery-fileupload.js'
                  ])
    .pipe(stripDebug())
    .pipe(concat('jquery.min.js'))
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(gulp.dest('dist/'));
});

// Minify body scripts and concat them in order
gulp.task('scripts:app', ['trimHTML'], function() {
  return gulp.src([
                    './html/js/config.js',
                    './html/js/map.js',
                    './html/js/get_features.js',
                    './html/js/ui.js',
                    './html/js/authenticate.js',
                    './html/js/map_actions.js',
                    './html/js/uploader.js',
                    './html/js/form_submit.js',
                    './html/js/draw.js'
                  ])
    .pipe(stripDebug())
    .pipe(concat('app.min.js'))
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(gulp.dest('dist/'));
});

// Inject minifed files path in head and body
gulp.task('injectFiles', ['scripts:leaflet', 'scripts:jquery', 'scripts:app', 'styles'/*, 'styles:bootstrap', 'styles:leaflet', 'styles:app'*/], function() {
  return gulp.src('./temp/index.html')
  // inject styles
    .pipe(inject(gulp.src('./dist/styles.min.css', {read: false}), {starttag: '<!-- inject:head:css:styles -->', ignorePath: 'dist', addRootSlash: false}))
  // Inject scriptd
    .pipe(inject(gulp.src('./dist/leaflet.min.js', {read: false}), {starttag: '<!-- inject:body:leaflet -->', ignorePath: 'dist', addRootSlash: false}))
    .pipe(inject(gulp.src('./dist/jquery.min.js', {read: false}), {starttag: '<!-- inject:body:jquery -->', ignorePath: 'dist', addRootSlash: false}))
    .pipe(inject(gulp.src('./dist/app.min.js', {read: false}), {starttag: '<!-- inject:body:app -->', ignorePath: 'dist', addRootSlash: false}))
    .pipe(gulp.dest('temp1/'));
});        

// Minify the html, clean comments and spaces
gulp.task('minifyHTML', ['injectFiles'], function() {
  return gulp.src('./temp1/index.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean:start', function() {
    return del([
                'dist/', 
                'temp',
                'temp1'
               ]);
});

gulp.task('clean:end', ['injectFiles'], function() {
    return del([ 
                'temp',
                'temp1'
               ]);
});

gulp.task('copy:fonts', ['clean:end'], function() {
    return gulp.src('html/css/fonts/**/*', {base: 'html/css/fonts'})
      .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy:media', ['clean:end'], function() {
    return gulp.src('html/images/*', {base: 'html/images'})
      .pipe(gulp.dest('dist/images'));
});

gulp.task('default', ['clean:start'], function() {
    gulp.start('trimHTML', 'scripts:leaflet', 'scripts:jquery', 'scripts:app', 'styles', 'injectFiles', 'minifyHTML', 'clean:end', 'copy:fonts', 'copy:media');
});
