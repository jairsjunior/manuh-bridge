var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('lint', function() {
    return gulp.src('src/manuh-bridge.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('dist', function() {
    return gulp.src(['src/**/*.js'])
        // .pipe(concat('manuh-bridge.js'))
        .pipe(gulp.dest('dist'))
        // .pipe(rename('manuh-bridge.min.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
