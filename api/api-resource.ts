let ACCESS_TOKEN = null;
let HTTP_NO_CONTENT = 204;
require('isomorphic-fetch');

export let API_HOST = "/";
if (process.env.NODE_ENV === "development") {
    API_HOST = "http://localhost:8000/api/";
    if (process.env.BUTTERFLYFX_TOKEN) {
        ACCESS_TOKEN = { "type": "Bearer", "value": process.env.BUTTERFLYFX_TOKEN };
    }
}
else {
    API_HOST = global["BUTTERFLYFX_HOST"] || "https://www.butterflyfx.io/api/";
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
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if (ACCESS_TOKEN && ACCESS_TOKEN['type']) {
        headers['Authorization'] = `${ACCESS_TOKEN['type']} ${ACCESS_TOKEN['value']}`;
    }
    else {
        headers['X-CSRFToken'] = getCookie('csrftoken');;
    }
    return headers;
}
export class APIResource {
    public static _basePath: string;
    public _basePath: string;

    public id: any;

    constructor(data) {
        data = data || {};
        this.setDataObject(data);
        Object.defineProperty(this, '_basePath', { value: this._basePath || '', enumerable: false, configurable: true, writable: true });
    }

    setDataObject(data) {
        Object.defineProperty(this, '_dataObject', { value: data, enumerable: false, configurable: true });
        // Make properties of data object accessible through this instance by default
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            try {
                this[key] = data[key];
            } catch (e) {
                // Ignore keys that can't be overwritten (such as getter / setter functions)
            }

        }
    }

    static pk(instance) {
        return instance.id;
    }

    static list(filter: any): Promise<any[]> {
        return this.getJSON(API_HOST + this._basePath).then((result: any[]) => {
            let object = result.map(item => new this(item));
            return Promise.resolve(object);
        });
    }

    static setToken(type, value) {
        ACCESS_TOKEN = { "type": type.charAt(0).toUpperCase() + type.slice(1), "value": value }
    }

    static getJSONFromAPIHost(url) {
        return this.getJSON(API_HOST + url);
    }

    static postJSONFromAPIHost(url, data, method = "post") {
        return this.postJSON(API_HOST + url, data, method);
    }

    static get(id) {
        return this.getJSON(API_HOST + this._basePath + "/" + id).then((result) => {
            let object = new this(result);
            return Promise.resolve(object);
        });
    }


    static getJSON(url): Promise<any> {
        const headers = getDefaultHeaders();
        return new Promise(function (resolve, reject) {
            try {
                fetch(url, { 'credentials': ACCESS_TOKEN ? undefined : 'same-origin', headers }).then(function (response) {
                    if (response.status >= 400) {
                        reject("Bad response from server: " + response.status);
                    }
                    resolve(response.json());
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    getJSON(url) {
        return APIResource.getJSON(url);
    }

    static postJSON(url, data, method = "post") {
        const headers = getDefaultHeaders();
        return new Promise(function (resolve, reject) {
            try {
                fetch(url, {
                    'credentials': ACCESS_TOKEN ? undefined : 'same-origin',
                    method: method, headers, body: JSON.stringify(data)
                }).then(function (response) {
                    if (response.status >= 400) {
                        reject("Bad response from server: " + response.status);
                    }
                    let result;
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
            } catch (e) {
                reject(e);
            }
        });
    }

    postJSON(url, data, method) {
        return APIResource.postJSON(url, data, method);
    }

    deleteJSON(url, data) {
        return this.postJSON(url, data, 'delete');
    }

    static delete(instance) {
        return this.postJSON(API_HOST + this._basePath + "/" + this.pk(instance), instance, 'delete');
    }

    static save(instance) {
        if (instance.id) {
            return this.postJSON(API_HOST + this._basePath + "/" + this.pk(instance), instance, 'put');
        }
        else {
            return this.postJSON(API_HOST + this._basePath, instance);
        }
    }

    save() {
        APIResource.save(this);
    }

}
