/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
var gulp = require('gulp'),
    Promise = require('es6-promise').Promise,
    inject = require('gulp-inject'),
    injectStr = require('gulp-inject-string'),
    deleteLines = require('gulp-delete-lines'),
    stripDebug = require('gulp-strip-debug'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    replace = require('gulp-replace-task'),
    gutil = require('gulp-util');
    // env = require('./env.json'); // contains token and app ids

// var csp = '<meta http-equiv="Content-Security-Policy" content="default-src http://garbageplanet.dist https://garbagepla.net https://*.garbagepla.net; connect-src http://garbageplanet.dist https://garbagepla.net https://garbagepla.net:* https://*.garbagepla.net https://*.garbagepla.net:* https://opengraph.io https://api.imgur.com/3/upload; script-src 'self' http://garbageplanet.dist https://garbagepla.net https://*.garbagepla.net https://api.opencagedata.com 'self'; style-src http://garbageplanet.dist https://garbagepla.net https://*.garbagepla.net 'unsafe-inline'; img-src http://garbageplanet.dist https://api.tiles.mapbox.com https://api.mapbox.com https://garbagepla.net https://*.garbagepla.net http://i.imgur.com data:; object-src 'self' http://garbageplanet.dist https://garbagepla.net https://*.garbagepla.net https://opengraph.io">'

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
          replacement: env.tools.token
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
                    './src/css/pace.css',
                    './src/css/font-awesome-4.5.0.css',
                    './src/css/google-work-sans.css',
                    './src/css/trashbag.css',
                    './src/css/bootstrap-3.3.6.css',
                    './src/css/bootstrap-datetimepicker-4.17.37.css',
                    './src/css/bootstrap-select-1.9.4.css',
                    './src/css/bootstrap-tagsinput-0.4.3.css',
                    './src/css/bootstrap-horizon.css',
                    './src/css/bootstrap-tour-0.10.1.css',
                    './src/css/bootstrap-datatables-1.10.11.css',
                    './src/css/leaflet-1.0.1.css',
                    './src/css/L.Markercluster-1.0.0.css',
                    './src/css/L.Compact.Attributions.css',
                    './src/css/L.Geocoder.Opencage-1.1.2.css',
                    './src/css/L.Draw-0.2.4.css',
                    './src/css/L.Control.Sidebar-0.19a.css',
                    './src/css/L.Control.Locate.css',
                    './src/css/main.css',
                    './src/css/markers.css'
                  ])
      .pipe(concat('styles.min.css'))
      .pipe(minifyCSS({discardComments: {removeAll: true}}))
      .pipe(gulp.dest('./dist/'));
});

// Minify head scripts and concat them in order
gulp.task('scripts:leaflet', ['trimHTML'], function() {
  return gulp.src([
                    './src/js/libs/leaflet-1.0.1.js',
                    './src/js/libs/L.Markercluster-1.0.0.js',
                    './src/js/libs/L.Hash.js',
                    './src/js/libs/L.zoomCSS.js',
                    './src/js/libs/L.Control.Locate.js',
                    './src/js/libs/L.Compact.Attributions.js',
                    './src/js/libs/L.Marker.Menu.js',
                    './src/js/libs/L.Control.Sidebar-0.19a.js',
                    './src/js/libs/L.Overpass.Layer.js',
                    './src/js/libs/L.Draw-0.2.4.js',
                    './src/js/libs/L.Geocoder.Opencage-1.1.2.js',
                    './src/js/libs/L.Control.Login.js'
                  ])
    .pipe(stripDebug())
    .pipe(concat('leaflet.min.js'))
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(gulp.dest('./temp/'));
});

// Minify head scripts and concat them in order
gulp.task('scripts:jquery', ['trimHTML'], function() {
  return gulp.src([
                    './src/js/libs/pace.js',
                    // './src/js/ui/init.js',
                    './src/js/libs/jquery-2.2.0.js',
                    './src/js/libs/Moment-2.10.6.js',
                    './src/js/libs/bootstrap-tagsinput-0.4.3.js',
                    './src/js/libs/bootstrap-datetimepicker-4.17.37.js',
                    './src/js/libs/bootstrap-3.3.6.js',
                    './src/js/libs/bootstrap-select-1.9.4.js',
                    './src/js/libs/bootstrap-validator-0.9.0.js',
                    './src/js/libs/bootstrap-tour-0.10.1.js',
                    './src/js/libs/jquery-ui-widget-1.11.4.js',
                    './src/js/libs/jquery-fileupload.js',
                    './src/js/libs/bootstrap-datatables-1.10.11.js',
                    './src/js/libs/jquery-touchwipe-1.1.1.js'
                  ])
    .pipe(stripDebug())
    .pipe(concat('jquery.min.js'))
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(gulp.dest('./temp/'));
});

// Minify body scripts and concat them in order
gulp.task('scripts:app', ['trimHTML'], function() {
  return gulp.src([
                    './src/js/config/config.js',
                    './src/js/templates/tmpl.js',
                    './src/js/ui/tools.js',
                    './src/js/session/session.js',
                    './src/js/ui/alerts.js',
                    './src/js/map/map.js',
                    './src/js/ui/ui.js',
                    './src/js/map/features.js',
                    './src/js/map/actions.js',
                    './src/js/forms/submit.js',
                    './src/js/forms/forms.js',
                    './src/js/tour/tour.js',
                    './src/js/map/draw.js',
                    './src/js/social/social.js'
                  ])
    .pipe(stripDebug())
    .pipe(uglify({mangle: false, compress: false}).on('error', gutil.log))
    .pipe(concat('app.min.js').on('error', gutil.log))
    .pipe(gulp.dest('./temp/'));
});

// Minify body scripts and concat them in order
gulp.task('scripts:all', ['scripts:leaflet', 'scripts:jquery', 'scripts:app'], function() {
  return gulp.src([
                    './temp/jquery.min.js',
                    './temp/leaflet.min.js',
                    './temp/app.min.js',
                  ])
    .pipe(concat('app.js').on('error', gutil.log))
    .pipe(gulp.dest('dist/'));
});

// Inject minifed files path in head and body
gulp.task('injectFiles', ['scripts:all', 'styles'], function() {
  return gulp.src('./temp/index.html')
  // inject styles
    .pipe(inject(gulp.src('./dist/styles.min.css', {read: false}), {starttag: '<!-- inject:head:css:styles -->', ignorePath: 'dist', addRootSlash: false}))
  // Inject scripts
  // FIXME GA can't work with current CSP
    .pipe(inject(gulp.src('./dist/app.js', {read: false}), {starttag: '<!-- inject:body:app -->', ignorePath: 'dist', addRootSlash: false}))
    // .pipe(injectStr.before('<link', "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-88740066-1', 'auto');ga('send', 'pageview');</script>"))
    // .pipe(injectStr.before('<meta', csp))
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

gulp.task('clean:end', ['minifyHTML'], function() {
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
});

gulp.task('copy:manifest', ['clean:end'], function() {
    return gulp.src('./src/manifest.json', {base: 'src/'})
      .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['clean:start'], function() {
    gulp.start('trimHTML', /*'replaceTokens',*/ 'scripts:leaflet', 'scripts:jquery', 'scripts:app', 'scripts:all' , 'styles', 'injectFiles', 'minifyHTML', 'clean:end', 'copy:fonts', 'copy:media', 'copy:favicon', 'copy:manifest');
});
