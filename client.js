"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tunnel_1 = require("./tunnel");
var fixture_1 = require("./api/fixture");
var api_resource_1 = require("./api/api-resource");
var WEB_HOST = "https://www.butterflyfx.io";
var ButterflyFXClient = (function () {
    function ButterflyFXClient(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.project, project = _c === void 0 ? null : _c, _d = _b.token, token = _d === void 0 ? null : _d;
        this.project = project;
        if (token) {
            api_resource_1.APIResource.setToken("Bearer", token);
        }
        this._token = token;
    }
    ButterflyFXClient.prototype.tunnel = function (address) {
        var options = {
            projectId: this.project,
            address: address,
            apiKey: this._token
        };
        tunnel_1.tunnel(options);
    };
    ButterflyFXClient.prototype.generateFixture = function (data) {
        if (data === void 0) { data = {}; }
        var fixture = new fixture_1.default(data);
        if (this.project) {
            fixture.project = this.project;
        }
        fixture.generateRevision(data);
        return fixture;
    };
    ButterflyFXClient.prototype.saveFixture = function (fixture) {
        // Check if we're supplied data vs an actual fixture object
        if (!(fixture && fixture.revision && fixture.revision.html)) {
            fixture = this.generateFixture(fixture);
        }
        return fixture_1.default.save(fixture);
    };
    return ButterflyFXClient;
}());
exports.default = ButterflyFXClient;
