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
var Project = /** @class */ (function (_super) {
    __extends(Project, _super);
    function Project(data) {
        var _this = _super.call(this, data) || this;
        _this._basePath = Project._basePath;
        return _this;
    }
    Object.defineProperty(Project, "_basePath", {
        get: function () { return "projects"; },
        enumerable: true,
        configurable: true
    });
    return Project;
}(api_resource_1.APIResource));
exports.default = Project;
