"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiffDOM = require("diff-dom");
var unique_selector_1 = require("unique-selector");
var handlebars_1 = require("handlebars");
var dd = new DiffDOM();
var ALLOWED_KEYBOARD_EVENTS = {
    "Enter": "\n",
    "Tab": "\t"
};
function isValidKeyboardEvent(e) {
    var event = e;
    return Object.keys(ALLOWED_KEYBOARD_EVENTS).indexOf(event.key) !== -1;
}
var PageRecorder = /** @class */ (function () {
    function PageRecorder() {
        this.body = document.body;
        this.history = [];
    }
    PageRecorder.prototype.stopRecording = function () {
        this.body.removeEventListener('change', this._diffEventListener);
        this._resolve(this.history);
        return this.history;
    };
    PageRecorder.prototype.expectValue = function (selector, value) {
        var diff = dd.diff(this._originalBody, this.body);
        this.history.push({
            event: "expect",
            target: selector,
            diff: diff,
            value: value
        });
    };
    PageRecorder.prototype.insertValue = function (selector, value) {
        var diff = dd.diff(this._originalBody, this.body);
        var element = document.querySelector(selector);
        var result = handlebars_1.default.compile(value.trim())(this.environment.variables);
        element.setAttribute('value', result);
        this.history.push({
            event: "change",
            target: selector,
            diff: diff,
            value: value
        });
    };
    PageRecorder.prototype.startRecording = function (body) {
        var _this = this;
        if (body === void 0) { body = document.body; }
        this.body = body;
        return new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            var original = _this.body.cloneNode(true);
            _this._originalBody = original;
            _this._stopEventListener = function () { return _this.stopRecording(); };
            _this._selectorEventListener = function (e) {
                var target = e.target;
                e.target['_bfxSelector'] = unique_selector_1.default(target);
            };
            _this._diffEventListener = function (e) {
                if (e.type == 'keydown' && !isValidKeyboardEvent(e)) {
                    return;
                }
                var diff = dd.diff(original, _this.body);
                var item = {
                    event: e.type,
                    target: e.target['_bfxSelector'] || unique_selector_1.default(e.target),
                    diff: diff,
                };
                if (item.target.indexOf('basicContext') !== -1) {
                    return;
                }
                if (item.event === "change") {
                    item.value = e.target['value'];
                    var lastEvent = _this.history[_this.history.length - 1];
                    var lastValue = lastEvent.value || "";
                    if (_this.environment) {
                        lastValue = handlebars_1.default.compile(lastValue.trim())(_this.environment.variables);
                    }
                    else {
                        lastValue = lastValue.trim();
                    }
                    // Avoid duplicate change events.
                    if (lastEvent.event === "change" && lastValue === item.value.trim()) {
                        return;
                    }
                }
                if (item.event === "keydown") {
                    item.event = "change";
                    var key = ALLOWED_KEYBOARD_EVENTS[e.key];
                    item.value = e.target['value'] + key;
                }
                _this.history.push(item);
                console.log(item);
            };
            _this.body.addEventListener('click', _this._selectorEventListener, { capture: true, passive: true });
            _this.body.addEventListener('focus', _this._selectorEventListener, { capture: true, passive: true });
            _this.body.addEventListener('click', _this._diffEventListener);
            _this.body.addEventListener('change', _this._diffEventListener);
            _this.body.addEventListener('keydown', _this._diffEventListener, { capture: true, passive: true });
        });
    };
    return PageRecorder;
}());
exports.PageRecorder = PageRecorder;
