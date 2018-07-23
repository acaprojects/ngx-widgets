import { spawn } from 'child_process';

const proc = (cmd, args) =>
    new Promise((resolve, reject) => {
        const p = spawn(cmd, args);
        p.stdout.pipe(process.stdout);
        p.stderr.pipe(process.stderr);
        p.on('exit', (code, signal) =>
            code == 0 ? resolve() : reject(signal));
    });

const npmScript = (name) => (...args) =>
    proc('npm', ['run', name, '--', ...args]);

export const ng = npmScript('ng');
