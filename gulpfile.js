/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
var gulp = require('gulp'),
    env = require('dotenv').config(),
    gulpif = require('gulp-if'),
    inject = require('gulp-inject'),
    injectStr = require('gulp-inject-string'),
    // stripDebug = require('gulp-strip-debug'),
    concat = require('gulp-concat'),
    purify = require('gulp-purifycss'),
    minifyCSS = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    replace = require('gulp-replace-task'),
    gutil = require('gulp-util'),
    injectstr = require('gulp-inject-string'),
    uuid = require('uuid-lib'),
    exec = require('child_process').exec;

var production = process.env.PRODUCTION === 'true' ? true : false;

var reservedvars = ['$','jQuery','L','tmpl','flatpickr','Tour','tagsinput','Navigo'];

// Compile the templates
gulp.task('templates', function (cb) {
  exec('cd $(pwd)/src/js/templates && tmpl.js \
                                      tmpl_moda*.html \
                                      tmpl_form_*.html \
                                      tmpl_social_links.html \
                                      tmpl_mobile_menu.html \
                                      tmpl_topbar_main.html \
                                      tmpl_sidebar_*.html \
                                      tmpl_auth_*.html \
                                      tmpl_info_*.html > tmpl.js', function (err, stdout, stderr) { console.log(stdout); console.log(stderr); cb(err); });
});

// Remove the local src scripts and styles from the head of the html
gulp.task('trimHTML', ['templates'], function () {
  return gulp.src('./src/index.html')
  .pipe(gulp.dest('./temp/'));
});

// Minify the styleshseets and concat them in order
gulp.task('styles', ['templates'], function () {
  return gulp.src([
                    './src/vendor/Normalize-7.0.0.css',
                    './src/vendor/font-garbageplanet.css',
                    // './src/vendor/bootstrap-select-1.12.4.css',
                    './src/vendor/bootstrap-3.3.6.css',
                    './src/vendor/bootstrap-select-1.9.4.css',
                    './src/vendor/bootstrap-tagsinput-0.4.3.css',
                    './src/vendor/bootstrap-horizon.css',
                    './src/vendor/bootstrap-tour-0.10.1.css',
                    './src/vendor/bootstrap-datatables-1.10.11.css',
                    './src/vendor/leaflet-1.0.1.css',
                    './src/vendor/L.Markercluster-1.0.0.css',
                    './src/vendor/L.Compact.Attributions.css',
                    './src/vendor/L.Geocoder.Opencage-1.1.2.css',
                    './src/vendor/L.Draw-0.4.10.css',
                    './src/vendor/L.Control.Sidebar-0.19a.css',
                    './src/vendor/L.Control.Locate.css',
                    './src/vendor/flatpickr.css',
                    './src/css/main.css',
                    './src/css/markers.css'
                  ])

      .pipe(concat('styles.min.css'))
      // .pipe(purify(['.src/vendor/*.js','./src/js/**/*.js','./src/js/templates/*.html', './*.html']))
      //.pipe(minifyCSS({discardComments: {removeAll: true}}))
      .pipe(gulp.dest('./dist/'));
});
// Minify leaflet scripts and concat them in order
gulp.task('scripts:leaflet', ['templates'], function () {

  return gulp.src([
                    './src/vendor/leaflet-1.2.0.js',
                    './src/vendor/L.Markercluster-1.0.0.js',
                    // './src/vendor/L.Hash-2.0.0.js',
                    './src/vendor/L.Hash.js',
                    './src/vendor/L.zoomCSS.js',
                    './src/vendor/L.Control.Locate.js',
                    './src/vendor/L.Compact.Attributions.js',
                    './src/vendor/L.Control.Sidebar-0.19a.js',
                    './src/vendor/L.Overpass.Layer.js',
                    //'./src/vendor/L.Draw-0.4.10.js',
                    './src/vendor/L.Geocoder.Opencage-1.1.2.js',
                    './src/vendor/L.Control.Login.js',
                    './src/vendor/L.Control.Menu.js'
                  ])
    .pipe(gulpif(production, replace('console.log', '//console.log')))
    .pipe(gulpif(production, uglify({mangle: { reserved: reservedvars }, compress: false/*, preserveComments: 'license'*/}).on('error', gutil.log)))
    .pipe(concat('leaflet.min.js'))
    .pipe(gulp.dest('./temp/'));
});

