"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ACCESS_TOKEN = null;
var HTTP_NO_CONTENT = 204;
require('isomorphic-fetch');
exports.API_HOST = "/";
if (process.env.NODE_ENV === "development") {
    exports.API_HOST = "http://localhost:8000/api/";
    if (process.env.BUTTERFLYFX_TOKEN) {
        ACCESS_TOKEN = { "type": "Bearer", "value": process.env.BUTTERFLYFX_TOKEN };
    }
}
else {
    exports.API_HOST = global["BUTTERFLYFX_HOST"] || "https://www.butterflyfx.io/api/";
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function getDefaultHeaders() {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    if (ACCESS_TOKEN && ACCESS_TOKEN['type']) {
        headers['Authorization'] = ACCESS_TOKEN['type'] + " " + ACCESS_TOKEN['value'];
    }
    else {
        headers['X-CSRFToken'] = getCookie('csrftoken');
        ;
    }
    return headers;
}
var APIResource = /** @class */ (function () {
    function APIResource(data) {
        data = data || {};
        this.setDataObject(data);
        Object.defineProperty(this, '_basePath', { value: this._basePath || '', enumerable: false, configurable: true, writable: true });
    }
    APIResource.prototype.setDataObject = function (data) {
        Object.defineProperty(this, '_dataObject', { value: data, enumerable: false, configurable: true });
        // Make properties of data object accessible through this instance by default
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            try {
                this[key] = data[key];
            }
            catch (e) {
                // Ignore keys that can't be overwritten (such as getter / setter functions)
            }
        }
    };
    APIResource.pk = function (instance) {
        return instance.id;
    };
    APIResource.list = function (filter) {
        var _this = this;
        return this.getJSON(exports.API_HOST + this._basePath).then(function (result) {
            var object = result.map(function (item) { return new _this(item); });
            return Promise.resolve(object);
        });
    };
    APIResource.setToken = function (type, value) {
        ACCESS_TOKEN = { "type": type.charAt(0).toUpperCase() + type.slice(1), "value": value };
    };
    APIResource.getJSONFromAPIHost = function (url) {
        return this.getJSON(exports.API_HOST + url);
    };
    APIResource.postJSONFromAPIHost = function (url, data, method) {
        if (method === void 0) { method = "post"; }
        return this.postJSON(exports.API_HOST + url, data, method);
    };
    APIResource.get = function (id) {
        var _this = this;
        return this.getJSON(exports.API_HOST + this._basePath + "/" + id).then(function (result) {
            var object = new _this(result);
            return Promise.resolve(object);
        });
    };
    APIResource.getJSON = function (url) {
        var headers = getDefaultHeaders();
        return new Promise(function (resolve, reject) {
            try {
                fetch(url, { 'credentials': ACCESS_TOKEN ? undefined : 'same-origin', headers: headers }).then(function (response) {
                    if (response.status >= 400) {
                        reject("Bad response from server: " + response.status);
                    }
                    resolve(response.json());
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    APIResource.prototype.getJSON = function (url) {
        return APIResource.getJSON(url);
    };
    APIResource.postJSON = function (url, data, method) {
        if (method === void 0) { method = "post"; }
        var headers = getDefaultHeaders();
        return new Promise(function (resolve, reject) {
            try {
                fetch(url, {
                    'credentials': ACCESS_TOKEN ? undefined : 'same-origin',
                    method: method, headers: headers, body: JSON.stringify(data)
                }).then(function (response) {
                    if (response.status >= 400) {
                        reject("Bad response from server: " + response.status);
                    }
                    var result;
                    if (response.status === HTTP_NO_CONTENT) {
                        resolve({});
                    }
                    try {
                        result = response.json();
                    }
                    catch (e) {
                        result = response.text();
                    }
                    resolve(result);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    APIResource.prototype.postJSON = function (url, data, method) {
        return APIResource.postJSON(url, data, method);
    };
    APIResource.prototype.deleteJSON = function (url, data) {
        return this.postJSON(url, data, 'delete');
    };
    APIResource.delete = function (instance) {
        return this.postJSON(exports.API_HOST + this._basePath + "/" + this.pk(instance), instance, 'delete');
    };
    APIResource.save = function (instance) {
        if (instance.id) {
            return this.postJSON(exports.API_HOST + this._basePath + "/" + this.pk(instance), instance, 'put');
        }
        else {
            return this.postJSON(exports.API_HOST + this._basePath, instance);
        }
    };
    APIResource.prototype.save = function () {
        APIResource.save(this);
    };
    return APIResource;
}());
exports.APIResource = APIResource;
