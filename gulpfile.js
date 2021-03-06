const path          = require('path'),
      gulp          = require('gulp'),
      typescript    = require('gulp-typescript'),
      header        = require('gulp-header'),
      sourcemaps    = require('gulp-sourcemaps'),
      uglify        = require('gulp-uglify'),
      merge         = require('merge2'),
      del           = require('del');

// package.json as JS object
const pkg = require(path.join(__dirname, 'package.json'));

const banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

gulp.task('clean', function(done) {
    return del(['dist'], done);
});

gulp.task('build', ['clean'], function() {
    const taskConfigCjs = typescript.createProject('tsconfig.json', {
        target: 'ES5',
        'module': 'commonjs',
        moduleResolution: 'node',
        declaration: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        typescript: require('typescript')
    });

    const tsResult = gulp.src(['src/**/*.ts', 'typings/main.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(taskConfigCjs));

    return merge([
        tsResult.dts
            .pipe(header(banner, { pkg: pkg } ))
            .pipe(gulp.dest('dist/')),

        tsResult.js
            .pipe(uglify())
            .pipe(header(banner, { pkg: pkg } ))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/'))
    ]);
});