// Minify util scripts and concat them in order
gulp.task('scripts:jquery', ['templates'], function () {

  return gulp.src([
                    './src/vendor/navigo.js',
                    './src/vendor/jquery-3.2.0.js',
                    // './src/vendor/jquery-3.2.1-slim.js',
                    './src/vendor/bootstrap-tagsinput-0.4.3.js',
                    './src/vendor/bootstrap-3.3.7.js',
                    './src/vendor/bootstrap-select-1.9.4.js',
                    // './src/vendor/bootstrap-select-1.12.4.js',
                    './src/vendor/bootstrap-validator-0.9.0.js',
                    './src/vendor/bootstrap-tour-0.10.1.js',
                    // './src/vendor/simple-ajax-uploader-2.6.2.js',
                    './src/vendor/bootstrap-datatables-1.10.11.js',
                    './src/vendor/flatpickr.js'
  ])
    // .pipe(gulpif(production, stripDebug()))
    .pipe(gulpif(production, replace('console.log', '//console.log')))
    .pipe(gulpif(production, uglify({mangle: { reserved: reservedvars }, compress: false/*, preserveComments: 'license'*/}).on('error', gutil.log)))
    .pipe(concat('jquery.min.js'))
    .pipe(gulp.dest('./temp/'));
});
// Minify own scripts and concat them in order
gulp.task('scripts:app', ['templates'], function () {

  return gulp.src([
                    './src/js/config/api.js',
                    './src/js/ui/loader.js',
                    // './src/js/config/events.js',
                    // './src/js/config/strings.js',
                    './src/js/templates/tmpl.js',
                    './src/js/ui/tools.js',
                    './src/js/ui/alerts.js',
                    './src/js/map/map.js',
                    './src/js/ui/ui.js',
                    './src/js/session/auth.js',
                    './src/js/ui/router.js',
                    './src/js/map/features.js',
                    './src/js/map/actions.js',
                    './src/js/forms/submit.js',
                    './src/js/forms/forms.js',
                    './src/js/tour/tour.js',
                    './src/js/map/draw.js',
                    './src/js/social/social.js',
                    './src/js/init.js'
                  ])
    //.pipe(gulpif(production, stripDebug()))
    .pipe(gulpif(production, replace('console.log', '//console.log')))
    .pipe(gulpif(production, uglify({mangle: { reserved: reservedvars }, compress: false/*, preserveComments: 'license'*/}).on('error', gutil.log)))
    .pipe(concat('app.min.js').on('error', gutil.log))
    .pipe(gulp.dest('./temp/'));
});
// Replace strings and concat minifed scripts in order
gulp.task('scripts:all', ['scripts:leaflet', 'scripts:jquery', 'scripts:app'], function () {

    return gulp.src([
        './temp/jquery.min.js',
        './temp/leaflet.min.js',
        './temp/app.min.js',
    ])
    .pipe(replace({
      patterns: [
        {
          match: 'server',
          replacement: process.env.SERVER
        },
        {
          match: 'root',
          replacement: process.env.ROOT
        },
        {
          match: 'mapboxtoken',
          replacement: process.env.MAPBOX_TOKEN
        },
        {
          match: 'imgurtoken',
          replacement: process.env.IMGUR_TOKEN
        },
        {
          match: 'windowtoken',
          replacement: process.env.WINDOW_TOKEN
        },
        /*{
          match: 'facebooktoken',
          replacement: process.env.FB_token
        },*/
        {
          match: 'opencagetoken',
          replacement: process.env.OC_TOKEN
        },
        {
          match: 'opengraphiotoken',
          replacement: process.env.OG_TOKEN
        },
        {
          match: 'production',
          replacement: process.env.PRODUCTION
        },
        {
          match: 'ga',
          replacement: process.env.GA
        }
      ]
    }))
    .pipe(concat('app.js').on('error', gutil.log))
    .pipe(gulp.dest('dist/'));
});
// Inject minifed files path in head and body
gulp.task('injectFiles', ['scripts:all', 'styles'], function () {
  return gulp.src('./temp/index.html')
    // inject styles
    .pipe(inject(gulp.src('./dist/styles.min.css', {read: false}), {starttag: '<!-- inject:head:css:styles -->', ignorePath: 'dist', addRootSlash: false}))
    // Inject scripts
    .pipe(inject(gulp.src('./dist/app.js', {read: false}), {starttag: '<!-- inject:body:app -->', ignorePath: 'dist', addRootSlash: false}))
    // .pipe(injectstr.before('</body', '<script src="https://garbageplanet.disqus.com/embed.js"></script>\n'))
    .pipe(gulp.dest('temp1/'));
});
// Minify the html, clean comments and spaces
gulp.task('minifyHTML', ['injectFiles'], function () {
  return gulp.src('./temp1/index.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('dist/'));
});
gulp.task('clean:start', function () {
    return del([
        'dist/',
        'temp',
        'temp1'
    ]);
});
gulp.task('clean:end', ['minifyHTML'], function () {
    return del([
        'temp',
        'temp1'
    ]);
});
gulp.task('copy:fonts', ['clean:end'], function () {
    return gulp.src('src/vendor/fonts/**/*', {base: 'src/vendor/fonts'})
      .pipe(gulp.dest('dist/fonts'));
});
gulp.task('copy:media', ['clean:end'], function () {
    return gulp.src(['src/images/*/**','src/images/*'], {base: 'src/images'})
      .pipe(gulp.dest('dist/images'));
});
gulp.task('copy:favicon', ['clean:end'], function () {
    return gulp.src('./src/favicon.ico', {base: 'src/'})
      .pipe(gulp.dest('./dist'));
});
gulp.task('copy:manifest', ['clean:end'], function () {
    return gulp.src('./src/manifest.json', {base: 'src/'})
      .pipe(gulp.dest('./dist'));
});
gulp.task('default', ['clean:start'], function () {
    gulp.start(
      'templates',
      'trimHTML',
      'scripts:leaflet',
      'scripts:jquery',
      'scripts:app',
      'scripts:all' ,
      'styles',
      'injectFiles',
      'minifyHTML',
      'clean:end',
      'copy:fonts',
      'copy:media',
      'copy:favicon',
      'copy:manifest'
    );
});
