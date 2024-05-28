const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

gulp.task('sass-compile', function(){
    return gulp.src('./scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(concat('bundle.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css/'));
})

gulp.task('watch', function(){
    gulp.watch('./scss/**/*.scss', gulp.series('sass-compile'))
})
