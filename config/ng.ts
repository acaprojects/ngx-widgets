import { spawn } from 'child_process';
import { platform } from 'process';

const proc = (cmd, args) =>
    new Promise((resolve, reject) => {
        const p = createSpawn(cmd, args);
        p.on('exit', (code, signal) => code === 0 ? resolve() : reject(signal));
    });

const npmScript = (name) => (...args) =>
    proc('npm', ['run', name, '--', ...args]);

function createSpawn(cmd, args) {
    return platform === 'win32' ? spawn(cmd, args, { shell: true, stdio: 'inherit' }) : spawn(cmd, args, { stdio: 'inherit' });
}

export const ng = npmScript('ng');
export const packagr = npmScript('packagr');
