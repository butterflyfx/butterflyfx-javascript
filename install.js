"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tunnel_1 = require("./tunnel");
var https = require("https");
var yaku_1 = require("yaku");
var fs = require("fs");
var path = require("path");
var DOWNLOAD_URL_ROOT = "https://cdn.butterflyfx.io/file/butterflyfx-downloads/tunnelclient/";
function getDownloadUrl() {
    return DOWNLOAD_URL_ROOT + tunnel_1.getTunnelClientFilename();
}
function download(url, dest) {
    return new yaku_1.default(function (resolve, reject) {
        var file = fs.createWriteStream(dest);
        var request = https.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                fs.chmodSync(dest, 755);
                file.close(); // close() is async, call cb after close completes.
                resolve();
            });
        }).on('error', function (err) {
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            reject(err.message);
        });
    });
}
;
var filename = tunnel_1.getTunnelClientFilename();
var url = getDownloadUrl();
var destination = path.join(__dirname, filename);
console.log("Downloading...");
download(url, destination).then(function () {
    console.log("Success!");
}).catch(function (e) {
    console.log(e);
});
;
