"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var api_resource_1 = require("./api-resource");
var sha1_1 = require("../lib/sha1");
var hashCode = function (aString) {
    // Normalize hashes by removing host references
    aString = aString.replace(new RegExp(window.location.host, 'g'), "");
    var hash = 0, i, chr, len;
    if (aString.length == 0)
        return hash;
    for (i = 0, len = aString.length; i < len; i++) {
        chr = aString.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
var config = { resolution: { height: 900, width: 1440 } };
var Fixture = (function (_super) {
    __extends(Fixture, _super);
    function Fixture(data) {
        return _super.call(this, data) || this;
    }
    Object.defineProperty(Fixture, "_basePath", {
        get: function () { return "fixtures"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fixture.prototype, "id", {
        get: function () {
            return this.slug;
        },
        enumerable: true,
        configurable: true
    });
    Fixture.pk = function (instance) {
        return instance.slug;
    };
    Fixture.generateRevision = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.html, html = _c === void 0 ? null : _c, _d = _b.path, path = _d === void 0 ? null : _d;
        var revision = {};
        if (!html) {
            var body = document.body;
            body.style.height = config.resolution.height + "px";
            body.style.width = config.resolution.width + "px";
            // Get all elements in a page an convert them into an array
            var elements = [].slice.call(document.getElementsByTagName('*'));
            elements = elements.map(function (el) {
                // Strip scripts from the page since they'll be removed server side anyway
                if (el.tagName.toLowerCase() == "script") {
                    el.parentNode.removeChild(el);
                    return;
                }
                var style = getComputedStyle(el);
                if (style.display == "none" || style.visibility == "hidden") {
                    return;
                }
                // Elements without an offset parent are hidden unless they're fixed
                if (style.position != "fixed" && !el.offsetParent) {
                    return;
                }
            });
            html = new XMLSerializer().serializeToString(document);
            body.style.height = '';
            body.style.width = '';
        }
        revision.html = html;
        revision.path = path || window.location.pathname;
        revision.hashkey = sha1_1.default(html);
        revision.origin = window.location.origin;
        return revision;
    };
    Fixture.prototype.generateRevision = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.html, html = _c === void 0 ? null : _c, _d = _b.path, path = _d === void 0 ? null : _d;
        var revision = Fixture.generateRevision({ html: html, path: path });
        this.revision = revision;
        return revision;
    };
    Fixture.list = function (projectId) {
        projectId = projectId || "all";
        return this.getJSON("" + api_resource_1.API_HOST + this._basePath + "/" + projectId);
    };
    Object.defineProperty(Fixture.prototype, "project", {
        get: function () {
            return this._project || 0;
        },
        set: function (value) {
            this._project = value;
        },
        enumerable: true,
        configurable: true
    });
    Fixture.getStyleReports = function (instance) {
        return this.getJSON("" + api_resource_1.API_HOST + this._basePath + "/" + instance.project + "/" + instance.slug + "/styles");
    };
    Fixture.generateBuild = function (instance) {
        return this.getJSON("" + api_resource_1.API_HOST + this._basePath + "/" + instance.project + "/" + instance.slug + "/build");
    };
    Fixture.prototype.getStyleReports = function () {
        return Fixture.getStyleReports(this);
    };
    Fixture.delete = function (instance) {
        return _super.postJSON.call(this, "" + api_resource_1.API_HOST + this._basePath + "/" + instance.project + "/" + instance.slug, instance, 'delete');
    };
    Fixture.prototype.delete = function () {
        return Fixture.delete(this);
    };
    Fixture.save = function (instance) {
        var _this = this;
        if (!instance.slug && instance.revision) {
            instance.slug = instance.revision.hashkey;
        }
        var pk = instance.oldSlug ? instance.oldSlug : instance.slug;
        delete instance.oldSlug;
        return _super.postJSON.call(this, "" + api_resource_1.API_HOST + this._basePath + "/" + instance.project + "/" + pk, instance, 'put').catch(function () {
            return _this.postJSON("" + api_resource_1.API_HOST + _this._basePath + "/" + instance.project, Object.assign({ project: instance.project }, instance), 'post');
        });
        ;
    };
    Fixture.prototype.save = function () {
        return Fixture.save(this);
    };
    return Fixture;
}(api_resource_1.APIResource));
exports.default = Fixture;
