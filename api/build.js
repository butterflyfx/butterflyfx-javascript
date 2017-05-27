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
var Build = (function (_super) {
    __extends(Build, _super);
    function Build(data) {
        var _this = _super.call(this, data) || this;
        _this._basePath = Build._basePath;
        return _this;
    }
    Object.defineProperty(Build, "_basePath", {
        get: function () { return "builds"; },
        enumerable: true,
        configurable: true
    });
    return Build;
}(api_resource_1.APIResource));
exports.default = Build;
