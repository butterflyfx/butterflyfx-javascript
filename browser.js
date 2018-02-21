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
var client_1 = require("./client");
var window_message_handler_1 = require("./window-message-handler");
var umbrellajs_1 = require("umbrellajs");
var unique_selector_1 = require("unique-selector");
var picomodal = require("picomodal");
var recorder_1 = require("./recorder");
var basicContext = require("basiccontext");
var yaku_1 = require("yaku");
global.Promise = yaku_1.default;
var WEB_HOST = window['BUTTERFLYFX_WEB_HOST'] || "https://www.butterflyfx.io";
function generateStyleSheet(ruleset) {
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    var sheet;
    if (style.sheet) {
        sheet = style.sheet;
    }
    else if (style.styleSheet) {
        sheet = style.styleSheet;
    }
    else {
        return;
    }
    Object.keys(ruleset).forEach(function (name) {
        var rules = ruleset[name];
        if (!sheet.insertRule) {
            sheet.addRule(name, rules);
        }
        else {
            sheet.insertRule(name + "{" + rules + "}", 0);
        }
    });
    return style;
}
var SELECTOR_RECORDING = "SELECTOR_RECORDING";
var ButterflyFX = /** @class */ (function (_super) {
    __extends(ButterflyFX, _super);
    function ButterflyFX() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButterflyFX.prototype.generateStyleSheet = function () {
        this._stylesheet = generateStyleSheet({
            ".butterflyfx-fixture-selector > *": "opacity: 0.25;",
            ".butterflyfx-fixture-selector .active": "opacity: 1",
            ".butterflyfx-fixture-selector .active.selected": "border: 3px solid red !important;",
            ".butterflyfx-fixture-selector .active ~ *, .butterflyfx-fixture-selector .active > *:not(.active)": "opacity: 0.25"
        });
        this._stylesheet.id = "butterflyfx-fixture-stylesheet";
    };
    ButterflyFX.prototype.removeStyleSheet = function () {
        if (!this._stylesheet) {
            this._stylesheet = document.getElementById("butterflyfx-fixture-stylesheet");
        }
        this._stylesheet.parentElement.removeChild(this._stylesheet);
    };
    ButterflyFX.prototype.tunnel = function (address) {
        console.error("Tunneling not available through browser");
    };
    ButterflyFX.prototype.selectFixtureElement = function (highlightSelected) {
        var _this = this;
        if (highlightSelected === void 0) { highlightSelected = false; }
        var className = "butterflyfx-fixture-selector";
        var body = umbrellajs_1.u(document.body.parentElement);
        body.addClass(className);
        var highlightSelectedFixture = function (e) {
            var clearClasses = function (el) {
                el.removeClass('active');
                el.removeClass('selected');
                var parent = e.target.parentElement;
                while (parent) {
                    umbrellajs_1.u(parent).removeClass('active');
                    parent = parent.parentElement;
                }
            };
            clearClasses(umbrellajs_1.u('.active.selected'));
            var element;
            if (!(e.ctrlKey || highlightSelected)) {
                element = umbrellajs_1.u(document.body);
            }
            else if (e.target === document.body.parentElement) {
                element = umbrellajs_1.u(document.body);
            }
            else if (e.type === "keydown") {
                var hoveredElements = document.querySelectorAll(":hover");
                element = umbrellajs_1.u(hoveredElements[hoveredElements.length - 1]);
            }
            else {
                element = umbrellajs_1.u(e.target);
            }
            var parent = e.target.parentElement;
            while (parent) {
                umbrellajs_1.u(parent).addClass('active');
                umbrellajs_1.u(parent).removeClass('selected');
                parent = parent.parentElement;
            }
            element.addClass('active');
            element.addClass('selected');
            element.on('mouseout', function () {
                clearClasses(element);
            });
            _this.lastSelectedElement = element.first();
        };
        return new Promise(function (resolve, reject) {
            var showFixtureDialog = function (e) {
                e.preventDefault();
                body.removeClass(className);
                body.off('mouseover', highlightSelectedFixture);
                body.off('keydown', highlightSelectedFixture);
                document.body.removeEventListener('click', showFixtureDialog, true);
                body.off('contextmenu', showFixtureDialog);
                var element = umbrellajs_1.u(e.target);
                element.trigger('mouseout');
                if (e.type === "contextmenu") {
                    e.stopPropagation();
                    resolve(SELECTOR_RECORDING);
                }
                else if (_this.lastSelectedElement !== document.body && _this.lastSelectedElement !== document.body.parentElement) {
                    var selector = unique_selector_1.default(e.target).replace("html > body > ", "");
                    e.stopPropagation();
                    resolve(selector);
                }
                else {
                    e.stopPropagation();
                    resolve(null);
                }
            };
            body.on('mouseover', highlightSelectedFixture);
            body.on('keydown', highlightSelectedFixture);
            document.body.addEventListener('click', showFixtureDialog, true);
            body.on('contextmenu', showFixtureDialog);
        });
    };
    ButterflyFX.prototype._generateRecordingContextMenu = function (recording) {
        var _this = this;
        this.generateStyleSheet();
        this._stylesheet.innerHTML = this._stylesheet.innerHTML + "\n        .basicContext,.basicContext *{box-sizing:border-box}.basicContextContainer{position:fixed;width:100%;height:100%;top:0;left:0;z-index:1000;-webkit-tap-highlight-color:transparent}.basicContext{position:absolute;opacity:0;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.basicContext__item{cursor:pointer}.basicContext__item--separator{float:left;width:100%;height:1px;cursor:default}.basicContext__item--disabled{cursor:default}.basicContext__data{min-width:140px;padding-right:20px;text-align:left;white-space:nowrap}.basicContext__icon{display:inline-block}.basicContext--scrollable{height:100%;-webkit-overflow-scrolling:touch;overflow-y:auto}.basicContext--scrollable .basicContext__data{min-width:160px}\n        .basicContext{padding:6px;background-color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.4),0 0 1px rgba(0,0,0,.2);border-radius:3px}.basicContext__item{margin-bottom:2px}.basicContext__item--separator{margin:4px 0;background-color:rgba(0,0,0,.1)}.basicContext__item--disabled{opacity:.5}.basicContext__item:last-child{margin-bottom:0}.basicContext__data{padding:6px 8px;color:#333;border-radius:2px}.basicContext__item:not(.basicContext__item--disabled):hover .basicContext__data{color:#fff;background-color:#4393e6}.basicContext__item:not(.basicContext__item--disabled):active .basicContext__data{background-color:#1d79d9}.basicContext__icon{margin-right:10px;width:12px;text-align:center}\n        ";
        var items;
        var showContext = function (e) { return basicContext.show(items, e); };
        document.body.addEventListener('contextmenu', showContext);
        items = [
            {
                title: 'Insert value', icon: 'ion-plus-round', fn: function (e) {
                    window.requestAnimationFrame(function () {
                        _this.selectFixtureElement(true).then(function (selector) {
                            var element = document.querySelector(selector);
                            if (element.tagName != "INPUT") {
                                return;
                            }
                            var text = umbrellajs_1.u(selector).text();
                            var result = prompt("Enter value or use {{ variable }} for an environment variable", text);
                            if (result) {
                                recording.insertValue(selector, result);
                            }
                        });
                    });
                    return false;
                }
            },
            {
                title: 'Expect value', icon: 'ion-plus-round', fn: function (e) {
                    window.requestAnimationFrame(function () {
                        _this.selectFixtureElement(true).then(function (selector) {
                            var text = umbrellajs_1.u(selector).text();
                            var result = prompt("Enter expected value", text);
                            recording.expectValue(selector, result);
                        });
                    });
                    return false;
                }
            },
            {},
            {
                title: 'Stop recording', icon: 'ion-log-out', fn: function (e) {
                    e.stopPropagation();
                    recording.stopRecording();
                    document.body.removeEventListener('contextmenu', showContext);
                    basicContext.close();
                }
            },
        ];
    };
    ButterflyFX.prototype.showSaveDialog = function (fixture) {
        var _this = this;
        var modal = picomodal({
            'content': "<iframe id=\"bfx-frame\" style=\"height: 50vh; min-height: 400px; min-width: 420px; width: 100%; border: none\" src=\"" + WEB_HOST + "/dash/bookmarklet\"></iframe>",
            'width': '50vw',
            'height': '50vh',
        }).afterClose(function (modal) { modal.destroy(); }).show();
        var element = document.querySelector('#bfx-frame');
        this.messageHandler = new window_message_handler_1.default(element.contentWindow, null, null);
        this.messageHandler.addActionHandler('onPageLoad', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.messageHandler.sendMessage("setFixture", fixture);
        });
        this.messageHandler.addActionHandler('onPageClose', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            modal.close();
        });
    };
    ButterflyFX.prototype.showFixtureDialog = function () {
        var _this = this;
        var fixture = this.generateFixture();
        picomodal({
            'content': "<iframe id=\"bfx-selection-frame\" style=\"height: 25vh; width: 100%; border: none; margin-left: -10px\" src=\"" + WEB_HOST + "/dash/selection\"></iframe>",
            'width': '25vw',
            'height': '25vh',
            "modalStyles": { "min-width": "420px" },
            closeButton: false
        }).afterCreate(function (modal) {
            var element = document.querySelector('#bfx-selection-frame');
            _this.generateStyleSheet();
            _this.messageHandler = new window_message_handler_1.default(element.contentWindow, null, null);
            _this.messageHandler.addActionHandler('onStartRecording', function (payload) {
                modal.close();
                var recording = new recorder_1.PageRecorder();
                if (payload.environments) {
                    recording.environment = payload.environments[0];
                    var variables_1 = {};
                    payload.environments[0].variables.forEach(function (item) {
                        variables_1[item.key] = item.value;
                    });
                    recording.environment.variables = variables_1;
                }
                _this._generateRecordingContextMenu(recording);
                recording.startRecording().then(function (history) {
                    if (history.length > 0) {
                        fixture.revision.rules = JSON.stringify(history);
                    }
                    _this.showSaveDialog(fixture);
                });
            });
            _this.messageHandler.addActionHandler('onGenerateSnapshot', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                modal.close();
                _this.selectFixtureElement().then(function (selector) {
                    if (selector) {
                        fixture.selector = selector;
                    }
                    _this.showSaveDialog(fixture);
                });
            });
            _this.messageHandler.addActionHandler('onPageClose', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                modal.close();
            });
        }).afterClose(function (modal, event) {
            modal.destroy();
        }).show();
    };
    return ButterflyFX;
}(client_1.default));
exports.default = ButterflyFX;
