
import * as del from 'del';
import * as gulp from 'gulp';
import * as bump from 'gulp-bump';
import * as tsc from 'gulp-typescript';
import * as jsonModify from 'gulp-json-modify';
import * as merge from 'merge';
import * as moment from 'moment';
import * as runSequence from 'run-sequence';
import * as yargs from 'yargs';

const tsProject = tsc.createProject('./tsconfig.json');

const npmconfig = require('../package.json');
const tscConfig = require('../tsconfig.json');

const paths = {
    src: tscConfig.compilerOptions.baseUrl,
    build: tscConfig.compilerOptions.outDir,
    content: 'docs/',
    public: 'dist/',    // packaged assets ready for deploy
};

/**
 * Pipe a collection of streams to and arbitrart destination and merge the
 * results.
 */
const pipeTo = (dest: NodeJS.ReadWriteStream) =>
    (...src: NodeJS.ReadableStream[]) =>
    merge(src.map((s) => s.pipe(dest)));

/**
 * Nuke old build assetts.
 */
gulp.task('clean', () => ((...globs: string[]) => del(globs))('dist/', 'compiled/', '_package'));

gulp.task('default', ['build']);

gulp.task('prebuild', () => {
    return 'Hurray!!!';
});

gulp.task('postbuild', () => runSequence('version'));

gulp.task('bump', () => {
    const argv = yargs.argv;
    const type = argv.major ? 'major' : (argv.minor ? 'minor' : 'patch');
    gulp.src('./package.json')
        .pipe(bump({type}))
        .pipe(gulp.dest('./'));
});

gulp.task('version', () => {
    gulp.src('./dist/assets/settings.json')
        .pipe(jsonModify({
            key: 'version',
            value: npmconfig.version,
        }))
        .pipe(jsonModify({
            key: 'build',
            value: moment().format('YYYY-MM-DD HH:mm:ss'),
        }))
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('usage', () => {
    console.log(`Commands:`);
    console.log(`    build - Build project`);
    console.log(`    bump  - Update project version`);
    console.log(`    clean - Nuke old build assets`);
    console.log(`    lint  - Lint Typescript and Sass files`);
    console.log(`    test  - Run tests`);
    console.log(`    usage - List available gulp tasks`);
});
