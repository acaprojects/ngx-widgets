import { spawn } from 'child_process';
import { platform } from 'process';

const proc = (cmd, args) =>
    new Promise((resolve, reject) => {
        const p = createSpawn(cmd, args);
        p.stdout.pipe(process.stdout);
        p.stderr.pipe(process.stderr);
        p.on('exit', (code, signal) => code == 0 ? resolve() : reject(signal));
    });

const npmScript = (name) => (...args) =>
    proc('npm', ['run', name, '--', ...args]);

function createSpawn(cmd, args) {
    return platform === 'win32' ? spawn(cmd, args, { shell: true }) : spawn(cmd, args);
}

export const ng = npmScript('ng');
