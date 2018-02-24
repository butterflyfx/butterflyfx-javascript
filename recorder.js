"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unique_selector_1 = require("unique-selector");
var handlebars_1 = require("handlebars");
var himalaya_1 = require("himalaya");
var jsondiffpatch = require('jsondiffpatch').create();
var ALLOWED_KEYBOARD_EVENTS = {
    "Enter": "\n",
    "Tab": "\t"
};
function removeComments(nodes) {
    if (!nodes) {
        return;
    }
    return nodes.filter(function (node) {
        if (node.type === 'comment') {
            return false;
        }
        else {
            node.children = removeComments(node.children);
            return true;
        }
    });
}
var unique = function (el) {
    var id = el.id;
    if (el.id.indexOf('ember') === 0) {
        el.id = "";
    }
    var selector = unique_selector_1.default(el).replace("html > body > ", "");
    el.id = id;
    if (selector.indexOf('>') !== -1) {
        if (document.querySelectorAll(selector).length > 1) {
            var subselector = selector.split('>').pop();
            return unique(el.parentNode) + ("> " + subselector);
        }
        else {
            return selector;
        }
    }
    return selector;
};
function isValidKeyboardEvent(e) {
    var event = e;
    return Object.keys(ALLOWED_KEYBOARD_EVENTS).indexOf(event.key) !== -1;
}
var PageRecorder = /** @class */ (function () {
    function PageRecorder() {
        this.recordHTML = false;
        this.body = document.body;
        this.history = [];
    }
    PageRecorder.prototype.generateHTMLJSON = function () {
        if (!this.recordHTML) {
            return;
        }
        var doc = this.body.parentElement.cloneNode(true);
        var inputs = Array.from(doc.querySelectorAll("input"));
        inputs.forEach(function (e) { return e.setAttribute('value', e.value); });
        return removeComments(himalaya_1.parse(doc.outerHTML));
    };
    PageRecorder.prototype.mergeHTMLDiff = function (item) {
        var output = {
            html: this.generateHTMLJSON(),
        };
        var lastEvent = this.history[this.history.length - 1];
        if (lastEvent && lastEvent.html) {
            output['diff'] = jsondiffpatch.diff(lastEvent.html, output.html);
        }
        return Object.assign({}, item, output);
    };
    PageRecorder.prototype.stopRecording = function () {
        this.body.removeEventListener('change', this._diffEventListener);
        if (this.recordHTML) {
            this.history.forEach(function (item) {
                if (item.diff) {
                    delete item.html;
                }
            });
        }
        this._resolve(this.history);
        return this.history;
    };
    PageRecorder.prototype.expectValue = function (selector, value) {
        var item = {
            event: "expect",
            target: selector,
            value: value
        };
        if (this.recordHTML) {
            item = this.mergeHTMLDiff(item);
        }
        this.history.push(item);
    };
    PageRecorder.prototype.insertValue = function (selector, value) {
        var element = document.querySelector(selector);
        var result = handlebars_1.default.compile(value.trim())(this.environment.variables);
        element.setAttribute('value', result);
        var item = {
            event: "change",
            target: selector,
            value: value
        };
        if (this.recordHTML) {
            item = this.mergeHTMLDiff(item);
        }
        this.history.push(item);
    };
    PageRecorder.prototype.startRecording = function (body, recordHTML) {
        var _this = this;
        if (body === void 0) { body = document.body; }
        if (recordHTML === void 0) { recordHTML = true; }
        this.body = body;
        this.recordHTML = recordHTML;
        return new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._stopEventListener = function () { return _this.stopRecording(); };
            _this._selectorEventListener = function (e) {
                var target = e.target;
                e.target['_bfxSelector'] = unique(target);
            };
            _this._diffEventListener = function (e) {
                if (e.type == 'keydown' && !isValidKeyboardEvent(e)) {
                    return;
                }
                var item = {
                    event: e.type,
                    target: e.target['_bfxSelector'] || unique(e.target),
                };
                if (_this.recordHTML) {
                    item = _this.mergeHTMLDiff(item);
                }
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
