const {src, dest, task, series, watch, parallel } = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const rm = require( 'gulp-rm');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const webpack = require("webpack-stream");

const env = "dev";
const dist = "./dist/";




// Static server
task('server', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
        
    });
});

task('clean', function () {    
    return src("dist/**/*", {read: false }).pipe(rm());
    
}
)

task('copy_html', function () {
    return src("src/*.html").pipe(dest("dist"));
}
)

task('copy_img', function () {
    
    return src("src/img/**/*")
    .pipe(dest("dist/img"));
}
)

task('copy_fonts', function () {
    return src("src/fonts/**/*").pipe(dest("dist/fonts"));
}
)

task('copy_js', function () {
    return src("src/js/**/*").pipe(dest("dist/js"));
}
)
task('copy_assets', function () {
    return src("src/assets/**/*").pipe(dest("dist/assets"));
}
)

const slyles_bootstrap = [    
    "src/css/bootstrap-reboot.min.css",
    "src/css/bootstrap-grid.min.css",
    "node_modules/normalize.css/normalize.css",
    "src/css/fonts_001.css"
]

task('copy_css_bootstrap', function () {
    return src(slyles_bootstrap).pipe(dest("dist/css"));
}
)

task('style', function () {
    return src("src/sass/style.sass")
        .pipe(gulpif(env == "dev", sourcemaps.init())) 
        .pipe(concat('style.sass'))                 
        .pipe(sass(/* {outputStyle: 'compressed'} */).on('error', sass.logError))
        .pipe(rename({
            prefix: "",
            suffix: ".min",
            }))
        
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(gulpif(env == "prod",cleanCSS({compatibility: 'ie8'})))
        .pipe(gulpif(env == "dev",sourcemaps.write())) 
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());

})

task("build-js", () => {
    return src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(dest(dist))
                .pipe(browserSync.stream());
});


task("build-prod-js", () => {
    return src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(dest(dist));
});


task('watch', function(){
    watch("src/sass/**/*.+(scss|sass)",parallel('style'))
    watch("src/*.html").on("change", series( 'copy_html', browserSync.reload))
    watch("src/img/**/*").on("change", series( 'copy_img', browserSync.reload))
    watch("src/fonts/**/*").on("change", series( 'copy_fonts', browserSync.reload))
    watch("src/js/**/*").on("change", series( "build-js", browserSync.reload))
    watch("src/mp3/**/*").on("change", series( 'copy_assets', browserSync.reload))

});

task('default', series('clean', parallel('copy_html','copy_css_bootstrap', 'copy_img', 'copy_fonts',  'copy_assets', 'style', "build-js"), parallel('server','watch' )));
task('prod', series('clean', parallel('copy_html','copy_css_bootstrap', 'copy_img', 'copy_fonts',  'copy_assets', 'style',"build-prod-js"), parallel('server','watch' )));