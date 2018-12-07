import { Dashboard } from './dashboard';
import { ng } from './ng';

import * as packager from 'electron-packager';
import * as gulp from 'gulp';
import * as install from 'gulp-install';
import * as runSequence from 'run-sequence';
import * as yargs from 'yargs';

const argv = yargs.argv;

const ngargs: string[] = [];

if (argv.prod || (argv.demo === true && argv.prod !== 'false')) { ngargs.push('--prod'); }
if (argv.aot || (argv.demo === true && argv.aot !== 'false')) { ngargs.push('--aot'); }
if (argv.port) { ngargs.push(`--port=${argv.port}`); }

Dashboard.show(argv.prod ? 'prod' : 'dev');

gulp.task('build', (next) => runSequence('pre-build', 'ng:build', 'post-build', next));

gulp.task('build-lib', (next) => runSequence('pre-build:lib', 'package:lib', next));

gulp.task('serve', (next) => runSequence('pre-serve', 'ng:serve', next));

gulp.task('ng:build', () => ng('build', ...ngargs));

gulp.task('ng:serve', () => ng('serve', ...ngargs));

gulp.task('package', (next) => runSequence('build', 'install', 'package-app', next));

gulp.task('install', () => gulp.src('./dist/package.json').pipe(install({ production: true })));

gulp.task('package-app', () =>
    packager({
        dir: './dist',
        out: '_package',
        overwrite: true,
        icon: './dist/assets/icon/favicon',
    }, (error, appPaths) => {
        console.log('===========================================================');
        console.log('================ Electron Packager Results ================');
        console.log('===========================================================');
        if (error) {
            console.log(error);
        } else if (appPaths) {
            console.log(appPaths.join('\n'));
        }
    })
);
