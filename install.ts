import { getTunnelClientFilename } from './tunnel';
import * as https from 'https';
import Promise from 'yaku';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

var DOWNLOAD_URL_ROOT = "https://cdn.butterflyfx.io/file/butterflyfx-downloads/tunnelclient/"

function getDownloadUrl(): string {
    return DOWNLOAD_URL_ROOT + getTunnelClientFilename();
}

function download(url, dest): Promise<any> {
    return new Promise(function (resolve, reject) {
        var file = fs.createWriteStream(dest);
        var request = https.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                fs.chmodSync(dest, 755);
                file.close();  // close() is async, call cb after close completes.
                resolve();
            });
        }).on('error', function (err) { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            reject(err.message);
        });
    })
};
let filename = getTunnelClientFilename();
let url = getDownloadUrl();
var destination = path.join(__dirname, filename)
console.log("Downloading...");
download(url, destination).then(() => {
    console.log("Success!");
}).catch((e) => {
    console.log(e);
});;