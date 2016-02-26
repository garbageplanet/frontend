/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
var gulp = require('gulp'),
    inject = require('gulp-inject'),
    deleteLines = require('gulp-delete-lines'),
    stripDebug = require('gulp-strip-debug'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    replace = require('gulp-replace-task'),
    env = require('./env.json');

// Remove the local src scripts and styles from the head of the html
gulp.task('trimHTML', function () {
  return gulp.src('./src/index.html')
   .pipe(deleteLines({
      'filters': [/<script\s+type=["']text\/javascript["']\s+src=/i]
    }))
   .pipe(deleteLines({
      'filters': [/<link\s+rel=["']stylesheet["']\s+type=/i]
    }))
  .pipe(gulp.dest('./temp/'));
});

// Replace hardcoded tokens and keys for build
/*gulp.task('replaceTokens', ['trimHTML'], function () {
  gulp.src(['./src/js/map/map.js', './src/js/forms/uploader.js', './src/js/forms/form-submit.js', './src/js/social/share.js'])
    .pipe(replace({
      patterns: [
        {
          match: 'mapboxToken',
          replacement: env.mapbox.token
        },
        {
          match: 'imgurToken',
          replacement: env.imgur.token
        },
        {
          match: 'windowToken',
          replacement: env.window.token
        },
        {
          match: 'facebookToken',
          replacement: env.facebook.token
        }
      ]
    }))
    .pipe(gulp.dest('./temp/'));
});*/

// Minify the styleshseets and concat them in orde
gulp.task('styles', ['trimHTML'], function() {
  return gulp.src([
                    './src/css/font-awesome-4.5.0.css',
                    './src/css/google-work-sans.css',
                    './src/css/trashbag.css',
                    './src/css/bootstrap-3.3.6.css',
                    './src/css/bootstrap-datetimepicker-4.17.37.css',
                    './src/css/bootstrap-select-1.9.4.css',
                    './src/css/bootstrap-tagsinput-0.4.3.css',
                    './src/css/bootstrap-horizon.css',
                    './src/css/bootstrap-tour-0.10.1.css',
                    './src/css/leaflet-0.7.7.css',
                    './src/css/leaflet.draw.css',
                    './src/css/L.Control.Sidebar-0.19a.css',
                    './src/css/main.css',
                    './src/css/map.css',
                    './src/css/markers.css'
                  ])
      .pipe(concat('styles.min.css'))
      .pipe(minifyCSS({discardComments: {removeAll: true}}))
      .pipe(gulp.dest('./dist/'));
});

// Minify head scripts and concat them in order
gulp.task('scripts:leaflet', ['trimHTML'], function() {
  return gulp.src([
                    './src/js/libs/Leaflet-0.7.7.js',
                    './src/js/libs/L.hash.js',
                    './src/js/libs/L.zoomCSS.js',
                    './src/js/libs/L.Control.Sidebar-0.19a.js',
                    './src/js/libs/L.Overpass.Layer.js',
                    './src/js/libs/L.Draw.js'
                  ])
    .pipe(stripDebug())
    .pipe(concat('leaflet.min.js'))
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(gulp.dest('dist/'));
});

// Minify head scripts and concat them in order
gulp.task('scripts:jquery', ['trimHTML'], function() {
  return gulp.src([
                    './src/js/libs/jquery-2.2.0.js',
                    './src/js/libs/Moment-2.10.6.js',
                    './src/js/libs/bootstrap-tagsinput-0.4.3.js',
                    './src/js/libs/bootstrap-datetimepicker-4.17.37.js',
                    './src/js/libs/bootstrap-3.3.6.js',
                    './src/js/libs/bootstrap-select-1.9.4.js',
                    './src/js/libs/bootstrap-validator-0.9.0.js',
                    './src/js/libs/bootstrap-tour-0.10.1.js',
                    './src/js/libs/jquery.ui.widget.js',
                    './src/js/libs/jquery-fileupload.js'
                  ])
    .pipe(stripDebug())
    .pipe(concat('jquery.min.js'))
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(gulp.dest('dist/'));
});

// Minify body scripts and concat them in order
gulp.task('scripts:app', ['trimHTML'], function() {
  return gulp.src([
                    './src/js/config.js',
                    './src/js/ui/alerts.js',
                    './src/js/map/map.js',
                    './src/js/map/get_features.js',
                    './src/js/session/authenticate.js',
                    './src/js/session/session.js',
                    './src/js/ui/mobile.js',
                    './src/js/ui/topbar.js',
                    './src/js/ui/sidebar.js',
                    './src/js/ui/bottombar.js',
                    './src/js/ui/fullscreen.js',
                    './src/js/map/map_actions.js',
                    './src/js/map/features_actions.js',
                    './src/js/forms/uploader.js',
                    './src/js/forms/forms_submit.js',
                    './src/js/forms/forms_elements.js',
                    './src/js/draw.js',
                    './src/js/social/share.js'
                  ])
    .pipe(stripDebug())
    .pipe(concat('app.min.js'))
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(gulp.dest('dist/'));
});

// Inject minifed files path in head and body
gulp.task('injectFiles', ['scripts:leaflet', 'scripts:jquery', 'scripts:app', 'styles'], function() {
  return gulp.src('./temp/index.html')
  // inject styles
    .pipe(inject(gulp.src('./dist/styles.min.css', {read: false}), {starttag: '<!-- inject:head:css:styles -->', ignorePath: 'dist', addRootSlash: false}))
  // Inject scripts
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
    return gulp.src('src/css/fonts/**/*', {base: 'src/css/fonts'})
      .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy:media', ['clean:end'], function() {
    return gulp.src(['src/images/*/**','src/images/*'], {base: 'src/images'})
      .pipe(gulp.dest('dist/images'));
});

gulp.task('copy:favicon', ['clean:end'], function() {
    return gulp.src('./src/favicon.ico', {base: 'src/'})
      .pipe(gulp.dest('./dist'));
})
gulp.task('default', ['clean:start'], function() {
    gulp.start('trimHTML', /*'replaceTokens',*/ 'scripts:leaflet', 'scripts:jquery', 'scripts:app', 'styles', 'injectFiles', 'minifyHTML', 'clean:end', 'copy:fonts', 'copy:media', 'copy:favicon');
});
