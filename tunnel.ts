import { spawn, ChildProcess } from 'child_process';
import * as os from 'os';
import * as path from 'path';


let DOWNLOAD_PATH;

interface TunnelOptions {
    projectId: number,
    apiKey: string,
    address: string
}

export function getTunnelClientFilename(): string {
    let platform = os.platform();
    let arch = os.arch();
    if (platform === 'linux' && arch === 'x64') {
        return 'butterflyfx-tunnel-linux'
    } else if (platform === 'linux' && arch == 'ia32') {
        return 'butterflyfx-tunnel-linux'
    } else if (platform === 'darwin') {
        return 'butterflyfx-tunnel-mac'
    } else if (platform === 'win32') {
        return 'butterflyfx-tunnel-win32.exe'
    } else {
        return null
    }
}

export function tunnel(options: TunnelOptions): ChildProcess {
    let prog = path.join(__dirname, getTunnelClientFilename());
    let address = options.address || "localhost:80";
    let child = spawn(prog, [`--project=${options.projectId}`, `--api-key="${options.apiKey}"`, "tunnel", address], { detached: false });
    process.on('exit', function () {
        child.kill();
    });
    return child;
}

process.on('SIGINT', () => process.exit()); // catch ctrl-c
process.on('SIGTERM', () => process.exit()); // catch kill