"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tunnel_1 = require("./tunnel");
exports.tunnel = tunnel_1.tunnel;
var fixture_1 = require("./api/fixture");
var api_resource_1 = require("./api/api-resource");
var window_message_handler_1 = require("./window-message-handler");
var umbrellajs_1 = require("umbrellajs");
var unique_selector_1 = require("unique-selector");
var picomodal = require("picomodal");
var WEB_HOST = window['BUTTERFLYFX_API_HOST'] || "https://www.butterflyfx.io";
function generateStyleSheet(ruleset) {
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if (!style.sheet) {
        return;
    }
    Object.keys(ruleset).forEach(function (name) {
        var rules = ruleset[name];
        if (!style.sheet.insertRule) {
            (style.styleSheet || style.sheet).addRule(name, rules);
        }
        else {
            style.sheet.insertRule(name + "{" + rules + "}", 0);
        }
    });
    return style;
}
var ButterflyFXClient = (function () {
    function ButterflyFXClient(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.project, project = _c === void 0 ? null : _c, _d = _b.token, token = _d === void 0 ? null : _d;
        this.project = project;
        if (token) {
            api_resource_1.APIResource.setToken("Bearer", token);
        }
    }
    ButterflyFXClient.prototype.generateStyleSheet = function () {
        this._stylesheet = generateStyleSheet({
            ".butterflyfx-fixture-selector > *": "opacity: 0.25;",
            ".butterflyfx-fixture-selector .active": "opacity: 1",
            ".butterflyfx-fixture-selector .active.selected": "border: 1px solid red !important;",
            ".butterflyfx-fixture-selector .active ~ *, .butterflyfx-fixture-selector .active > *:not(.active)": "opacity: 0.25"
        });
        this._stylesheet.id = "butterflyfx-fixture-stylesheet";
    };
    ButterflyFXClient.prototype.removeStyleSheet = function () {
        if (!this._stylesheet) {
            this._stylesheet = document.getElementById("butterflyfx-fixture-stylesheet");
        }
        this._stylesheet.parentElement.removeChild(this._stylesheet);
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
    ButterflyFXClient.prototype.selectFixtureElement = function () {
        this.generateStyleSheet();
        var className = "butterflyfx-fixture-selector";
        var body = umbrellajs_1.u(document.body.parentElement);
        body.addClass(className);
        var highlightSelectedFixture = function (e) {
            var element;
            if (e.target === document.body.parentElement) {
                element = umbrellajs_1.u(document.body);
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
                element.removeClass('active');
                element.removeClass('selected');
                var parent = e.target.parentElement;
                while (parent) {
                    umbrellajs_1.u(parent).removeClass('active');
                    parent = parent.parentElement;
                }
            });
        };
        return new Promise(function (resolve, reject) {
            var showFixtureDialog = function (e) {
                e.preventDefault();
                body.removeClass(className);
                body.off('mouseover', highlightSelectedFixture);
                body.off('click', showFixtureDialog);
                body.off('contextmenu', showFixtureDialog);
                var element = umbrellajs_1.u(e.target);
                element.trigger('mouseout');
                if (e.type == "contextmenu") {
                    resolve(null);
                }
                else if (e.target !== document.body && e.target !== document.body.parentElement) {
                    var selector = unique_selector_1.default(e.target).replace("html > body > ", "");
                    resolve(selector);
                }
                else {
                    resolve(null);
                }
            };
            body.on('mouseover', highlightSelectedFixture);
            body.on('click', showFixtureDialog);
            body.on('contextmenu', showFixtureDialog);
        });
    };
    ButterflyFXClient.prototype.showFixtureDialog = function () {
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
    ButterflyFXClient.prototype.saveFixture = function (fixture) {
        // Check if we're supplied data vs an actual fixture object
        if (!(fixture && fixture.revision && fixture.revision.html)) {
            fixture = this.generateFixture(fixture);
        }
        return fixture_1.default.save(fixture);
    };
    return ButterflyFXClient;
}());
exports.ButterflyFXClient = ButterflyFXClient;
