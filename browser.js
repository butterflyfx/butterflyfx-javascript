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
var yaku_1 = require("yaku");
var WEB_HOST = window['BUTTERFLYFX_API_HOST'] || "https://www.butterflyfx.io";
// To add to window
if (!window['Promise']) {
    window['Promise'] = yaku_1.default;
}
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
var ButterflyFX = (function (_super) {
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
    ButterflyFX.prototype.selectFixtureElement = function () {
        var _this = this;
        this.generateStyleSheet();
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
            if (!e.ctrlKey) {
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
        return new yaku_1.default(function (resolve, reject) {
            var showFixtureDialog = function (e) {
                e.preventDefault();
                body.removeClass(className);
                body.off('mouseover', highlightSelectedFixture);
                body.off('keydown', highlightSelectedFixture);
                body.off('click', showFixtureDialog);
                body.off('contextmenu', showFixtureDialog);
                var element = umbrellajs_1.u(e.target);
                element.trigger('mouseout');
                if (_this.lastSelectedElement !== document.body && _this.lastSelectedElement !== document.body.parentElement) {
                    var selector = unique_selector_1.default(e.target).replace("html > body > ", "");
                    resolve(selector);
                }
                else {
                    resolve(null);
                }
            };
            body.on('mouseover', highlightSelectedFixture);
            body.on('keydown', highlightSelectedFixture);
            body.on('click', showFixtureDialog);
            body.on('contextmenu', showFixtureDialog);
        });
    };
    ButterflyFX.prototype.showFixtureDialog = function () {
        var _this = this;
        var fixture = this.generateFixture();
        this.selectFixtureElement().then(function (selector) {
            if (selector) {
                fixture.selector = selector;
            }
            var modal = picomodal({
                'content': "<iframe id=\"bfx-frame\" style=\"height: 50vh; min-height: 400px; width: 100%; border: none\" src=\"" + WEB_HOST + "/dash/bookmarklet\"></iframe>",
                'width': '50vw',
                'height': '50vh',
            }).afterClose(function (modal) { modal.destroy(); }).show();
            var element = document.querySelector('#bfx-frame');
            _this.messageHandler = new window_message_handler_1.default(element.contentWindow, null, null);
            _this.messageHandler.addActionHandler('onPageLoad', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.messageHandler.sendMessage("setFixture", fixture);
            });
            _this.messageHandler.addActionHandler('onPageClose', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                modal.close();
            });
        });
    };
    return ButterflyFX;
}(client_1.default));
exports.default = ButterflyFX;
