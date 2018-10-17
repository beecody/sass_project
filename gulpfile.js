// Gulpfile
var gulp             =  require('gulp'),
    sass             = require('gulp-ruby-sass'),
    sourceMap        = require('gulp-sourcemaps'),
    autoprefixer     = require('gulp-autoprefixer'),
    notify           = require('gulp-notify'),
    browser_sync     = require('browser-sync'),
    gulpWatch        = require('gulp-watch'),
    imageMini        = require('gulp-imagemin'),
    cache            = require('gulp-cache'),
    // imageminOptipng  = require('imagemin-optipng'),
    imageminJpegtran = require('imagemin-jpegtran'),
    runSequence      = require('run-sequence');


gulp.task('sass-compile',function () {
    return sass('./style/sass/main.scss',{sourcemap: true})
        .on('error',console.error.bind(console))
        .on('error',function(error){
            notify({message:error.message});
        })
        .pipe(sourceMap.init({
            loadMaps:true
        }))
        .pipe(autoprefixer({
            browsers:'last 2 version',
            cascade:false
        }))
        .pipe(sourceMap.write())
        .pipe(gulp.dest('./style/css'))
        .pipe(notify({message:'SASS task complete'}));

});


gulp.task('watch-sass',['sass-compile'],function(){
    notify({message:'SASS file changed, reloading site'});
    browser_sync.reload();
});

gulp.task('image',function(){
	return gulp.src('./images/dist/**/*')
           .pipe(imageMini({
                progressive: true,
                verbose: true,
                use: [imageminJpegtran()]
            }))
		   .pipe(gulp.dest('./images/dist1/'))
		   .pipe(notify({message:'Images task completed'}));
});

gulp.task('server',['sass-compile'],function(){
    browser_sync.init({
        server:{
            baseDir:'./'
        }
    });

    gulp.watch('./style/sass/**/*.scss',['watch-sass']);
    gulp.watch('./node_modules/bootstrap/scss/**/*.scss',['watch-sass']);
    gulp.watch('./**/*.html',browser_sync.reload);
    gulp.watch('./js/**/*.js',browser_sync.reload);

});
