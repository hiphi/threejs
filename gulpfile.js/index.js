//variable
const srcDir = "../src/";
const distName = "dist";
const distDir = "../" + distName + "/";

const { series, parallel, src, watch, dest, lastRun } = require("gulp");
const del = require('del');

const webpackStream = require('webpack-stream');
const webpackConfig = require('../webpack.config.js');
const webpack       = require('webpack');

const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');

const sass = require('gulp-sass');
const cssnext = require('gulp-postcss');
const cssmin = require('gulp-cssmin');

const concat = require('gulp-concat');
const uglify = require("gulp-uglify");

const imagemin = require('gulp-imagemin');

const livereload = require('gulp-livereload');
const http = require('http');
const st = require('st');
const plumber = require("gulp-plumber");

/*
 * Server Task
 */
function server(done) {
    http.createServer(
        st({ path: distDir, index: 'index.html', cache: false })
    ).listen( 9001, done );
};

/*
 * ejs task
 */
function ejsTask() {
    return src([srcDir + "ejs/**/*.ejs", "!ejs/**/_*.ejs"])
        .pipe(plumber())
        .pipe(ejs())
        .pipe(rename({extname:'.html'}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest(distDir + ''))
        .pipe(livereload());
};

/*
 * sass task
 */
function sassTask() {
    return src(srcDir + "scss/**/main.scss")
        .pipe(plumber({
            errorHandler: function(err) {
                console.log(err.messageFormatted);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(cssmin())
        .pipe(dest(distDir + "css/"))
        .pipe(livereload());
};

/*
 * ts libraries
 */
function tsLibraries(){
    return src([
        __dirname + '/../node_modules/jquery/dist/jquery.js',
        __dirname + '/../node_modules/jquery.easing/jquery.easing.min.js'/*,
        '../node_modules/three-orbitcontrols/OrbitControls.js'*/])
        .pipe(concat('lib/vender.js'))
        .pipe(uglify())
        .pipe(dest(distDir + ''));
};

/*
 * ImageMin Task
 */
const imageminOption = {
    optimizationLevel: 2,   // 試行回数
    progressive: true,      // jpgの軽量化
    svgoPlugins: [{         // svgの軽量化
        removeRasterImages: true,
        cleanupListOfValues: true,
        sortAttrs: true
    }]
};
function imageminTask() {
    return src(
        srcDir + 'images/**/*.+(jpg|jpeg|png|gif|svg)',
        {since:lastRun(imageminTask)})
        .pipe(imagemin(imageminOption))
        .pipe(dest( distDir + 'images/'));
};

function copyLib() {
    return src(
        [ srcDir + "lib/**/*" ],
        { base: srcDir }
    ).pipe( dest( distDir + '' ) );
};

function copyAsset() {
    return src([
            srcDir+"data/**/*",
            srcDir+"obj/**/*",
            srcDir+".htaccess",
            srcDir+"fonts/**/*",
            srcDir+"json/**/*",
            srcDir+'ext/**/*'  ],
        { base: srcDir, allowEmpty: true }
    ).pipe( dest( distDir + '' ) );
};

function venderAssets() {
    return src(
        [ srcDir+'vender-assets/**/*'  ],
        { base: srcDir + 'vender-assets/' }
    ).pipe( dest( distDir ) );

};

function webpackTask() {
    return src([srcDir  + "ts/**/*.ts"])
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig, webpack))
        //.pipe(uglify()) //圧縮
        .pipe(dest( distDir + 'js/' ));
};

/* -----------------------
  dist and staging Tasks
 ------------------------- */
function clean(){
    return del([
        distDir+'**/*'
    ],{force: true});
};

const watchTask = series(
    server,
    function watchList(cb) {
        watch(srcDir + "ts/**/*.ts", webpackTask);
        watch(srcDir + "scss/**/*.scss", sassTask);
        watch(srcDir + "ejs/**/*.ejs", ejsTask);
        cb();
    });

const publishTask = series(
    clean,
    series(
        sassTask, ejsTask, imageminTask,
        copyLib, webpackTask, venderAssets, copyAsset, tsLibraries )
);

exports.watch = watchTask;
exports.publish = publishTask;
exports.default = async function(){};