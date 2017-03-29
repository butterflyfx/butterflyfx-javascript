var https = require('https');
var fs = require('fs');
var Promise = require('yaku');
var path = require('path');
var os = require('os');

var DOWNLOAD_URL_ROOT = "https://cdn.butterflyfx.io/file/butterflyfx-downloads/tunnelclient/"

function getDownloadUrl(){
    var platform = os.platform();
    var arch = os.arch();
    if (platform === 'linux' && arch === 'x64') {
        return DOWNLOAD_URL_ROOT + 'butterflyfx-tunnel-linux'
    } else if (platform === 'linux' && arch == 'ia32') {
        return DOWNLOAD_URL_ROOT + 'butterflyfx-tunnel-linux'
    } else if (platform === 'darwin') {
        return DOWNLOAD_URL_ROOT + 'butterflyfx-tunnel-mac'
    } else if (platform === 'win32') {
        return DOWNLOAD_URL_ROOT + 'butterflyfx-tunnel-win32.exe'
    } else {
        return null
    }
}

function download(url, dest, cb) {
    return new Promise(function(resolve,reject){
        var file = fs.createWriteStream(dest);
        var request = https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                fs.chmodSync(dest, 755);
                file.close(resolve);  // close() is async, call cb after close completes.
            });
        }).on('error', function(err) { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            reject(err.message);
        });
    })  
};
var url = getDownloadUrl();
var temp = url.split('/');
var filename = temp[temp.length - 1];
var destination = path.join(__dirname, filename)
console.log("Downloading...");
download(url, destination).then(()=>{
    console.log("Success!");
}).catch((e) => {
    console.log(e);
});;