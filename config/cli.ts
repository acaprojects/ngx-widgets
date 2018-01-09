
import { spawn } from 'child_process';
import { Dashboard } from './dashboard';

import * as packager from 'electron-packager';
import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as install from 'gulp-install';
import * as runSequence from 'run-sequence';
import * as yargs from 'yargs';

const argv = yargs.argv;

Dashboard.show(argv.prod ? 'prod' : 'dev');

gulp.task('build', () => runSequence('prebuild', 'ng:build', 'postbuild'));

gulp.task('serve', () => runSequence('prebuild', 'ng:serve'));

gulp.task('ng:build', (next) => {
    const prod = argv.prod !== undefined || argv.production !== undefined;
    const aot = argv.aot !== undefined;
    const worker = argv.worker !== undefined || argv.webworker !== undefined;
    const args = ['build'];
    if (prod) { args.push('--prod'); }
    if (aot) { args.push('--aot'); }
    const cli_process = spawn(`ng`, args);
    cli_process.stdout.pipe(process.stdout);
    cli_process.stderr.pipe(process.stderr);
    cli_process.stdout.on('close', () => { next(); });
});

gulp.task('ng:serve', (next: any) => {
    const aot = argv.aot !== undefined;
    const args = ['serve'];
    if (aot) { args.push('--aot'); }
    const cli_process = spawn(`ng`, args);
    cli_process.stdout.pipe(process.stdout);
    cli_process.stderr.pipe(process.stderr);
    cli_process.stdout.on('close', () => { next(); });
});


gulp.task('package', () => runSequence('build', 'install', 'package-app'));

gulp.task('install', () => {
    return gulp.src('./dist/package.json').pipe(install({ production: true }));
});

gulp.task('package-app', () => {
    return packager({
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
    });
});
