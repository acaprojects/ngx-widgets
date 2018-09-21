
import { baseHref } from './default';

import * as yargs from 'yargs';
import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';
import * as sftp from 'gulp-sftp-clean';
import * as aws_s3 from 'gulp-s3-upload';

let credentials;

try {
    credentials = require('./credentials.json');
} catch (e) {
    console.log('Error loading upload credentials:', e ? e.code || '' : '');
}

const ssh_creds = credentials ? credentials.ssh || {} : {};
const aws_creds = credentials ? credentials.aws || {} : {};

const argv = yargs.argv;

if (ssh_creds.path && ssh_creds.path[0] !== '/') {
    ssh_creds.path = `${ssh_creds.path}`;
}

const s3 = aws_s3({
    accessKeyId: aws_creds.access_key_id,
    secretAccessKey: aws_creds.secret_access_key
});

gulp.task('upload', (next) => runSequence(/*'upload:sftp',*/ 'upload:aws-s3', next));

gulp.task('upload:sftp', () => {
    if (!ssh_creds || !ssh_creds.host) { return; }
    const remote_path = `${ssh_creds.path}${argv.route ? argv.route || baseHref : baseHref}/`;
    return gulp.src('./dist/**/*')
        .pipe(sftp({
            host: ssh_creds.host,
            port: ssh_creds.port,
            user: ssh_creds.user,
            pass: ssh_creds.pass,
            remotePath: remote_path,
            clearDestination: true
        }));
});

gulp.task('upload:aws-s3', () => {
    if (!aws_creds || !aws_creds.secret_access_key) { return; }
    let remote_path = `${(argv.route ? argv.route || baseHref : baseHref) || 'staff'}`;
    if (remote_path && remote_path[0] === '/') {
        remote_path = remote_path.substr(1);
    }
    const Bucket = aws_creds ? aws_creds.bucket || 'aca.test' : 'aca.test';
    return gulp.src('./dist/**/*')
        .pipe(s3({
            Bucket,
            ACL: 'public-read',
            keyTransform: (file) => `${remote_path}/${file}`
        }));
});

