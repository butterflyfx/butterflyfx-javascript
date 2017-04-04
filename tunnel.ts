import { spawn, ChildProcess } from 'child_process';
import * as os from 'os';
import * as path from 'path';


let DOWNLOAD_PATH;

interface TunnelOptions {
    projectId: number,
    apiKey: string,
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
    return spawn(prog, [`--project=${options.projectId}`, `--api-key="${options.apiKey}`]);
}