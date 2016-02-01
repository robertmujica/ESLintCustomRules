var gulp = require('gulp');
var eslint = require('gulp-eslint');
var jsFiles = ['*.js', 'src/**/*.js'];
//var nodemon = require('gulp-nodemon');

gulp.task('default', function(){
    gulp.src(jsFiles)
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({
			// Load a specific ESLint config
			config: 'config.json',
            rulesdir : 'eslint-rules/'
		}))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format());
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        //.pipe(eslint.failAfterError());
});