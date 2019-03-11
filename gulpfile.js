const { watch, series, parallel, src, dest } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const browserify = require('browserify');
const rename = require('gulp-rename');
const source     = require('vinyl-source-stream');


sass.compiler = require('node-sass');

function buildSass() {
    return src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('css/'));
};

function buildCssVendor() {
    return src(['node_modules/normalize.css/normalize.css', 'node_modules/@glidejs/glide/dist/css/glide.core.min.css', 'node_modules/fullpage.js/dist/fullpage.min.css'])
        .pipe(concat('css/vendor.css'))
        .pipe(dest('./'));
};

function buildJs() {
    return browserify({
            entries: ['js/main.js']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(dest('./'));
};

watch('scss/*.scss', buildSass);
watch('js/*.js', buildJs);

exports.buildJs = buildJs;
exports.buildCss = series(buildSass, buildCssVendor);
exports.default = parallel(buildSass, buildCssVendor,buildJs);
