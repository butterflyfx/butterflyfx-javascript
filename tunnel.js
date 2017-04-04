"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var os = require("os");
var path = require("path");
var DOWNLOAD_PATH;
function getTunnelClientFilename() {
    var platform = os.platform();
    var arch = os.arch();
    if (platform === 'linux' && arch === 'x64') {
        return 'butterflyfx-tunnel-linux';
    }
    else if (platform === 'linux' && arch == 'ia32') {
        return 'butterflyfx-tunnel-linux';
    }
    else if (platform === 'darwin') {
        return 'butterflyfx-tunnel-mac';
    }
    else if (platform === 'win32') {
        return 'butterflyfx-tunnel-win32.exe';
    }
    else {
        return null;
    }
}
exports.getTunnelClientFilename = getTunnelClientFilename;
function tunnel(options) {
    var prog = path.join(__dirname, getTunnelClientFilename());
    return child_process_1.spawn(prog, ["--project=" + options.projectId, "--api-key=\"" + options.apiKey]);
}
exports.tunnel = tunnel;
