"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiffDOM = require("diff-dom");
var unique_selector_1 = require("unique-selector");
var dd = new DiffDOM();
var PageRecorder = /** @class */ (function () {
    function PageRecorder() {
        this.body = document.body;
        this.history = [];
    }
    PageRecorder.prototype.stopRecording = function () {
        this.body.removeEventListener('contextmenu', this._stopEventListener);
        this.body.removeEventListener('contextmenu', this._stopEventListener);
        this.body.removeEventListener('change', this._diffEventListener);
        this._resolve(this.history);
    };
    PageRecorder.prototype.startRecording = function (body) {
        var _this = this;
        if (body === void 0) { body = document.body; }
        this.body = body;
        return new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            var original = _this.body.cloneNode(true);
            _this._stopEventListener = function () { return _this.stopRecording(); };
            _this._selectorEventListener = function (e) {
                var target = e.target;
                e.target['_bfxSelector'] = unique_selector_1.default(target);
            };
            _this._diffEventListener = function (e) {
                var diff = dd.diff(original, document.body);
                var item = {
                    event: e.type,
                    target: e.target['_bfxSelector'],
                    diff: diff,
                };
                if (item.event === "change") {
                    item.value = e.target['value'];
                }
                _this.history.push(item);
                console.log(item);
            };
            _this.body.addEventListener('click', _this._selectorEventListener, { capture: true, passive: true });
            _this.body.addEventListener('click', _this._diffEventListener);
            _this.body.addEventListener('change', _this._diffEventListener);
            _this.body.addEventListener('contextmenu', _this._stopEventListener);
        });
    };
    return PageRecorder;
}());
exports.PageRecorder = PageRecorder;
